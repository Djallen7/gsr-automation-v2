# GSR Context Library — INDEX (the router)

This is the always-loaded map of Daniel's durable context. It is small on purpose.
**It does not contain the knowledge — it tells a session which category file to open and when.**
Category files are read on demand (with Read/Grep), never bulk-imported, so context stays lean.

Phase 1 (now): a repo-native library, fully enforced in Claude Code, readable in the apps via
the GitHub connector. Phase 2 (gated on a reliability proof): mirror to Supabase behind one
MCP connector for app read/write. Entries are written row-shaped so Phase 2 is a parser, not a redo.

---

## The drift rule (how a session uses this)
1. At session start this INDEX is in context. Do not bulk-read every category.
2. Before answering, match the topic against the **Load when** triggers below and **open the
   matching category file(s)** first.
3. **When the conversation shifts to a new topic mid-session, re-check this INDEX and open the
   newly-relevant category before answering.** Topics drift; keep re-routing.
4. If a category's authoritative source doc is listed, that doc is the truth; the category file
   adds dated decisions and a pointer to it.

## The update protocol (how it stays a live brain, not a stale doc)
- **Capture proactively.** Any decision, rule, fact, or preference Daniel states → append it to
  the right category the same session (don't wait to be asked). This is mandated in CLAUDE.md.
- **Entry format** (append to the TOP of the category's "Entries" section):
  ```
  ### YYYY-MM-DD — <one-line decision title>   [status: active | superseded-by: YYYY-MM-DD]
  Decision: <what was decided, 1–2 sentences>
  Why: <one line>
  Source: Daniel (date) | doc | web
  See also: <other-category.md>  (only if it genuinely spans)
  ```
- **Append, never silently rewrite.** Superseded entries stay, marked `superseded-by`.
- **Dedupe on write:** grep the file first; if the decision exists unchanged, do nothing.
- **Conflict:** if a new decision contradicts a live one, mark the old superseded; Daniel's word wins.
- **New category:** create the file AND add its row here in the same change (an orphan category not
  in this INDEX is invisible). Split a category into `category/sub.md` only when it passes ~250 lines.
- **Audit:** monthly prune of superseded entries + check this INDEX matches the files (named task, not hope).

---

## Categories

| Category file | Load when the topic touches… | Authoritative source(s) it fronts |
|---|---|---|
| `working-rules.md` | how to talk to Daniel, agreeableness, capture discipline, solving from both ends, obstacle analysis, anti-churn, the David Rule, confirm-before-production | `CLAUDE.md` (top sections) |
| `editorial-and-graphics.md` | graphics sourcing, b-roll, the coverage/last-line model, graphic type vocabulary, monologue Pass-1 cues, lower-thirds, voice | `.claude/skills/gsr-graphics-sourcing`, `docs/2026-06-09-monologue-graphics-extraction-spec.md`, `docs/2026-06-09-graphics-tracker-archive-reference.md`, the Lower Thirds Worksheet |
| `data-sources-and-tools.md` | Basecamp (incl. Pings via Search API), Rundown Creator, Google Sheets/trackers, the API-first rule, credential/whitespace state, MCP reliability | `CLAUDE.md` "Data-source access", `scripts/basecamp_token.py` |
| `pipeline-and-dashboard.md` | the production pipeline stages, Supabase schema, ADR-0012, the dashboard, the graphics page UI/UX, RDC export mapping | `docs/_handoff/GSR-WORKFLOW-CANON.md`, `docs/_handoff/2026-06-04-SYSTEM-EVOLUTION.md`, `decisions/` ADRs |
| `distribution.md` | delivery targets, platforms, vendors (StreamHoster, Signiant/RLN, Dropbox, deferred GodTube/OTA/TBN/CTN) | `GSR-WORKFLOW-CANON.md` §11, `distributions.platform` enum, `config/production.json` |
| `crew-and-people.md` | David Rives, guests, the team (Isaac, Jakob, Jeremiah, Gabe, Miryam, Anderson, Ethan, Bella), who owns what | `GSR-WORKFLOW-CANON.md` crew section |
| `infrastructure-and-security.md` | ProPresenter/ATEM/QNAP, off-limits gear, the 2026-05-20 security incident, SSH/credential rules | `CLAUDE.md` "Off-limits" + "Security Rules" |
| `decisions-log.md` | cross-cutting decisions that don't fit one domain; open questions awaiting Daniel | this file + `decisions/` ADRs |

> New domains get a new category here + its file, created together.
