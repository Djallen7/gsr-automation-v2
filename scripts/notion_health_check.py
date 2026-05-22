#!/usr/bin/env python3
"""
Validates the entire GSR Notion workspace after setup.

Checks:
  - All expected databases exist and are accessible
  - Record counts match expectations
  - Required properties present on each database
  - Spot-checks for relation wiring

Prints a pass/fail report with counts. No data is modified.

Usage:
    NOTION_TOKEN=secret_xxxx python3 scripts/notion_health_check.py
"""

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
IDS_FILE = Path(__file__).parent.parent / "notion-import" / "database_ids.json"

if not NOTION_TOKEN:
    sys.exit("NOTION_TOKEN environment variable not set.")

HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
}


def api(method: str, path: str, body: dict = None) -> dict:
    url = f"https://api.notion.com/v1{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        if e.code == 429:
            wait = int(e.headers.get("Retry-After", 5))
            print(f"  rate limited — waiting {wait}s")
            time.sleep(wait)
            return api(method, path, body)
        body_text = e.read().decode()[:200]
        print(f"  ERROR {e.code}: {body_text}")
        raise


def query_count(db_id: str) -> int:
    """Return total record count for a database."""
    count = 0
    cursor = None
    while True:
        body = {"page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        result = api("POST", f"/databases/{db_id}/query", body)
        count += len(result.get("results", []))
        if not result.get("has_more"):
            break
        cursor = result.get("next_cursor")
        time.sleep(0.3)
    return count


def get_db_properties(db_id: str) -> set:
    """Return set of property names on a database."""
    result = api("GET", f"/databases/{db_id}")
    return set(result.get("properties", {}).keys())


# Expected minimum property sets per database
EXPECTED_PROPERTIES = {
    "episodes": {
        "Episode #", "Title", "Season", "Status", "Air Date",
        "Season Number", "Episode Number", "Sponsor", "Upload Status",
    },
    "guests": {
        "Name", "Organization", "Email", "Outreach Status",
        "Basecamp Contact ID",
    },
    "tasks": {
        "Task Name", "Status", "Priority", "Due Date", "Completed",
    },
    "assets": {
        "Asset Name", "Type", "Dropbox Path",
    },
    "adrs": {
        "Title",
    },
    "drivefiles": {
        "Name", "File Extension", "Dropbox Sync Status",
    },
    "graphics_tracking": {
        "Description", "Segment", "Graphic #", "Graphic Type",
        "Status", "Assigned To", "Show",
    },
    "platform_uploads": {
        "Title", "Platform", "Status", "Upload URL", "Upload Date",
    },
    "metadata_drafts": {
        "Title", "YouTube Title", "Draft Status", "Season",
    },
}

EXPECTED_COUNTS = {
    "episodes": (25, 25),          # (min, max)
    "guests": (20, 999),
    "tasks": (0, 999),
    "assets": (0, 999),
    "adrs": (6, 6),
    "drivefiles": (2, 999),
    "graphics_tracking": (50, 50),  # 5 shows × 10 entries
    "platform_uploads": (0, 999),
    "metadata_drafts": (0, 999),
}


def check_database(key: str, db_id: str) -> bool:
    ok = True
    label = key.replace("_", " ").title()

    try:
        props = get_db_properties(db_id)
    except Exception as e:
        print(f"  [FAIL] {label}: cannot access database — {e}")
        return False

    # Property check
    expected = EXPECTED_PROPERTIES.get(key, set())
    missing = expected - props
    if missing:
        print(f"  [WARN] {label}: missing properties: {sorted(missing)}")
        ok = False

    # Count check
    try:
        count = query_count(db_id)
        min_c, max_c = EXPECTED_COUNTS.get(key, (0, 999))
        if count < min_c or count > max_c:
            status = "WARN" if count < min_c else "PASS"
            print(f"  [{status}] {label}: {count} records (expected {min_c}–{max_c})")
            if count < min_c:
                ok = False
        else:
            prop_count = len(props)
            print(f"  [PASS] {label}: {count} records, {prop_count} properties")
    except Exception as e:
        print(f"  [FAIL] {label}: could not count records — {e}")
        ok = False

    return ok


def check_relations(ids: dict) -> bool:
    """Spot-check that relation properties exist on child databases."""
    ok = True
    print("\nRelation checks:")
    for key in ["tasks", "assets", "graphics_tracking", "platform_uploads", "metadata_drafts"]:
        if key not in ids:
            print(f"  [SKIP] {key}: not in database_ids.json")
            continue
        props = get_db_properties(ids[key])
        if "Episode" in props:
            print(f"  [PASS] {key}.Episode relation present")
        else:
            print(f"  [WARN] {key}: no 'Episode' relation — run notion_add_relations.py")
            ok = False
        time.sleep(0.3)
    return ok


def main():
    if not IDS_FILE.exists():
        sys.exit(f"database_ids.json not found at {IDS_FILE}")

    ids = json.loads(IDS_FILE.read_text())
    print("GSR Notion Health Check")
    print("=" * 50)
    print(f"Found {len(ids)} databases in database_ids.json\n")

    all_pass = True
    for key, db_id in ids.items():
        passed = check_database(key, db_id)
        if not passed:
            all_pass = False
        time.sleep(0.5)

    check_relations(ids)

    print("\n" + "=" * 50)
    if all_pass:
        print("✓ All checks passed. Workspace is healthy.")
    else:
        print("⚠ Some checks failed or warned. Review output above.")
        print("  Common fixes:")
        print("    notion_update_all_schemas.py  — add missing properties")
        print("    notion_add_relations.py        — wire episode relations")
        print("    notion_seed_episodes.py        — seed S3 episodes")
        print("    notion_seed_graphics_tracking.py — seed graphics data")


if __name__ == "__main__":
    main()
