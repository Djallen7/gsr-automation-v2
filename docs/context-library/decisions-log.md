# Decisions log (cross-cutting) + open questions

**Load when:** a decision spans multiple domains, or to check open items awaiting Daniel.
**Authoritative source:** this file + `decisions/` ADRs.

## Open questions (awaiting Daniel — clear these to close gaps)
### OPEN — The missed graphics-worksheet rule
Found both lower-thirds worksheets; no separate graphics decision worksheet located. Need Daniel to name the rule or point to the doc. Candidate: graphics align to the lower-thirds 15-beat structure. (See `editorial-and-graphics.md`.)

### OPEN — Context library Phase 2 (apps read/write via MCP)
Gated on a reliability proof, because Daniel's existing MCP connectors are flaky. If built, host on existing Vercel+Supabase, weigh the hosted-endpoint security tradeoff; auto-load on apps stays best-effort regardless. (See `data-sources-and-tools.md`.)

### OPEN — Sheets write integration
Needed so a session can populate the trackers directly (commit a Sheets helper + inject a Google credential). Until then, paste-ready blocks only.

## Entries
### 2026-06-11 — Context library architecture chosen: Phased  [status: active]
Decision: build the repo-native markdown library now (this file's home), enforced in Claude Code; defer the cross-surface MCP layer to Phase 2 pending a reliability proof. Structure = INDEX router + broad category files + append/supersede protocol; no embeddings/RAG; entries row-shaped for later DB migration.
Source: Daniel (2026-06-11) + 3-agent research sweep
