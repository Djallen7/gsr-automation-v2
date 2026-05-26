# Notion Workspace Setup Guide — GSR Production
**Date:** 2026-05-21
**Estimated time:** 3-4 hours total (1-2 hr import + 1-2 hr post-import)

This is the step-by-step guide to stand up the GSR Production Notion workspace from scratch using the files in this folder.

---

## Pre-Flight Checklist

- [ ] Notion Business tier active
- [ ] You are Workspace Owner
- [ ] All files in this folder are on your local machine
- [ ] 30 minutes of uninterrupted time for the import phase

---

## Step 1: Import the Production Wiki (ZIP)

This imports all 13 documentation files into Notion with the folder structure preserved.

1. In Notion, open any page or the sidebar
2. Type `/zip` — or go to **Settings > Import > ZIP**
3. Select `Production_Wiki.zip` from this folder
4. Wait for import (usually under 2 minutes for this size)
5. The result is a top-level page called **"Production Wiki"** with three child folders:
   - Project Documentation (4 pages)
   - Reference (5 pages)
   - Decisions (6 ADR pages)

**What you get:** All project docs, the master context, infrastructure inventory, metadata patterns, open-source stack eval, and all 6 ADRs — importable as searchable Notion pages.

---

## Step 2: Import the 6 Databases (CSV)

Import each CSV file separately. Each creates a new Notion database.

### Import order (import in this sequence — Relations are added after):
1. Episodes
2. Guests
3. Tasks
4. Assets
5. ADRs
6. DriveFiles

### How to import each CSV:
1. In Notion, click **New Page** > then type `/import` or use **Settings > Import > CSV**
2. Select the CSV file
3. Notion will auto-detect column types — verify key ones below
4. Name the database exactly as shown (matching names are required for Relations)

### Column type overrides to set during import:

**Episodes.csv:**
| Column | Set type to |
|--------|-------------|
| Status | Select |
| Air Date | Date |
| Recording Date | Date |
| Topic Keywords | Multi-select |

**Guests.csv:**
| Column | Set type to |
|--------|-------------|
| Outreach Status | Select |
| First Contact | Date |
| Last Contact | Date |
| Do Not Contact Until | Date |
| Expertise | Multi-select |

**Tasks.csv:**
| Column | Set type to |
|--------|-------------|
| Status | Select |
| Type | Select |
| Priority | Select |
| Due Date | Date |

**Assets.csv:**
| Column | Set type to |
|--------|-------------|
| Status | Select |
| Type | Select |

**ADRs.csv:**
| Column | Set type to |
|--------|-------------|
| Date | Date |
| Status | Select |
| Impact | Select |
| Category | Select |

**DriveFiles.csv:**
| Column | Set type to |
|--------|-------------|
| Type | Select |
| Status | Select |
| Tags | Multi-select |
| Drive ID / URL | URL |

---

## Step 3: Add Status Options (Exact Values)

After import, set Status options in each database to these exact values:

**Episodes — Status:**
- Idea
- Development
- Pre-Production
- Recording
- Post-Production
- Review
- Scheduled
- Aired
- Archived

**Guests — Outreach Status:**
- Lead
- Contacted
- Confirmed
- Appeared
- Do Not Contact

**Tasks — Status:**
- To Do
- In Progress
- Complete

**Tasks — Type:**
- Pre-Production
- Production
- Post-Production
- Distribution

**Tasks — Priority:**
- High
- Medium
- Low

**Assets — Status:**
- Requested
- In Progress
- Final
- Archived

**Assets — Type:**
- Lower-third
- Title Card
- B-roll Graphic
- Thumbnail
- Other

**ADRs — Status:**
- Proposed
- Accepted
- Superseded
- Deprecated

**ADRs — Impact:**
- Critical
- High
- Medium
- Low

**ADRs — Category:**
- Technical
- Architecture
- Infrastructure
- Process

**DriveFiles — Status:**
- Active
- Needs Review
- Broken
- Archived

---

## Step 4: Add Relations (Post-Import — Cannot Be Done via CSV)

This is the most important post-import step. Relations connect the databases together.

### In Episodes DB:
1. Add property: **"Guests"** → Type: Relation → Target: **Guests DB** → Limit: No limit → Show on Guests: ON
2. Add property: **"Tasks"** → Type: Relation → Target: **Tasks DB** → Limit: No limit → Show on Tasks: ON
3. Add property: **"Assets"** → Type: Relation → Target: **Assets DB** → Limit: No limit → Show on Assets: ON
4. Add property: **"ADRs"** → Type: Relation → Target: **ADRs DB** → Limit: No limit

### In Guests DB (auto-created by step above, verify):
- "Episode Appearances" relation back to Episodes should auto-appear

### In Tasks DB (auto-created):
- "Episode" relation back to Episodes should auto-appear

### In Assets DB (auto-created):
- "Episode" relation back to Episodes should auto-appear

---

## Step 5: Add Rollup Properties

After Relations are set, add these computed fields:

**In Episodes DB:**
- Add property: **"Guest Count"** → Rollup → Relation: Guests → Count all
- Add property: **"Task Completion"** → Rollup → Relation: Tasks → Percent checked

**In Guests DB:**
- Add property: **"Appearance Count"** → Rollup → Relation: Episode Appearances → Count all

---

## Step 6: Set Up Database Views

### Episodes DB — add these views:
1. **Board** (default by Status) — Kanban pipeline view
2. **Calendar** (by Air Date) — scheduling view
3. **Timeline** (by Recording Date → Air Date) — production timeline
4. **Table** — dense data entry (keep as default for data entry)

### Guests DB:
1. **Gallery** — visual card view (show photo if added later)
2. **Table** — default for data entry
3. **Filter view: Active Leads** — filter Status = Lead

### Tasks DB:
1. **Board** (by Status)
2. **Filter view: My Tasks** — filter Assigned To = you
3. **Table** — default

---

## Step 7: Build the Production Hub Home Page

Create a new page called **"Production Hub"** and add:

1. **Linked view of Episodes DB** — filter Status != Archived, sort by Air Date
2. **Linked view of Tasks DB** — filter Status = "To Do" or "In Progress", sort by Due Date
3. **Callout block** with link to Production Wiki
4. **Button block**: "New Episode" — creates a new Episodes record

This is the page to favorite and open first every day.

---

## Step 8: Lock All Databases

After setup is verified:
1. Open each database
2. Click ··· (three dots) > **Lock database**
3. This prevents accidental property/view changes by team members
4. Team members get **"Can Edit Content"** permission (can add/edit rows, can't change structure)

---

## Step 9: Workspace Structure

Final sidebar should look like:

```
GSR Production Workspace
├── Production Hub          (your daily home page — favorite this)
├── Episodes                (master DB)
├── Guests                  (master DB)
├── Tasks                   (master DB)
├── Assets                  (master DB)
├── ADRs                    (master DB)
├── Drive Map               (master DB)
└── Production Wiki         (imported from ZIP — wiki with all docs)
```

Keep top-level pages to 7 or fewer. Use Cmd/Ctrl+K search instead of browsing sidebar.

---

## Step 10: Team Onboarding (When Ready)

When adding Miryam or others:
1. Invite at workspace level as **Member** (not Owner)
2. Set all databases to **Can Edit Content** (not Can Edit)
3. Create **"GSR Admins"** permission group with Full Access for you
4. Do a 30-minute walkthrough: create one episode, link a guest, create tasks

---

## What This Workspace Does NOT Include

These are intentionally out of scope for now:
- n8n.cloud integration (Phase 1 Week 2)
- YouTube / Dropbox upload automation (Phase 1 Week 2)
- Google Calendar two-way sync (optional — use 2sync if needed)
- GitHub synced database for PR/issue tracking (optional)

---

## Files in This Folder

| File | What it is |
|------|------------|
| `Production_Wiki.zip` | ZIP import for Notion — all 13 docs in folder structure |
| `databases/Episodes.csv` | Episodes database skeleton |
| `databases/Guests.csv` | Pre-populated guest roster (20 guests) |
| `databases/Tasks.csv` | Tasks database skeleton |
| `databases/Assets.csv` | Assets/graphics database skeleton |
| `databases/ADRs.csv` | Pre-populated with all 6 ADRs from the repo |
| `databases/DriveFiles.csv` | Google Drive map (2 key folders pre-populated) |

---

*Generated 2026-05-21. Architecture per ADR-0011 (cloud-first, Notion as database).*
