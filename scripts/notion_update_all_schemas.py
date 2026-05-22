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
    "Priority": {
        "select": {
            "options": [
                {"name": "Critical", "color": "red"},
                {"name": "High", "color": "orange"},
                {"name": "Medium", "color": "yellow"},
                {"name": "Low", "color": "gray"},
            ]
        }
    },
    "Due Date": {"date": {}},
    "Completed": {"checkbox": {}},
    "Completed Date": {"date": {}},
}

ASSETS_ADDITIONS = {
    "File Type": {
        "select": {
            "options": [
                {"name": "Video", "color": "blue"},
                {"name": "Audio", "color": "green"},
                {"name": "Image", "color": "purple"},
                {"name": "Document", "color": "gray"},
                {"name": "Template", "color": "yellow"},
            ]
        }
    },
    "Dropbox Path": {"rich_text": {}},
    "Google Drive URL": {"url": {}},
    "Resolution": {
        "select": {
            "options": [
                {"name": "4K", "color": "blue"},
                {"name": "1080p", "color": "green"},
                {"name": "720p", "color": "yellow"},
                {"name": "SD", "color": "gray"},
                {"name": "Audio Only", "color": "purple"},
            ]
        }
    },
    "Duration (sec)": {"number": {"format": "number"}},
}

DRIVEFILES_ADDITIONS = {
    "File Extension": {
        "select": {
            "options": [
                {"name": ".mp4", "color": "blue"},
                {"name": ".mov", "color": "blue"},
                {"name": ".wav", "color": "green"},
                {"name": ".mp3", "color": "green"},
                {"name": ".pdf", "color": "red"},
                {"name": ".psd", "color": "purple"},
                {"name": ".ai", "color": "orange"},
                {"name": ".png", "color": "pink"},
                {"name": ".jpg", "color": "yellow"},
            ]
        }
    },
    "File Size (MB)": {"number": {"format": "number"}},
    "Dropbox Sync Status": {
        "select": {
            "options": [
                {"name": "Synced", "color": "green"},
                {"name": "Pending", "color": "yellow"},
                {"name": "Error", "color": "red"},
                {"name": "Not Tracked", "color": "gray"},
            ]
        }
    },
}

GRAPHICS_TRACKING_ADDITIONS = {
    "Due Date": {"date": {}},
    "Priority": {
        "select": {
            "options": [
                {"name": "Critical", "color": "red"},
                {"name": "High", "color": "orange"},
                {"name": "Normal", "color": "blue"},
                {"name": "Low", "color": "gray"},
            ]
        }
    },
    "Dropbox Path": {"rich_text": {}},
    "Revision Count": {"number": {"format": "number"}},
    "Approved By": {
        "select": {
            "options": [
                {"name": "Isaac", "color": "green"},
                {"name": "Daniel", "color": "blue"},
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
