<!-- ARCHIVE: GSR Automation Reference -->
<!-- DOMAIN: index -->
<!-- KEYWORDS: index, navigation, archive, all files, entry point, search guide -->
<!-- SOURCES: all archive files -->
<!-- UPDATED: 2026-05-28 -->

# Archive Index — GSR Automation Reference

Master navigation file for the `docs/archive/` directory.
**Start here** if you need to locate reference data for any GSR automation task.

---

## How to Use This Archive

**Targeted search (recommended):**
```bash
grep -r "KEYWORDS" docs/archive/          # list all keyword sets
grep -ri "guest research" docs/archive/   # find files about a specific topic
grep -ri "ProPresenter" docs/archive/     # find files mentioning a tool
```

**Full file read:** each file is ≤ 160 lines and self-contained — safe to load fully into context.

---

## File Map

| File | Domain | What's in it | Key Keywords |
|---|---|---|---|
| `DANIEL_CONTEXT.md` | context | Who Daniel is, working style, contacts, constraints | Mae, dallen@davidrives.com, Smyrna, ProPresenter MCP, Hannah Webster, Miryam |
| `WORKFLOW_PATTERNS.md` | workflow | Day/hour working patterns, mode distribution, calendar | Friday, Tuesday, 8pm, late night, planning, producing, Drive patterns |
| `SYSTEM_MAP.md` | systems | Every tool, integration, and app in the stack | Notion, Drive, Supabase, Vercel, ProPresenter, ATEM, QNAP, Headroom, Basecamp |
| `GSR_PRODUCTION.md` | production | Show structure, team, segments, distribution, Drive docs | GSR, CTN, WWN, David Rives, Miryam, segments, Fireside, StreamHoster |
| `BEHAVIORAL_FORENSICS.md` | intelligence | Forensic pipeline state, DuckDB tables, key queries, caveats | mac_apt, DuckDB, Timesketch, iCloud, WiFi, May 19 incident, timestamp contamination |
| `DATA_SOURCES.md` | intelligence | Where all raw data lives — Drive IDs, local paths, repo paths | conversations.json, memories.json, archaeology_data, ChatGPT export, Google Drive IDs |
| `AI_USAGE_PATTERNS.md` | intelligence | Claude/ChatGPT usage breakdown, recurring errors, subagents, Anti-Churn | guest research, lower thirds, YouTube titles, gsr-editorial, gsr-supabase, automation failures |

---

## Quick Reference by Task

### "Who is Daniel / what are his constraints?"
→ `DANIEL_CONTEXT.md` — identity, working style, collaborators, hard constraints, ProPresenter MCP project

### "When does Daniel work? What days/hours?"
→ `WORKFLOW_PATTERNS.md` — day-of-week patterns, hour-of-day, workflow mode distribution

### "What tools does this team use?"
→ `SYSTEM_MAP.md` — full stack map, active tools, off-limits systems, distribution platforms

### "Tell me about the GSR show / production process"
→ `GSR_PRODUCTION.md` — show overview, segments, team, related shows (CTN, WWN), Drive docs

### "What AI mistakes should I avoid?"
→ `AI_USAGE_PATTERNS.md` — 5 recurring Claude errors, the Anti-Churn Rule, key lessons for future sessions

### "Where is the raw forensic / behavioral data?"
→ `BEHAVIORAL_FORENSICS.md` — pipeline state, DuckDB table inventory, re-run instructions, timestamp caveats

### "Where is the archive data / Drive IDs / file paths?"
→ `DATA_SOURCES.md` — all Drive folder IDs, local data paths, file sizes, what's in each export

---

## Data Sources Summary

All archive content derives from:

| Source | What it covers |
|---|---|
| Claude conversation export (`conversations.json`, 116MB) | 879 Claude Web sessions; processed into `archaeology_data.json` at repo root |
| Claude memories (`memories.json`, 53KB) | Stored Claude memories about Daniel — identity, projects, preferences |
| ChatGPT export (`conversations-002..005.json`, 53MB total) | ChatGPT usage; ministry/business content (podcasts, contracts, pitches) |
| mac_apt forensic extraction | 12GB, 49 plugins, 77 CSV/JSONL files from Daniel's Mac |
| DuckDB inventory (`inventory.duckdb`) | 392K behavioral events across 7 sources; 27 tables, 9 views |
| Google Drive activity API | 64,037 Drive events from 2025-05-19 → 2026-05-23 |
| CLAUDE.md + project docs | Hard constraints, active build state, project decisions |

---

## Archive Coverage Gaps

These were deliberately excluded or not yet archived:

- **Raw ChatGPT conversation content** — large files (53MB+); not parsed into structured data yet
- **QNAP / GSR Shared Drive** — off-limits; not in any archive
- **Notion workspace** — wiki-only after ADR-0012; not archived (decommissioned for automation)
- **Full mac_apt output** — 12GB; too large to load. Summary in `BEHAVIORAL_FORENSICS.md`
- **Personal data** (Sleeper fantasy football, iCloud personal photos etc.) — noted in `DANIEL_CONTEXT.md` but not catalogued further

---

## How to Add to This Archive

When adding a new file:
1. Use the header format: `<!-- ARCHIVE: ... --> <!-- DOMAIN: ... --> <!-- KEYWORDS: ... --> <!-- SOURCES: ... --> <!-- UPDATED: ... -->`
2. Keep files ≤ 160 lines — split topically if larger
3. Add the file to the File Map table and Quick Reference section above
4. Update `LAST_UPDATED` in `BUILD_STATUS.html`

Domain values: `context` | `workflow` | `systems` | `production` | `intelligence` | `index`
