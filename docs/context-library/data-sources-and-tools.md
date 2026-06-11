# Data sources & tools

**Load when:** Basecamp, Rundown Creator, Google Sheets/trackers, credentials, MCP vs API, pulling/writing show data.
**Authoritative source:** `CLAUDE.md` "Data-source access" + `scripts/basecamp_token.py`.

## Entries
### 2026-06-11 — Daniel's existing MCP connectors are unreliable  [status: active]
Decision: several of Daniel's current MCP connectors fail/are flaky. Therefore Phase-1 of the context library is built MCP-free (repo files), and any future MCP (Phase 2) is gated on a reliability proof first. Diagnosing why his connectors fail is a candidate task.
Source: Daniel (2026-06-11)

### 2026-06-10 — APIs first, NOT the Drive MCP  [status: active]
Decision: reach every source via its API with a committed helper + env credential. The Drive MCP is read-only (no cell-write) — do NOT use it for the graphics trackers. A source survives sessions only if BOTH its helper is committed AND its secret is in the env config.
Source: Daniel (2026-06-10)

### 2026-06-10 — Google Sheets trackers: NOT wired here  [status: active, blocker]
Decision: no Google credential is injected and no Sheets helper is committed, so a session cannot read/write the trackers except via the read-only Drive MCP. FIX (once): commit a Sheets helper mirroring basecamp_token.py + inject a Google credential (service-account JSON or OAuth) into the web-env config; share the sheet with the service-account email if that route. Tracker IDs: May `1GmdVDOP…`, June `13_PQdT…`, folder `18RZ8UNF…`.
Source: Daniel (2026-06-10)

### 2026-06-09 — Basecamp Pings reachable via the Search API  [status: active]
Decision: no `/pings` endpoint, but `GET /search.json?q=<signoff phrase>&exclude_chat=0` indexes Pings; hits give `/buckets/{b}/chats/{c}/lines/{l}.json` (page like a campfire). Search David's signoff phrases, not "monologue". Daniel↔David ping thread = bucket 37938438 / chat 7507269814 (holds vault-absent monologues). Workflow fix: David should file monologues into the GSR Monologues vault (id 9668065709).
Source: Daniel (2026-06-09)

### 2026-06-09 — RDC = read-only here; key had whitespace  [status: active]
Decision: Rundown Creator API (`…/davidrives/API.php`, key+token in env) is used read-only (getRundowns/getRows/getScript); the app's rc-import only READS RDC → writes Supabase `scripts` (no write-back to RDC). `RUNDOWN_CREATOR_API_KEY` carried a leading-space char; trim at call time; re-enter clean (session must restart to pick up).
Source: Daniel (2026-06-09)
