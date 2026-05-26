#!/usr/bin/env python3
"""
Creates the Episode Metadata Drafts database in Notion.

Source of truth for YouTube/platform upload copy: titles, descriptions,
tags, chapters, sponsor copy, approval status.

Saves the new database ID to notion-import/database_ids.json.

Usage:
    NOTION_TOKEN=secret_xxxx python3 scripts/notion_add_metadata_drafts.py
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
    print("Creating Episode Metadata Drafts database...")

    body = {
        "parent": {"type": "page_id", "page_id": PARENT_PAGE_ID},
        "title": [{"type": "text", "text": {"content": "Episode Metadata Drafts"}}],
        "properties": {
            "Title": {"title": {}},
            "Episode Label": {"rich_text": {}},
            "Season": {
                "select": {
                    "options": [
                        {"name": "S1", "color": "gray"},
                        {"name": "S2", "color": "blue"},
                        {"name": "S3", "color": "green"},
                    ]
                }
            },
            "YouTube Title": {"rich_text": {}},
            "Short Description": {"rich_text": {}},
            "Full Description": {"rich_text": {}},
            "Tags": {"multi_select": {"options": []}},
            "Chapters JSON": {"rich_text": {}},
            "Thumbnail Notes": {"rich_text": {}},
            "Sponsor Segment": {"checkbox": {}},
            "Sponsor Name": {"rich_text": {}},
            "Sponsor Copy": {"rich_text": {}},
            "Draft Status": {
                "select": {
                    "options": [
                        {"name": "Drafting", "color": "gray"},
                        {"name": "Needs Review", "color": "yellow"},
                        {"name": "Approved", "color": "green"},
                        {"name": "Uploaded", "color": "blue"},
                    ]
                }
            },
            "Approved By": {
                "select": {
                    "options": [
                        {"name": "Daniel", "color": "blue"},
                        {"name": "Miryam", "color": "purple"},
                    ]
                }
            },
            "Approved Date": {"date": {}},
        },
    }

    result = api("POST", "/databases", body)
    raw_id = result["id"]

    print(f"  Created: Episode Metadata Drafts ({raw_id})")
    save_id("metadata_drafts", raw_id)

    print("\n✓ Episode Metadata Drafts database created.")
    print("  Note: Episode relation will be added by notion_add_relations.py")
    print("\nNext: python3 scripts/notion_add_relations.py")


if __name__ == "__main__":
    main()
