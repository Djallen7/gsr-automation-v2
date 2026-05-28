<!-- ARCHIVE: GSR Automation Reference -->
<!-- DOMAIN: intelligence -->
<!-- KEYWORDS: forensics, mac_apt, DuckDB, Timesketch, behavioral, iCloud, WiFi, quarantine, TCC, browser history, filesystem, events, working patterns, session analysis, May 19 incident, cloud rebuild, timestamp contamination -->
<!-- SOURCES: FINDINGS.md, MONTHLY_CYCLE_REPORT.md -->
<!-- UPDATED: 2026-05-28 -->

# Behavioral Forensics — Pipeline State & Reference

## Pipeline Overview

Forensic analysis of Daniel's Mac to map real working patterns across May 2026.

| Tool | Version | Output | Notes |
|---|---|---|---|
| mac_apt | v1.29.3 | 12GB, 77 CSV/JSONL files | 49 plugins, full disk extraction |
| Filesystem walker (custom Python) | — | ~857K events | 214,199 files scanned in 9.5s |
| DuckDB | 1.5.3 | inventory.duckdb | 27 tables, 9 views |
| Timesketch | current | sketch_id=1 | 944K events, 6 timelines |

**Event total:** 392,741 events across 7 sources: `claude_web`, `claude_code`, `drive`, `filesystem`, `imessage`, `browser`, and dimension tables.

**DuckDB location:** `~/Documents/inventory-2026-05/duckdb/inventory.duckdb`

**Timesketch:** Web UI at `http://localhost` (login: daniel), sketch "Inventory 2026-05"

---

## Local Data Directory Layout

```
~/Documents/inventory-2026-05/
├── output/          # CSV exports of 4 DuckDB views
├── venv/            # Python virtualenv (activate before running scripts)
├── drive/           # Drive API pull scripts + files.jsonl + activity.jsonl
├── plaso/           # filesystem_files.csv + filesystem_events.csv
├── duckdb/          # inventory.duckdb (27 tables, 9 views)
├── ai_services/     # Claude web/code loaders + workflow view builder
├── timesketch/      # Docker compose stack
├── mac_apt/output/  # 77 CSV/JSONL files from forensic extraction
└── logs/
```

---

## Notable Tables

| Table | Rows | What it is |
|---|---|---|
| icloud_server | 252K | All iCloud server-side items |
| icloud_client | 252K | Client-side iCloud manifest |
| quarantine | ~2K | Download quarantine events |
| install_history | 254 | App installs over time |
| tcc | 376 | Privacy permission grants (TCC) |
| wifi_intelligence | 131 | Known WiFi networks |
| cookies | 6.3K | Browser cookies |
| internet_accounts | 57 | Configured internet accounts |
| term_sessions | 147 | Terminal sessions |
| chrome_extensions | 11 | Chrome extensions installed |
| notifications, launchpad, dock_items, saved_state, facetime | — | Supporting behavioral context |

**iCloud scope:** 252K server items; 209,772 from "Daniel's MacBook Pro"; 15+ devices in history. Earliest file: 1999-10-01 (long-tail history preserved).

**Download quarantine sources:**
- iMessage attachments: 1,826
- Chrome: 108
- AirDrop (sharingd): 71
- Safari: 6
- Homebrew Cask: 4

---

## DuckDB Views → Supabase Equivalents

| DuckDB View | Supabase Equivalent |
|---|---|
| v_events_master | events fact table (keep raw local) |
| v_monthly_cycle | monthly_cycle materialized view |
| v_session_outcome | claude_session_metrics table |
| v_workflow_mode_hourly | workflow_mode_hourly mat view |

---

## Key Queries

```sql
-- Q1: What did I do at hour X on date Y?
SELECT source, action, count(*) FROM v_events_master
WHERE occurred_at >= '2026-05-22 14:00' AND occurred_at < '2026-05-22 15:00'
GROUP BY 1, 2 ORDER BY 3 DESC;

-- Q2: Planning day or producing day?
SELECT mode, count(*) AS hours FROM v_workflow_mode_hourly
WHERE hr::DATE = CURRENT_DATE GROUP BY 1 ORDER BY 2 DESC;

-- Q3: Claude sessions that produced output
SELECT first_event_at::DATE, project_dir, duration_min, total_downstream
FROM v_session_outcome
WHERE total_downstream > 100 AND duration_min BETWEEN 15 AND 240
ORDER BY total_downstream DESC LIMIT 20;
```

---

## IMPORTANT CAVEATS — Read Before Interpreting Any Timestamps

1. **May 19, 2026 security incident** reset all local filesystem btimes. This is a cloud-rebuild artifact, not real file creation. Do not use filesystem btime for authoring dates around this period.

2. **Friday/Saturday filesystem spikes** (93K and 71K events respectively) are cloud-sync artifacts, NOT real authoring activity. Do not interpret these as production peaks.

3. **Use Drive `createdTime` and Claude Code session timestamps** for real authoring signal — these are unaffected by the May 19 incident.

4. **Claude Code vs. Claude Web event counts are not comparable.** Code logs every `tool_use` as an event; Web logs only message turns. Code is ~2.5× heavier in event volume but not 2.5× more conversations.

5. **Session boundaries in Claude Code are loose.** JSONL files can span multiple days. Use 30-minute-gap detection to identify real session boundaries, not file boundaries.

6. **`v_session_outcome.total_downstream` is correlational, not causal** near May 19. Treat with skepticism for that date range.

---

## Re-Run Instructions

```bash
cd ~/Documents/inventory-2026-05 && source venv/bin/activate

# Refresh filesystem
python plaso/native_walker.py

# Re-run mac_apt (full disk — slow)
cd mac_apt/repo && python mac_apt.py MOUNTED / -o ../output -c -j FAST

# Rebuild DuckDB
python duckdb/build_inventory_db.py
duckdb duckdb/inventory.duckdb < duckdb/workflow_analyses.sql

# Refresh AI tables
python ai_services/load_claude_web.py
python ai_services/load_claude_code.py
python ai_services/build_workflow_views.py

# Full Drive backfill (30-60 min, 7-day window walk)
python drive/pull_drive_activity_full.py
```

---

## Drive Data Notes

- **Partial year coverage:** 64,037 events, 2025-05-19 → 2026-05-23
- **Full backfill:** `drive/pull_drive_activity_full.py` (30–60 min runtime)
- **QNAP (`/Volumes/GSR`) deliberately excluded** — per project off-limits rules (read-only SMB only)
