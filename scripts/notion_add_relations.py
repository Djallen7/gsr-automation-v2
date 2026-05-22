#!/usr/bin/env python3
"""
Wires cross-database relation properties across all GSR Notion databases.

Must be run AFTER all databases exist (run notion_add_platform_uploads.py
and notion_add_metadata_drafts.py first).

Relations created:
  Tasks.Episode            → Episodes (many tasks per episode)
  Assets.Episode           → Episodes (many assets per episode)
  Platform Uploads.Episode → Episodes (many platforms per episode)
  Metadata Drafts.Episode  → Episodes (one draft per episode)
  Graphics Tracking.Episode (converts rich_text → real relation)

Usage:
    NOTION_TOKEN=secret_xxxx python3 scripts/notion_add_relations.py
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
        body_text = e.read().decode()[:400]
        print(f"  ERROR {e.code}: {body_text}")
        raise


def add_relation(source_db_id: str, prop_name: str, target_db_id: str, label: str):
    """Add a relation property to source_db pointing at target_db."""
    print(f"  {label}: {prop_name} → episodes")
    try:
        api("PATCH", f"/databases/{source_db_id}", {
            "properties": {
                prop_name: {
                    "relation": {
                        "database_id": target_db_id,
                        "type": "single_property",
                        "single_property": {},
                    }
                }
            }
        })
        print(f"    ✓ Done")
    except Exception as e:
        print(f"    ✗ Failed: {e}")


def rename_graphics_episode_field(graphics_db_id: str):
    """
    The Graphics Tracking 'Episode' field is currently rich_text.
    Rename it to 'Episode (text)' to free up the name for the real relation.
    Notion cannot convert rich_text → relation in place; rename first.
    """
    print("  Graphics Tracking: renaming existing 'Episode' (rich_text) → 'Episode (text)'")
    try:
        api("PATCH", f"/databases/{graphics_db_id}", {
            "properties": {
                "Episode": {"name": "Episode (text)"}
            }
        })
        print("    ✓ Renamed")
    except Exception as e:
        print(f"    ✗ Could not rename: {e}")
        print("    → You may need to rename manually in Notion UI before re-running")


def main():
    if not IDS_FILE.exists():
        sys.exit(f"database_ids.json not found at {IDS_FILE}")

    ids = json.loads(IDS_FILE.read_text())

    required = ["episodes", "tasks", "assets", "graphics_tracking",
                "platform_uploads", "metadata_drafts"]
    missing = [k for k in required if k not in ids]
    if missing:
        sys.exit(
            f"Missing database IDs: {missing}\n"
            "Run notion_add_platform_uploads.py and notion_add_metadata_drafts.py first."
        )

    episodes_id = ids["episodes"]

    print("GSR Notion Relations Setup")
    print("=" * 50)

    # Rename the rich_text Episode field on Graphics Tracking first
    rename_graphics_episode_field(ids["graphics_tracking"])
    time.sleep(1)

    # Add relations
    add_relation(ids["tasks"], "Episode", episodes_id, "Tasks")
    add_relation(ids["assets"], "Episode", episodes_id, "Assets")
    add_relation(ids["graphics_tracking"], "Episode", episodes_id, "Graphics Tracking")
    add_relation(ids["platform_uploads"], "Episode", episodes_id, "Platform Uploads")
    add_relation(ids["metadata_drafts"], "Episode", episodes_id, "Metadata Drafts")

    print("\n✓ All relations created.")
    print("  Each child database now has an 'Episode' relation pointing to Episodes.")
    print("\nNext: python3 scripts/notion_seed_episodes.py")


if __name__ == "__main__":
    main()
