<!-- ARCHIVE: GSR Automation Reference -->
<!-- DOMAIN: intelligence -->
<!-- KEYWORDS: data sources, raw data, archive, Drive, conversations.json, memories.json, archaeology_data, ChatGPT export, OpenAI export, DuckDB, mac_apt output, forensic data, Google Drive IDs, file locations -->
<!-- SOURCES: Drive folder exploration 2026-05-28 -->
<!-- UPDATED: 2026-05-28 -->

# Data Sources Inventory

Reference for "where is X data?" — all raw archive locations, Drive IDs, and repo paths.

---

## Google Drive — Archive Root

**Folder:** "Data archive"
**Drive ID:** `10-OljqoLf27K5S4MV2g4f5BpO7l6Le-U`

### Subfolders

| Subfolder | Drive ID | Contents |
|---|---|---|
| Claude Data Export | `1ntN4DJsFi5ALbilRzc7hca248fBJjGfS` | conversations.json, memories.json, projects/, design_chats/ |
| Open AI Data Expoert [sic] | `1eK-CPmo6dXrtGeF95N414magFunDpVX4` | ChatGPT full export |
| Multisource Forensic Data | `1z77HnhMP4UlTl4uNFuuksS5yQXtYf_AB` | mac_apt output, DuckDB, analysis reports |

---

## Claude Export (Google Drive > Claude Data Export)

| File | Size | What it is |
|---|---|---|
| conversations.json | 116 MB | All Claude Web conversations (~879 analyzed) |
| memories.json | 53 KB | Claude stored memories about Daniel |
| design_chats/ | 2 JSON files | Design-focused conversations (subset) |
| projects/ | 20 JSON files | Claude Projects; largest: 356KB, 141KB, 115KB, 69KB |

**Already processed:** `archaeology_data.json` in repo root — processed form of conversations.json from ~879 sessions. Use this for queries; re-process from conversations.json only if you need raw turn data.

---

## ChatGPT / OpenAI Export (Google Drive > Open AI Data Expoert)

| File | Size | What it is |
|---|---|---|
| conversations-002.json | 10.4 MB | ChatGPT conversation batch |
| conversations-003.json | 10.7 MB | ChatGPT conversation batch |
| conversations-004.json | 9.4 MB | ChatGPT conversation batch |
| conversations-005.json | 22.5 MB | ChatGPT conversation batch (largest) |
| chat.html | 78.9 MB | Full rendered export |

**Embedded media:** 26 PNGs, 6 JPEGs, 1 WebP (production materials embedded in export)

**Content present in ChatGPT data:**
- CTN podcast content
- RLN media
- GSR sponsorship pitches ($100–150/episode targets)
- Interview scripts
- Star Spangled Adventures animated series
- Video contract (J. Bradford Rose / Miley Benjamin)

---

## Forensic Data — Local Mac

**Base path:** `~/Documents/inventory-2026-05/`

| Path | Contents | Notes |
|---|---|---|
| `duckdb/inventory.duckdb` | 27 tables, 9 views, 392K+ events | Primary analysis database |
| `output/` | CSV exports of 4 DuckDB views | Snapshot exports |
| `plaso/filesystem_files.csv` | 214,199 file records | Full filesystem scan |
| `plaso/filesystem_events.csv` | ~857K events | Filesystem event log |
| `mac_apt/output/` | 77 CSV/JSONL files | Raw mac_apt extraction (49 plugins) |
| `drive/files.jsonl` | Drive file metadata | Google Drive API pull |
| `drive/activity.jsonl` | 64,037 Drive events | 2025-05-19 → 2026-05-23 |
| `ai_services/` | Claude web/code loaders | Python scripts |
| `venv/` | Python virtualenv | Activate before running any script |
| `logs/` | Script run logs | |

---

## Multisource Forensic Data (Google Drive > Multisource Forensic Data)

Drive ID: `1z77HnhMP4UlTl4uNFuuksS5yQXtYf_AB`

Contains cloud-synced copies of:
- mac_apt output (12GB source)
- DuckDB database and analysis exports
- FINDINGS.md and MONTHLY_CYCLE_REPORT.md analysis reports

---

## Repo Files

| Path | What it is |
|---|---|
| `archaeology_data.json` | Processed Claude conversation export (~879 sessions) |
| `apps/dashboard/` | Next.js 16 + Supabase dashboard (active app) |
| `supabase/migrations/` | 28 applied migrations (as of 2026-05-28) |
| `docs/` | Project documentation |
| `docs/archive/` | Reference files for future Claude sessions |
| `BUILD_STATUS.html` | Visual build overview — open in browser |

---

## Google Drive — Active Production Docs

These are working documents, not archive. Listed here for completeness.

| Document | Notes |
|---|---|
| MONTHLY INTERVIEW SCHEDULE | Most-edited doc; 74 active days |
| Interview Article Assignments | 36 active days |
| GSR Graphics Tracking: [Month] | Monthly tracking sheets |
| GSR Episode Titles/Timecodes | Per-episode reference |
| GSR Guest Contact List | Talent/contact database |
| Episode docs: `GSR S0X EpYYY-ZZZ.docx` | Per-episode production docs |

---

## Timesketch

- **URL:** `http://localhost` (Docker; must be running)
- **Login:** daniel
- **Sketch:** sketch_id=1, "Inventory 2026-05"
- **Events:** 944K total across 6 timelines
- **Source data:** Loaded from DuckDB views + mac_apt output

---

## Notes on Scope Exclusions

- **QNAP (`/Volumes/GSR`)** — deliberately excluded from all forensic and Drive pulls per project off-limits rules
- **Notion** — wiki-only after ADR-0012 (Supabase pivot, 2026-05-23); not in data archive scope
