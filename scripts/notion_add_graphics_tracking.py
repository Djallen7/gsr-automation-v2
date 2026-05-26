#!/usr/bin/env python3
"""
Add Graphics Tracking database to the GSR Notion workspace.

Creates the Graphics Tracking database under the GSR Production Workspace page
with the full schema matching the Google Sheets layout.

Usage:
    NOTION_TOKEN=ntn_xxxx python3 scripts/notion_add_graphics_tracking.py

Optional override:
    NOTION_TOKEN=ntn_xxxx NOTION_PARENT_ID=<32-char-id> python3 scripts/notion_add_graphics_tracking.py
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
    sys.exit("NOTION_TOKEN environment variable not set.\n"
             "Run: NOTION_TOKEN=ntn_xxxx python3 scripts/notion_add_graphics_tracking.py")

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


GRAPHICS_TRACKING_SCHEMA = {
    # Title = Description (primary identifier — most searchable field)
    "Description": {"title": {}},

    "Episode": {"rich_text": {}},

    "Segment": {"select": {"options": [
        {"name": "Opening Monologue",  "color": "gray"},
        {"name": "The Heavens Declare","color": "blue"},
        {"name": "Kids Corner",        "color": "yellow"},
        {"name": "Q&A",               "color": "orange"},
        {"name": "Ministry Report",    "color": "purple"},
        {"name": "Viewer Voices",      "color": "pink"},
        {"name": "Featured Resource",  "color": "green"},
        {"name": "GSM",               "color": "brown"},
        {"name": "Interview 1",        "color": "default"},
        {"name": "Interview 2",        "color": "red"},
    ]}},

    "Graphic #": {"number": {"format": "number"}},

    "Graphic Type": {"select": {"options": [
        {"name": "Title Graphic",      "color": "blue"},
        {"name": "Clip w/audio",       "color": "purple"},
        {"name": "B-roll",             "color": "gray"},
        {"name": "Pre-made: B-roll",   "color": "default"},
        {"name": "Picture",            "color": "yellow"},
        {"name": "Article Screenshot", "color": "orange"},
        {"name": "Propres Quote",      "color": "green"},
        {"name": "Roll-in",            "color": "brown"},
        {"name": "Lower Third",        "color": "pink"},
        {"name": "Map / Graphic",      "color": "red"},
    ]}},

    "Status": {"select": {"options": [
        {"name": "Not Started", "color": "gray"},
        {"name": "In Progress", "color": "yellow"},
        {"name": "Loaded In",   "color": "green"},
        {"name": "Done",        "color": "blue"},
        {"name": "Cancelled",   "color": "red"},
    ]}},

    "Assigned To": {"select": {"options": [
        {"name": "Isaac",    "color": "blue"},
        {"name": "Jakob",    "color": "green"},
        {"name": "Gabe",     "color": "orange"},
        {"name": "Jeremiah", "color": "purple"},
        {"name": "Daniel",   "color": "yellow"},
        {"name": "Miryam",   "color": "pink"},
    ]}},

    "Notes": {"rich_text": {}},

    # Show number within the episode (Show 1-5 tabs in the original sheet)
    "Show": {"select": {"options": [
        {"name": "Show 1", "color": "gray"},
        {"name": "Show 2", "color": "gray"},
        {"name": "Show 3", "color": "gray"},
        {"name": "Show 4", "color": "gray"},
        {"name": "Show 5", "color": "gray"},
    ]}},
}


def main():
    print("\nGSR Graphics Tracking — Notion Database Setup")
    print(f"Parent page: {PARENT_PAGE_ID}")
    print(f"Token: {NOTION_TOKEN[:12]}...\n")

    # Verify parent page access
    print("Verifying parent page access...")
    try:
        page = api("GET", f"/pages/{PARENT_PAGE_ID}")
        title = (page.get("properties", {})
                     .get("title", {})
                     .get("title", [{}])[0]
                     .get("plain_text", "(untitled)"))
        print(f"  OK — page: {title}\n")
    except Exception as e:
        sys.exit(f"Cannot access parent page. Make sure the integration is shared with it.\nError: {e}")

    # Create the database
    print("Creating Graphics Tracking database...")
    body = {
        "parent": {"type": "page_id", "page_id": PARENT_PAGE_ID},
        "title": [{"type": "text", "text": {"content": "Graphics Tracking"}}],
        "properties": GRAPHICS_TRACKING_SCHEMA,
    }
    result = api("POST", "/databases", body)
    db_id = result["id"]
    print(f"  created: Graphics Tracking ({db_id})")

    # Update database_ids.json
    ids = {}
    if IDS_FILE.exists():
        with open(IDS_FILE) as f:
            ids = json.load(f)
    ids["graphics_tracking"] = db_id
    with open(IDS_FILE, "w") as f:
        json.dump(ids, f, indent=2)
    print(f"  ID saved to: {IDS_FILE}")

    print("\n--- Done ---")
    print(f"\nGraphics Tracking database ID: {db_id}")
    print("\nNext steps in Notion:")
    print("  1. Open the database — verify all columns and select options look right")
    print("  2. Set up a grouped view: Group by Segment, filter by Episode")
    print("  3. Set up a Board view: Group by Status (so Isaac/Jakob can drag cards)")
    print("  4. Consider a Gallery view grouped by Assigned To for workload visibility")
    print("\nEach episode = one filtered view of this database (filter Episode = 'S03 EP 021' etc.)")
    print("The 'Show' field maps to Show 1-5 tabs from the original sheet.")


if __name__ == "__main__":
    main()
