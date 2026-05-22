#!/usr/bin/env python3
"""
Creates the Platform Uploads database in Notion.

Tracks where each episode has been published across all platforms
(YouTube, Rumble, Odysee, Facebook, Instagram Reels, Website).

Saves the new database ID to notion-import/database_ids.json.

Usage:
    NOTION_TOKEN=secret_xxxx python3 scripts/notion_add_platform_uploads.py
"""

import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
PARENT_PAGE_ID = os.environ.get("NOTION_PARENT_ID", "367664ba431f802ab14ec19f4b77bb93")
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


def save_id(key: str, db_id: str):
    ids = {}
    if IDS_FILE.exists():
        ids = json.loads(IDS_FILE.read_text())
    ids[key] = db_id
    IDS_FILE.write_text(json.dumps(ids, indent=2) + "\n")
    print(f"  Saved {key}: {db_id} → database_ids.json")


def main():
    print("Creating Platform Uploads database...")

    body = {
        "parent": {"type": "page_id", "page_id": PARENT_PAGE_ID},
        "title": [{"type": "text", "text": {"content": "Platform Uploads"}}],
        "properties": {
            "Title": {"title": {}},
            "Platform": {
                "select": {
                    "options": [
                        {"name": "YouTube", "color": "red"},
                        {"name": "Rumble", "color": "green"},
                        {"name": "Odysee", "color": "purple"},
                        {"name": "Facebook", "color": "blue"},
                        {"name": "Instagram Reels", "color": "pink"},
                        {"name": "Website", "color": "gray"},
                    ]
                }
            },
            "Status": {
                "select": {
                    "options": [
                        {"name": "Not Started", "color": "gray"},
                        {"name": "Queued", "color": "yellow"},
                        {"name": "Processing", "color": "blue"},
                        {"name": "Live", "color": "green"},
                        {"name": "Error", "color": "red"},
                        {"name": "Taken Down", "color": "default"},
                    ]
                }
            },
            "Upload URL": {"url": {}},
            "Upload Date": {"date": {}},
            "Scheduled Publish Date": {"date": {}},
            "Views": {"number": {"format": "number"}},
            "Views Updated At": {"date": {}},
            "Video ID": {"rich_text": {}},
            "Description Used": {"rich_text": {}},
            "Tags Used": {"multi_select": {"options": []}},
            "Upload Notes": {"rich_text": {}},
        },
    }

    result = api("POST", "/databases", body)
    raw_id = result["id"]
    db_id = raw_id.replace("-", "")

    print(f"  Created: Platform Uploads ({raw_id})")
    save_id("platform_uploads", raw_id)

    print("\n✓ Platform Uploads database created.")
    print("  Note: Episode relation will be added by notion_add_relations.py")
    print("\nNext: python3 scripts/notion_add_metadata_drafts.py")


if __name__ == "__main__":
    main()
