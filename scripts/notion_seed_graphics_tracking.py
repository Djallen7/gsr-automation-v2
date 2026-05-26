#!/usr/bin/env python3
"""
Seeds the Graphics Tracking database with representative data for EP021–EP025.

Data mirrors the structure of the 5-tab Google Sheet (one tab per show).
Each entry covers one graphic needed for a show day.

Correct the specific entries after running — this seeds the structure
so the database is immediately usable.

Usage:
    NOTION_TOKEN=secret_xxxx python3 scripts/notion_seed_graphics_tracking.py

    # Dry run:
    DRY_RUN=1 NOTION_TOKEN=x python3 scripts/notion_seed_graphics_tracking.py
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

if not NOTION_TOKEN and not DRY_RUN:
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


# ── Seed data ─────────────────────────────────────────────────────────────────
# Format: (description, episode_label, segment, graphic_num, graphic_type,
#          status, assigned_to, show_num, notes)

GRAPHICS_DATA = [
    # ── Show 1 (EP021) — Aired ────────────────────────────────────────────────
    ("Opening title card",        "EP021", "Opening Monologue",  1, "Title Graphic",        "Done",       "Isaac",    1, ""),
    ("Creation galaxy b-roll",    "EP021", "The Heavens Declare", 2, "B-roll",               "Done",       "Jakob",    1, ""),
    ("Kids Corner title",         "EP021", "Kids Corner",         3, "Title Graphic",        "Done",       "Gabe",     1, ""),
    ("Q&A lower third — guest 1", "EP021", "Q&A",                 4, "Lower Third",          "Done",       "Isaac",    1, ""),
    ("Ministry report intro",     "EP021", "Ministry Report",     5, "Title Graphic",        "Done",       "Miryam",   1, ""),
    ("Viewer voice quote card",   "EP021", "Viewer Voices",       6, "Propres Quote",        "Done",       "Isaac",    1, ""),
    ("Resource book cover",       "EP021", "Featured Resource",   7, "Picture",              "Done",       "Miryam",   1, ""),
    ("Interview lower third",     "EP021", "Interview 1",         8, "Lower Third",          "Done",       "Isaac",    1, ""),
    ("DNA strand animation",      "EP021", "The Heavens Declare", 9, "Clip w/audio",         "Done",       "Jakob",    1, ""),
    ("GSM segment bumper",        "EP021", "GSM",                10, "Pre-made: B-roll",     "Done",       "Gabe",     1, ""),

    # ── Show 2 (EP022) — Aired ────────────────────────────────────────────────
    ("Opening title card",        "EP022", "Opening Monologue",  1, "Title Graphic",        "Done",       "Isaac",    2, ""),
    ("Solar system b-roll",       "EP022", "The Heavens Declare", 2, "B-roll",               "Done",       "Jakob",    2, "NASA stock"),
    ("Kids Corner title",         "EP022", "Kids Corner",         3, "Title Graphic",        "Done",       "Gabe",     2, ""),
    ("Article screenshot — Nat Geo","EP022","Q&A",               4, "Article Screenshot",   "Done",       "Isaac",    2, ""),
    ("Ministry highlights reel",  "EP022", "Ministry Report",     5, "Clip w/audio",         "Done",       "Miryam",   2, "30 sec max"),
    ("Map graphic — Middle East", "EP022", "Interview 1",         6, "Map Graphic",          "Done",       "Daniel",   2, ""),
    ("Featured resource roll-in", "EP022", "Featured Resource",   7, "Roll-in",              "Done",       "Isaac",    2, ""),
    ("Guest lower third — Dr. Smith","EP022","Interview 1",       8, "Lower Third",          "Done",       "Isaac",    2, ""),
    ("Fossil record b-roll",      "EP022", "The Heavens Declare", 9, "Pre-made: B-roll",     "Done",       "Gabe",     2, ""),
    ("Viewer voice quote",        "EP022", "Viewer Voices",      10, "Propres Quote",        "Done",       "Isaac",    2, ""),

    # ── Show 3 (EP023) — Post-Production ──────────────────────────────────────
    ("Opening title card",        "EP023", "Opening Monologue",  1, "Title Graphic",        "Loaded In",  "Isaac",    3, ""),
    ("Telescope footage",         "EP023", "The Heavens Declare", 2, "B-roll",               "Loaded In",  "Jakob",    3, ""),
    ("Kids Corner title",         "EP023", "Kids Corner",         3, "Title Graphic",        "Loaded In",  "Gabe",     3, ""),
    ("Science journal screenshot","EP023", "Q&A",                 4, "Article Screenshot",   "In Progress","Isaac",    3, "Need hi-res"),
    ("Viewer voices quote",       "EP023", "Viewer Voices",       5, "Propres Quote",        "Loaded In",  "Isaac",    3, ""),
    ("Guest lower third",         "EP023", "Interview 1",         6, "Lower Third",          "Loaded In",  "Isaac",    3, ""),
    ("Resource thumbnail",        "EP023", "Featured Resource",   7, "Picture",              "In Progress","Miryam",   3, "Awaiting book art"),
    ("Ministry reel",             "EP023", "Ministry Report",     8, "Clip w/audio",         "Loaded In",  "Miryam",   3, ""),
    ("Map — South America",       "EP023", "Interview 2",         9, "Map Graphic",          "In Progress","Daniel",   3, ""),
    ("GSM bumper",                "EP023", "GSM",                10, "Pre-made: B-roll",     "Loaded In",  "Gabe",     3, ""),

    # ── Show 4 (EP024) — In Production ────────────────────────────────────────
    ("Opening title card",        "EP024", "Opening Monologue",  1, "Title Graphic",        "In Progress","Isaac",    4, ""),
    ("Deep space b-roll",         "EP024", "The Heavens Declare", 2, "B-roll",               "Not Started","Jakob",    4, "Request from Dr. R"),
    ("Kids Corner title",         "EP024", "Kids Corner",         3, "Title Graphic",        "Not Started","Gabe",     4, ""),
    ("Quote card — scripture",    "EP024", "Opening Monologue",   4, "Propres Quote",        "In Progress","Isaac",    4, ""),
    ("Lower third — guest",       "EP024", "Interview 1",         5, "Lower Third",          "Not Started","Isaac",    4, "Name TBD"),
    ("Article screenshot",        "EP024", "Q&A",                 6, "Article Screenshot",   "Not Started","Isaac",    4, ""),
    ("Ministry highlight clip",   "EP024", "Ministry Report",     7, "Clip w/audio",         "Not Started","Miryam",   4, ""),
    ("Viewer voices quote",       "EP024", "Viewer Voices",       8, "Propres Quote",        "Not Started","Isaac",    4, ""),
    ("Featured resource image",   "EP024", "Featured Resource",   9, "Picture",              "Not Started","Miryam",   4, ""),
    ("GSM bumper",                "EP024", "GSM",                10, "Pre-made: B-roll",     "Not Started","Gabe",     4, ""),

    # ── Show 5 (EP025) — Planning ─────────────────────────────────────────────
    ("Opening title card",        "EP025", "Opening Monologue",  1, "Title Graphic",        "Not Started","Isaac",    5, ""),
    ("Galaxy cluster footage",    "EP025", "The Heavens Declare", 2, "B-roll",               "Not Started","Jakob",    5, ""),
    ("Kids Corner title",         "EP025", "Kids Corner",         3, "Title Graphic",        "Not Started","Gabe",     5, ""),
    ("Q&A lower third",           "EP025", "Q&A",                 4, "Lower Third",          "Not Started","Isaac",    5, ""),
    ("Ministry report title",     "EP025", "Ministry Report",     5, "Title Graphic",        "Not Started","Miryam",   5, ""),
    ("Viewer voices quote",       "EP025", "Viewer Voices",       6, "Propres Quote",        "Not Started","Isaac",    5, ""),
    ("Featured resource",         "EP025", "Featured Resource",   7, "Picture",              "Not Started","Miryam",   5, ""),
    ("Interview lower third 1",   "EP025", "Interview 1",         8, "Lower Third",          "Not Started","Isaac",    5, ""),
    ("Interview lower third 2",   "EP025", "Interview 2",         9, "Lower Third",          "Not Started","Isaac",    5, ""),
    ("GSM bumper",                "EP025", "GSM",                10, "Pre-made: B-roll",     "Not Started","Gabe",     5, ""),
]


def create_entry(db_id: str, row: tuple) -> str:
    desc, ep, segment, gnum, gtype, status, assigned, show, notes = row

    page = {
        "parent": {"database_id": db_id},
        "properties": {
            "Description": {
                "title": [{"text": {"content": desc}}]
            },
            "Episode (text)": {
                "rich_text": [{"text": {"content": ep}}]
            },
            "Segment": {
                "select": {"name": segment}
            },
            "Graphic #": {
                "number": gnum
            },
            "Graphic Type": {
                "select": {"name": gtype}
            },
            "Status": {
                "select": {"name": status}
            },
            "Assigned To": {
                "select": {"name": assigned}
            },
            "Show": {
                "select": {"name": f"Show {show}"}
            },
        },
    }

    if notes:
        page["properties"]["Notes"] = {
            "rich_text": [{"text": {"content": notes}}]
        }

    if DRY_RUN:
        print(f"  [DRY RUN] {ep} | Show {show} | #{gnum} {desc} | {status}")
        return "dry-run"

    result = api("POST", "/pages", page)
    return result["id"]


def main():
    if DRY_RUN:
        print("DRY RUN — no API calls will be made\n")

    if not IDS_FILE.exists():
        sys.exit(f"database_ids.json not found at {IDS_FILE}")

    ids = json.loads(IDS_FILE.read_text())
    if "graphics_tracking" not in ids:
        sys.exit("'graphics_tracking' key missing from database_ids.json")

    db_id = ids["graphics_tracking"]
    total = len(GRAPHICS_DATA)
    print(f"Seeding {total} graphics entries (EP021–EP025, Shows 1–5)...")
    print("=" * 60)

    created = 0
    for row in GRAPHICS_DATA:
        create_entry(db_id, row)
        created += 1
        if not DRY_RUN:
            time.sleep(0.35)

    print(f"\n✓ {created} graphics entries seeded.")
    if not DRY_RUN:
        print("  Note: 'Episode (text)' field holds the episode label as plain text.")
        print("  After running notion_add_relations.py, you can link entries to")
        print("  the actual Episode records via the 'Episode' relation field.")
        print("\nNext: python3 scripts/notion_health_check.py")


if __name__ == "__main__":
    main()
