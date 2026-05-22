#!/usr/bin/env python3
"""
Finds and archives duplicate GSR databases from failed/repeated setup runs.

Keeps: the 9 databases whose IDs are in notion-import/database_ids.json
Archives: any other database under GSR Production Workspace with the same names

Notion doesn't have a delete API — archiving removes them from view.
You can permanently delete archived pages from Notion's Trash.

Usage:
    NOTION_TOKEN=secret_xxxx python3 scripts/notion_cleanup_duplicates.py

    # Dry run — shows what would be archived but does nothing:
    DRY_RUN=1 NOTION_TOKEN=x python3 scripts/notion_cleanup_duplicates.py
"""

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
DRY_RUN = os.environ.get("DRY_RUN", "") == "1"
IDS_FILE = Path(__file__).parent.parent / "notion-import" / "database_ids.json"
PARENT_PAGE_ID = os.environ.get("NOTION_PARENT_ID", "367664ba431f802ab14ec19f4b77bb93")

if not NOTION_TOKEN and not DRY_RUN:
    sys.exit("NOTION_TOKEN environment variable not set.")

HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
}

KNOWN_DB_NAMES = {
    "Episodes", "Guests", "Tasks", "Assets", "ADRs",
    "Drive Files", "Graphics Tracking",
    "Platform Uploads", "Episode Metadata Drafts",
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
        body_text = e.read().decode()[:300]
        print(f"  ERROR {e.code}: {body_text}")
        raise


def get_db_title(db: dict) -> str:
    parts = db.get("title", [])
    return "".join(p.get("plain_text", "") for p in parts)


def search_all_databases() -> list:
    """Return all databases the integration can see."""
    results = []
    cursor = None
    while True:
        body = {"filter": {"value": "database", "property": "object"}, "page_size": 100}
        if cursor:
            body["start_cursor"] = cursor
        resp = api("POST", "/search", body)
        results.extend(resp.get("results", []))
        if not resp.get("has_more"):
            break
        cursor = resp.get("next_cursor")
        time.sleep(0.3)
    return results


def archive_database(db_id: str, name: str):
    if DRY_RUN:
        print(f"  [DRY RUN] Would archive: {name} ({db_id})")
        return
    api("PATCH", f"/pages/{db_id}", {"archived": True})
    print(f"  Archived: {name} ({db_id})")


def main():
    if DRY_RUN:
        print("DRY RUN — no changes will be made\n")

    if not IDS_FILE.exists():
        sys.exit(f"database_ids.json not found at {IDS_FILE}")

    ids = json.loads(IDS_FILE.read_text())
    # Normalize IDs: strip dashes for comparison
    keep_ids = {v.replace("-", "") for v in ids.values()}

    print("GSR Notion Duplicate Cleanup")
    print("=" * 50)
    print(f"Keeping {len(keep_ids)} databases from database_ids.json")
    print("Searching for all accessible databases...\n")

    all_dbs = search_all_databases()
    print(f"Found {len(all_dbs)} total databases visible to this integration\n")

    to_archive = []
    for db in all_dbs:
        raw_id = db["id"]
        clean_id = raw_id.replace("-", "")
        name = get_db_title(db)

        # Only touch databases with GSR names — don't touch unrelated workspaces
        if name not in KNOWN_DB_NAMES:
            continue

        if clean_id in keep_ids:
            print(f"  [KEEP]    {name} ({raw_id})")
        else:
            print(f"  [ARCHIVE] {name} ({raw_id})")
            to_archive.append((raw_id, name))

    print(f"\n{len(to_archive)} database(s) to archive, {len(keep_ids)} to keep\n")

    if not to_archive:
        print("✓ No duplicates found. Workspace is clean.")
        return

    if DRY_RUN:
        print("DRY RUN complete — run without DRY_RUN=1 to actually archive.")
        return

    confirm = input(f"Archive {len(to_archive)} duplicate database(s)? [y/N] ").strip().lower()
    if confirm != "y":
        print("Aborted.")
        return

    print()
    for db_id, name in to_archive:
        archive_database(db_id, name)
        time.sleep(0.5)

    print(f"\n✓ Archived {len(to_archive)} duplicate database(s).")
    print("  Find them in Notion's Trash to permanently delete if needed.")


if __name__ == "__main__":
    main()
