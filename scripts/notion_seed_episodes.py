#!/usr/bin/env python3
"""
Seeds Season 3 episodes EP001–EP025 into the Episodes Notion database.

Air dates are calculated from the Season 3 premiere (2024-09-02, a Monday)
with a new episode every Monday at 4PM ET.

Episodes 1–24 carry a sponsor segment per the show bible.
Episodes 1–20 are marked Aired, 21–23 Post-Production, 24 In Production,
25 Planning.

Usage:
    NOTION_TOKEN=secret_xxxx python3 scripts/notion_seed_episodes.py

    # Dry run (prints what would be created, no API calls):
    DRY_RUN=1 NOTION_TOKEN=x python3 scripts/notion_seed_episodes.py
"""

import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import date, timedelta
from pathlib import Path

NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
DRY_RUN = os.environ.get("DRY_RUN", "") == "1"
IDS_FILE = Path(__file__).parent.parent / "notion-import" / "database_ids.json"

if not NOTION_TOKEN and not DRY_RUN:
    sys.exit("NOTION_TOKEN environment variable not set.")

HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
}

# Season 3 configuration — must match the option name in notion_setup.py ("Season 3")
SEASON = "Season 3"
PREMIERE_DATE = date(2024, 9, 2)   # Monday
TOTAL_EPISODES = 25
SPONSOR_THROUGH = 24               # EP001–EP024 have sponsors


def air_date(ep_num: int) -> str:
    """Return ISO date string for this episode's air date."""
    return (PREMIERE_DATE + timedelta(weeks=ep_num - 1)).isoformat()


def episode_status(ep_num: int) -> str:
    if ep_num <= 20:
        return "Aired"
    if ep_num <= 23:
        return "Post-Production"
    if ep_num == 24:
        return "In Production"
    return "Planning"


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


def create_episode(db_id: str, ep_num: int) -> str:
    label = f"S03 EP{ep_num:03d}"
    status = episode_status(ep_num)
    sponsor = ep_num <= SPONSOR_THROUGH
    air = air_date(ep_num)

    page = {
        "parent": {"database_id": db_id},
        "properties": {
            "Episode #": {
                "title": [{"text": {"content": label}}]
            },
            "Title": {
                "rich_text": [{"text": {"content": "[Title TBD]"}}]
            },
            "Season": {
                "select": {"name": SEASON}
            },
            "Season Number": {
                "number": 3
            },
            "Episode Number": {
                "number": ep_num
            },
            "Status": {
                "select": {"name": status}
            },
            "Air Date": {
                "date": {"start": air}
            },
            "Sponsor": {
                "checkbox": sponsor
            },
            "Upload Status": {
                "select": {"name": "Live" if status == "Aired" else "Not Started"}
            },
        },
    }

    if DRY_RUN:
        print(f"  [DRY RUN] {label} | {status} | Air: {air} | Sponsor: {sponsor}")
        return "dry-run"

    result = api("POST", "/pages", page)
    return result["id"]


def main():
    if DRY_RUN:
        print("DRY RUN — no API calls will be made\n")

    if not IDS_FILE.exists():
        sys.exit(f"database_ids.json not found at {IDS_FILE}")

    ids = json.loads(IDS_FILE.read_text())
    if "episodes" not in ids:
        sys.exit("'episodes' key missing from database_ids.json")

    db_id = ids["episodes"]
    print(f"Seeding {TOTAL_EPISODES} episodes into Episodes database...")
    print(f"Season 3 premiere: {PREMIERE_DATE} | Sponsor: EP001–EP{SPONSOR_THROUGH:03d}")
    print("=" * 60)

    created = []
    for ep_num in range(1, TOTAL_EPISODES + 1):
        page_id = create_episode(db_id, ep_num)
        created.append(page_id)
        if not DRY_RUN:
            print(f"  Created S03 EP{ep_num:03d} ({page_id})")
            time.sleep(0.35)  # stay well under 3 req/s rate limit

    print(f"\n✓ {len(created)} episodes seeded.")
    if not DRY_RUN:
        print("\nNext: python3 scripts/notion_seed_graphics_tracking.py")


if __name__ == "__main__":
    main()
