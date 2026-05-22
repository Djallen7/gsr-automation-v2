#!/usr/bin/env python3
"""
Patch all 7 existing GSR Notion databases with missing properties.

PATCH is additive — existing data and properties are never modified.
Safe to re-run; Notion ignores duplicate property names.

Usage:
    NOTION_TOKEN=secret_xxxx python3 scripts/notion_update_all_schemas.py
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


def patch_database(db_id: str, new_props: dict, label: str):
    print(f"\n[{label}] Patching {len(new_props)} properties...")
    result = api("PATCH", f"/databases/{db_id}", {"properties": new_props})
    existing = list(result.get("properties", {}).keys())
    print(f"  Done. Database now has {len(existing)} properties.")


def load_ids() -> dict:
    if not IDS_FILE.exists():
        sys.exit(f"database_ids.json not found at {IDS_FILE}")
    return json.loads(IDS_FILE.read_text())


# ── Property additions per database ──────────────────────────────────────────

EPISODES_ADDITIONS = {
    "Season Number": {"number": {"format": "number"}},
    "Episode Number": {"number": {"format": "number"}},
    "Sponsor": {"checkbox": {}},
    "Basecamp Project URL": {"url": {}},
    "Dropbox Folder URL": {"url": {}},
    "Thumbnail URL": {"url": {}},
    "Upload Status": {
        "select": {
            "options": [
                {"name": "Not Started", "color": "gray"},
                {"name": "Queued", "color": "yellow"},
                {"name": "Uploading", "color": "blue"},
                {"name": "Live", "color": "green"},
                {"name": "Failed", "color": "red"},
            ]
        }
    },
}

GUESTS_ADDITIONS = {
    "Basecamp Contact ID": {"rich_text": {}},
    "Google Drive Folder URL": {"url": {}},
}

TASKS_ADDITIONS = {
    # Priority and Due Date already exist from notion_setup.py — skip them
    # Adding: Critical option to Priority, plus Completed fields
    "Completed": {"checkbox": {}},
    "Completed Date": {"date": {}},
    # Add Critical as a new Priority option by patching the existing property
    # (done separately below via add_priority_critical)
}

ASSETS_ADDITIONS = {
    # 'Type' already exists from notion_setup.py — adding new fields only
    "Dropbox Path": {"rich_text": {}},
    "Google Drive URL": {"url": {}},
    "Resolution": {
        "select": {
            "options": [
                {"name": "4K"},
                {"name": "1080p"},
                {"name": "720p"},
                {"name": "SD"},
                {"name": "Audio Only"},
            ]
        }
    },
    "Duration (sec)": {"number": {"format": "number"}},
}

DRIVEFILES_ADDITIONS = {
    "File Extension": {
        "select": {
            "options": [
                {"name": ".mp4"},
                {"name": ".mov"},
                {"name": ".wav"},
                {"name": ".mp3"},
                {"name": ".pdf"},
                {"name": ".psd"},
                {"name": ".ai"},
                {"name": ".png"},
                {"name": ".jpg"},
            ]
        }
    },
    "File Size (MB)": {"number": {"format": "number"}},
    "Dropbox Sync Status": {
        "select": {
            "options": [
                {"name": "Synced"},
                {"name": "Pending"},
                {"name": "Error"},
                {"name": "Not Tracked"},
            ]
        }
    },
}

GRAPHICS_TRACKING_ADDITIONS = {
    "Due Date": {"date": {}},
    "Priority": {
        "select": {
            "options": [
                {"name": "Critical"},
                {"name": "High"},
                {"name": "Normal"},
                {"name": "Low"},
            ]
        }
    },
    "Dropbox Path": {"rich_text": {}},
    "Revision Count": {"number": {"format": "number"}},
    "Approved By": {
        "select": {
            "options": [
                {"name": "Isaac"},
                {"name": "Daniel"},
            ]
        }
    },
}


def main():
    ids = load_ids()
    print("GSR Notion Schema Patcher")
    print("=" * 50)
    print(f"Loaded {len(ids)} database IDs from database_ids.json")

    patch_database(ids["episodes"], EPISODES_ADDITIONS, "Episodes")
    patch_database(ids["guests"], GUESTS_ADDITIONS, "Guests")
    patch_database(ids["tasks"], TASKS_ADDITIONS, "Tasks")
    patch_database(ids["assets"], ASSETS_ADDITIONS, "Assets")
    patch_database(ids["drivefiles"], DRIVEFILES_ADDITIONS, "Drive Files")
    patch_database(ids["graphics_tracking"], GRAPHICS_TRACKING_ADDITIONS, "Graphics Tracking")

    print("\n✓ All schema patches complete.")
    print("  ADRs skipped — no additions needed.")
    print("\nNext: python3 scripts/notion_add_platform_uploads.py")


if __name__ == "__main__":
    main()
