#!/usr/bin/env python3
"""
Notion workspace setup for GSR Automation.

Creates all 6 databases under the GSR Production Workspace page
and seeds them with the pre-populated data.

Usage:
    NOTION_TOKEN=secret_xxxx python3 scripts/notion_setup.py

Optional override:
    NOTION_TOKEN=secret_xxxx NOTION_PARENT_ID=<32-char-id> python3 scripts/notion_setup.py
"""

import csv
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
PARENT_PAGE_ID = os.environ.get("NOTION_PARENT_ID", "367664ba431f802ab14ec19f4b77bb93")
DATABASES_DIR = Path(__file__).parent.parent / "notion-import" / "databases"

if not NOTION_TOKEN:
    sys.exit("NOTION_TOKEN environment variable not set.\n"
             "Run: NOTION_TOKEN=secret_xxxx python3 scripts/notion_setup.py")

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
        body_text = e.read().decode()[:300]
        print(f"  ERROR {e.code}: {body_text}")
        raise


def create_database(parent_id: str, title: str, properties: dict) -> str:
    """Create a database and return its ID."""
    body = {
        "parent": {"type": "page_id", "page_id": parent_id},
        "title": [{"type": "text", "text": {"content": title}}],
        "properties": properties,
    }
    result = api("POST", "/databases", body)
    db_id = result["id"]
    print(f"  created database: {title} ({db_id})")
    return db_id


def add_row(db_id: str, properties: dict):
    """Add a row to a database."""
    body = {
        "parent": {"database_id": db_id},
        "properties": properties,
    }
    api("POST", "/pages", body)
    time.sleep(0.35)  # stay under rate limit


def text_prop(value: str) -> dict:
    return {"rich_text": [{"text": {"content": value[:2000]}}]} if value else {"rich_text": []}


def title_prop(value: str) -> dict:
    return {"title": [{"text": {"content": value[:2000]}}]}


def select_prop(value: str) -> dict:
    return {"select": {"name": value}} if value else {"select": None}


def date_prop(value: str) -> dict:
    return {"date": {"start": value}} if value else {"date": None}


def url_prop(value: str) -> dict:
    return {"url": value} if value else {"url": None}


def email_prop(value: str) -> dict:
    return {"email": value} if value else {"email": None}


def phone_prop(value: str) -> dict:
    return {"phone_number": value} if value else {"phone_number": None}


def multiselect_prop(value: str) -> dict:
    if not value:
        return {"multi_select": []}
    tags = [{"name": t.strip()} for t in value.split(";") if t.strip()]
    return {"multi_select": tags}


# ---------------------------------------------------------------------------
# Database schemas
# ---------------------------------------------------------------------------

EPISODES_SCHEMA = {
    "Episode #":        {"title": {}},
    "Title":            {"rich_text": {}},
    "Season":           {"select": {"options": [
                            {"name": "Season 1", "color": "gray"},
                            {"name": "Season 2", "color": "blue"},
                            {"name": "Season 3", "color": "green"},
                        ]}},
    "Status":           {"select": {"options": [
                            {"name": "Planning",        "color": "gray"},
                            {"name": "Pre-Production",  "color": "yellow"},
                            {"name": "In Production",   "color": "orange"},
                            {"name": "Post-Production", "color": "purple"},
                            {"name": "Aired",           "color": "green"},
                            {"name": "Archived",        "color": "default"},
                        ]}},
    "Air Date":         {"date": {}},
    "Recording Date":   {"date": {}},
    "Description":      {"rich_text": {}},
    "Duration (min)":   {"number": {"format": "number"}},
    "Topic Keywords":   {"rich_text": {}},
    "YouTube URL":      {"url": {}},
    "Dropbox URL":      {"url": {}},
    "Notes":            {"rich_text": {}},
}

GUESTS_SCHEMA = {
    "Name":                {"title": {}},
    "Organization":        {"rich_text": {}},
    "Email":               {"email": {}},
    "Phone":               {"phone_number": {}},
    "Expertise":           {"rich_text": {}},
    "Outreach Status":     {"select": {"options": [
                                {"name": "Lead",          "color": "gray"},
                                {"name": "Contacted",     "color": "blue"},
                                {"name": "Confirmed",     "color": "yellow"},
                                {"name": "Booked",        "color": "green"},
                                {"name": "Past Guest",    "color": "purple"},
                                {"name": "Do Not Contact","color": "red"},
                            ]}},
    "Bio Notes":           {"rich_text": {}},
    "First Contact":       {"date": {}},
    "Last Contact":        {"date": {}},
    "Research Notes":      {"rich_text": {}},
    "Do Not Contact Until":{"date": {}},
}

TASKS_SCHEMA = {
    "Task Name":   {"title": {}},
    "Type":        {"select": {"options": [
                        {"name": "Pre-Production", "color": "blue"},
                        {"name": "Post-Production","color": "purple"},
                        {"name": "Writing",        "color": "yellow"},
                        {"name": "Graphics",       "color": "orange"},
                        {"name": "Admin",          "color": "gray"},
                    ]}},
    "Status":      {"select": {"options": [
                        {"name": "Not Started", "color": "gray"},
                        {"name": "In Progress", "color": "blue"},
                        {"name": "Done",        "color": "green"},
                        {"name": "Blocked",     "color": "red"},
                    ]}},
    "Assigned To": {"select": {"options": [
                        {"name": "Daniel",  "color": "blue"},
                        {"name": "Miriam",  "color": "purple"},
                        {"name": "Jacob",   "color": "yellow"},
                        {"name": "Gabe",    "color": "orange"},
                        {"name": "Isaac",   "color": "green"},
                        {"name": "Murray",  "color": "gray"},
                    ]}},
    "Episode #":   {"rich_text": {}},
    "Due Date":    {"date": {}},
    "Priority":    {"select": {"options": [
                        {"name": "High",   "color": "red"},
                        {"name": "Medium", "color": "yellow"},
                        {"name": "Low",    "color": "gray"},
                    ]}},
    "Notes":       {"rich_text": {}},
}

ASSETS_SCHEMA = {
    "Asset Name":          {"title": {}},
    "Type":                {"select": {"options": [
                                {"name": "Graphic",   "color": "blue"},
                                {"name": "Script",    "color": "yellow"},
                                {"name": "Audio",     "color": "orange"},
                                {"name": "Video",     "color": "purple"},
                                {"name": "Document",  "color": "gray"},
                            ]}},
    "Status":              {"select": {"options": [
                                {"name": "Draft",    "color": "yellow"},
                                {"name": "Final",    "color": "green"},
                                {"name": "Archived", "color": "gray"},
                            ]}},
    "Episode #":           {"rich_text": {}},
    "File Location (URL)": {"url": {}},
    "Creator":             {"select": {"options": [
                                {"name": "Daniel",  "color": "blue"},
                                {"name": "Miriam",  "color": "purple"},
                                {"name": "Jacob",   "color": "yellow"},
                                {"name": "Gabe",    "color": "orange"},
                                {"name": "Isaac",   "color": "green"},
                            ]}},
    "Version":             {"rich_text": {}},
    "Notes":               {"rich_text": {}},
}

ADRS_SCHEMA = {
    "ADR #":             {"title": {}},
    "Decision Title":    {"rich_text": {}},
    "Category":          {"select": {"options": [
                              {"name": "Technical",      "color": "blue"},
                              {"name": "Architecture",   "color": "purple"},
                              {"name": "Infrastructure", "color": "orange"},
                              {"name": "Process",        "color": "yellow"},
                          ]}},
    "Date":              {"date": {}},
    "Status":            {"select": {"options": [
                              {"name": "Accepted",               "color": "green"},
                              {"name": "Proposed",               "color": "yellow"},
                              {"name": "Superseded by ADR-0011", "color": "red"},
                              {"name": "Deprecated",             "color": "gray"},
                          ]}},
    "Context Summary":   {"rich_text": {}},
    "Decision Summary":  {"rich_text": {}},
    "Rationale Summary": {"rich_text": {}},
    "Owner":             {"rich_text": {}},
    "Impact":            {"select": {"options": [
                              {"name": "Critical", "color": "red"},
                              {"name": "High",     "color": "orange"},
                              {"name": "Medium",   "color": "yellow"},
                              {"name": "Low",      "color": "gray"},
                          ]}},
    "Outcome Notes":     {"rich_text": {}},
}

DRIVEFILES_SCHEMA = {
    "Name":              {"title": {}},
    "Type":              {"select": {"options": [
                              {"name": "Folder",      "color": "yellow"},
                              {"name": "Spreadsheet", "color": "green"},
                              {"name": "Document",    "color": "blue"},
                              {"name": "Video",       "color": "purple"},
                              {"name": "Audio",       "color": "orange"},
                              {"name": "Image",       "color": "pink"},
                          ]}},
    "Drive ID / URL":    {"rich_text": {}},
    "Path":              {"rich_text": {}},
    "Tags":              {"multi_select": {"options": [
                              {"name": "Graphics",  "color": "blue"},
                              {"name": "Tracking",  "color": "green"},
                              {"name": "Monthly",   "color": "yellow"},
                              {"name": "May 2026",  "color": "orange"},
                          ]}},
    "Status":            {"select": {"options": [
                              {"name": "Active",    "color": "green"},
                              {"name": "Archived",  "color": "gray"},
                              {"name": "Suspended", "color": "red"},
                          ]}},
    "Notes":             {"rich_text": {}},
}


# ---------------------------------------------------------------------------
# Row builders
# ---------------------------------------------------------------------------

def seed_guests(db_id: str):
    with open(DATABASES_DIR / "Guests.csv", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            props = {
                "Name":                 title_prop(row["Name"]),
                "Organization":         text_prop(row["Organization"]),
                "Email":                email_prop(row["Email"]),
                "Phone":                phone_prop(row["Phone"]),
                "Expertise":            text_prop(row["Expertise"]),
                "Outreach Status":      select_prop(row["Outreach Status"]),
                "Bio Notes":            text_prop(row["Bio Notes"]),
                "First Contact":        date_prop(row["First Contact"]),
                "Last Contact":         date_prop(row["Last Contact"]),
                "Research Notes":       text_prop(row["Research Notes"]),
                "Do Not Contact Until": date_prop(row["Do Not Contact Until"]),
            }
            add_row(db_id, props)
            print(f"    guest: {row['Name']}")


def seed_adrs(db_id: str):
    with open(DATABASES_DIR / "ADRs.csv", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            props = {
                "ADR #":             title_prop(row["ADR #"]),
                "Decision Title":    text_prop(row["Decision Title"]),
                "Category":          select_prop(row["Category"]),
                "Date":              date_prop(row["Date"]),
                "Status":            select_prop(row["Status"]),
                "Context Summary":   text_prop(row["Context Summary"]),
                "Decision Summary":  text_prop(row["Decision Summary"]),
                "Rationale Summary": text_prop(row["Rationale Summary"]),
                "Owner":             text_prop(row["Owner"]),
                "Impact":            select_prop(row["Impact"]),
                "Outcome Notes":     text_prop(row["Outcome Notes"]),
            }
            add_row(db_id, props)
            print(f"    ADR: {row['ADR #']}")


def seed_drivefiles(db_id: str):
    with open(DATABASES_DIR / "DriveFiles.csv", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            props = {
                "Name":           title_prop(row["Name"]),
                "Type":           select_prop(row["Type"]),
                "Drive ID / URL": text_prop(row["Drive ID / URL"]),
                "Path":           text_prop(row["Path"]),
                "Tags":           multiselect_prop(row["Tags"]),
                "Status":         select_prop(row["Status"]),
                "Notes":          text_prop(row["Notes"]),
            }
            add_row(db_id, props)
            print(f"    file: {row['Name']}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    print(f"\nGSR Notion Setup")
    print(f"Parent page: {PARENT_PAGE_ID}")
    print(f"Token: {NOTION_TOKEN[:12]}...\n")

    # Verify the parent page is accessible
    print("Verifying parent page access...")
    try:
        page = api("GET", f"/pages/{PARENT_PAGE_ID}")
        page_title = page.get("properties", {}).get("title", {}).get("title", [{}])[0].get("plain_text", "(untitled)")
        print(f"  OK — page title: {page_title}\n")
    except Exception as e:
        sys.exit(f"Cannot access parent page {PARENT_PAGE_ID}.\n"
                 f"Make sure:\n"
                 f"  1. The integration is shared with that page\n"
                 f"  2. The page ID is correct\n"
                 f"Error: {e}")

    db_ids = {}

    print("Creating Episodes database...")
    db_ids["episodes"] = create_database(PARENT_PAGE_ID, "Episodes", EPISODES_SCHEMA)

    print("Creating Guests database...")
    db_ids["guests"] = create_database(PARENT_PAGE_ID, "Guests", GUESTS_SCHEMA)
    print("  Seeding guests...")
    seed_guests(db_ids["guests"])

    print("Creating Tasks database...")
    db_ids["tasks"] = create_database(PARENT_PAGE_ID, "Tasks", TASKS_SCHEMA)

    print("Creating Assets database...")
    db_ids["assets"] = create_database(PARENT_PAGE_ID, "Assets", ASSETS_SCHEMA)

    print("Creating ADRs database...")
    db_ids["adrs"] = create_database(PARENT_PAGE_ID, "ADRs", ADRS_SCHEMA)
    print("  Seeding ADRs...")
    seed_adrs(db_ids["adrs"])

    print("Creating Drive Files database...")
    db_ids["drivefiles"] = create_database(PARENT_PAGE_ID, "Drive Files", DRIVEFILES_SCHEMA)
    print("  Seeding Drive Files...")
    seed_drivefiles(db_ids["drivefiles"])

    print("\n--- Done ---")
    print("\nDatabase IDs (save these for n8n and future scripts):")
    for name, db_id in db_ids.items():
        print(f"  {name:12s}: {db_id}")

    ids_file = Path(__file__).parent.parent / "notion-import" / "database_ids.json"
    with open(ids_file, "w") as f:
        json.dump(db_ids, f, indent=2)
    print(f"\nAlso saved to: {ids_file}")
    print("\nNext steps:")
    print("  1. Open Notion and verify all 6 databases appear under GSR Production Workspace")
    print("  2. Set up Relations: Tasks.Episode # -> Episodes, Assets.Episode # -> Episodes")
    print("  3. Add views (Board view for Tasks by Status, Gallery for Guests, etc.)")
    print("  4. Share the databases with your team")


if __name__ == "__main__":
    main()
