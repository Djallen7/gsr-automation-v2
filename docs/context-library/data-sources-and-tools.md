# Data sources & tools

**Load when:** Basecamp, Rundown Creator, Google Sheets/trackers, credentials, MCP vs API, pulling/writing show data.
**Authoritative source:** `CLAUDE.md` "Data-source access" + `scripts/basecamp_token.py`.

## Entries
### 2026-06-11 — Connector health check (empirical, this session)  [status: active]
Decision: tested the live MCP connectors read-only. **Healthy now:** GitHub (Djallen7), Supabase ("GSN Hub" `lafkbxypmciopebentxp`, ACTIVE_HEALTHY, pg17), **Google Drive (reads full Drive AND full tracker cell contents)**, Gmail (labels incl. dallen@davidrives.com). **Untested:** Vercel (needs teamId), Postman. **Flagged for removal:** a crypto-*trading* MCP with live order-execution/deposit tools is wired into this env — no place in a ministry environment; never called.
Implication: "all my connectors are flaky" is NOT true for the four that matter today; Phase-2 footing is better than feared. The Drive read-only ceiling (no cell-write) is the only real tracker gap — see Sheets entry.
Why: turn "they're unreliable" into evidence before building Phase 2.
Source: Daniel (2026-06-11) + live test

### 2026-06-11 — Drive MCP reads tracker cell contents in full  [status: active]
Decision: `read_file_content` on a Google Sheet returns all cell data as markdown tables (verified on the June tracker `13_PQdT…`, an empty per-episode template). So a session CAN read any tracker directly now; the prior "cannot read the tracker except via read-only Drive MCP" framing understated this. Note: the June sheet has a tab "⚠️ RESERVED FOR =CLAUDE... FUNCTIONS" (Key/Value/Expiration) — evidence of a prior Sheets-side Claude bridge; do not edit it.
Source: live test (2026-06-11)

### 2026-06-11 — Daniel's existing MCP connectors are unreliable (claim)  [status: active, partially refuted]
Decision: Daniel reports several connectors fail/are flaky. Phase-1 of the library is built MCP-free regardless, and Phase-2 stays gated on a reliability proof. BUT the 2026-06-11 health check found the four core connectors healthy — so the flakiness is intermittent or limited to specific connectors, not universal. Diagnosing WHICH ones fail and why is the real task.
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
