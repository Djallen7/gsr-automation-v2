# GSR Build-Plan Optimization Report

Loop task T1. Prioritized, objective improvements to the GSR build plan: tools,
architecture, efficiency, and fragile points. Grounded in the v2 repo's
reconciled tool registry (GSR-WORKFLOW-CANON.md) plus current best practices.
Generated 2026-06-07. No production changes made; this is advice only.

## How to read this
Each item: what it is, why it helps GSR, and a priority (P0 do-soon, P1 worth it,
P2 nice-to-have). Nothing here overrides Daniel's established stack; it refines it.

---

## A. Architecture / backend

### A1 [P1] Adopt Supabase native Queues (pgmq) + Cron for the job control plane
The canon plan is "the Mac polls a Supabase `jobs` table" plus "Supabase Cron to Edge Function." Supabase now ships **pgmq** (a Postgres message queue) with **Queues**, **Cron**, and **background tasks in Edge Functions** as first-class features. Refining the hand-rolled jobs table into pgmq gives atomic claim, visibility-timeout, and retry semantics for free, less custom code, fewer race conditions.
- Keep the Mac as the heavy-media worker (Vercel/Edge timeouts make it the right place for uploads/transcription). pgmq just becomes the durable, well-behaved queue the Mac drains, instead of a custom SELECT-FOR-UPDATE loop.
- Why for GSR: more reliable unattended distribution jobs, the exact area the canon flags as a silent-failure risk.
- Source: Supabase "Processing large jobs with Edge Functions, Cron, and Queues."

### A2 [P0] Retry with exponential backoff + a dead-letter path on every distribution job
The known failure mode (Rumble sync broken, OAuth tokens expiring on unattended uploads) is exactly what a retry-and-alert layer is for. Each distribution job should retry with backoff, and on final failure write a failed row plus fire a notification (ntfy/email per canon) so a human catches it before air. This is the highest-leverage reliability fix and directly serves the David Rule.

### A3 [P1] Health probe that parses the body, not the status code, for Rundown Creator
Canon already notes RC returns errors as HTTP 200 with a JSON body. The system-health check (and any RC call) must parse the body. Build this as a tiny shared client wrapper so no future code forgets it. A fragile point worth hardening once, centrally.

---

## B. AI / agent layer (for building AND running the system)

### B1 [P0] Model-tiering for the build agent team
When a Claude Code agent team builds the system from the course export, tier the models: Opus as the planning/orchestrator, Sonnet for execution, Haiku for admin (git summaries, log triage). Reported ~40% cheaper than all-Opus with no quality loss on execution. Directly cuts the cost of the big build pass.
- Source: agent-teams cost analysis (CloudZero, Shipyard).

### B2 [P1] Supervisor + fan-out as the default orchestration shape
For the build and for future research sweeps, the durable pattern is: one supervisor plans and splits work, independent workers fan out with their own context, results merge. Keep workers read-only or tightly scoped to limit blast radius. This is exactly the structure that worked for the UI bake-off.
- Source: "Multi-Agent Orchestration: 5 patterns that work in 2026", Anthropic agent-teams docs.

### B3 [P2] Keep metadata TEMPLATED, not AI-generated (already the canon decision)
Reaffirmed as correct: AI is for lower-thirds extraction and regenerate only; metadata stays templated. Resist scope-creeping AI into metadata; templates are cheaper, deterministic, and on-brand.

---

## C. Distribution tooling (reconciled to the established stack)

The canon registry is current and correct; these are refinements, not replacements:
- **YouTube:** official `googleapis` resumable client on the Mac. [P0] Add a publish-time guard so a video never flips public before the Google audit clears (a noted credibility risk).
- **Rumble:** manual Phase 1 is right while the API token is pursued; the optimization is purely the retry/alert wrapper (A2), not browser automation (correctly rejected).
- **StreamHoster:** `basic-ftp` FTPS, one upload feeds Roku/Apple TV/iOS/LG. [P1] Verify the FTPS cert/lib still current at build time.
- **RLN via Signiant Media Shuttle:** official SDK, -20 LKFS. Keep the loudness check as an automated gate before send.
- **Dropbox:** official `dropbox-sdk-js`, chunked over 150MB. Correct.
- **GSN:** Roku Direct Publisher JSON feed is PROPOSED, pending channel-type confirmation. [P0-human] Confirm the channel is Direct Publisher before building the feed route.
- **Transcription:** WhisperKit + SpeakerKit local on the Mac. Correct and cost-free.

## D. Fragile points to watch (the "keep an eye on these" list)
1. Unattended auth (YouTube/Rumble/Dropbox OAuth) expiring silently. Mitigation: A2 + token-expiry pre-checks + alerts.
2. RC HTTP-200-error trap (B/A3).
3. The graphics-to-lower_thirds rename and the premade_library enum are proposed, not applied; build code must not assume they exist yet.
4. Vercel limits (4.5MB / 15min) mean heavy work must stay on the Mac, never drift into a route handler.
5. Air-date slippage is the highest-stakes failure; surface it loudly in the UI (already the strategy) and never let a job fail silently near air.

## E. Cost / efficiency
- Model-tiering (B1) is the biggest single lever.
- Templated metadata (B3) avoids per-episode AI spend.
- pgmq/native primitives (A1) reduce custom-code maintenance.
- Local Mac transcription (WhisperKit) avoids per-minute cloud STT cost.

## Top 5 to act on first
1. A2 retry + alert on every distribution job (reliability, David Rule).
2. B1 model-tiering for the build agent team (cost).
3. YouTube publish-time audit guard (C, credibility).
4. Confirm GSN channel type before building its feed (C, human input).
5. A3 body-parsing RC client wrapper (fragility).

## Sources
- Supabase: Processing large jobs with Edge Functions, Cron, and Queues (pgmq) - https://supabase.com/blog/processing-large-jobs-with-edge-functions
- Supabase best practices (security/scaling/monitoring) - https://www.leanware.co/insights/supabase-best-practices
- Claude Code Agent Teams docs - https://code.claude.com/docs/en/agent-teams
- Multi-agent orchestration patterns 2026 - https://www.digitalapplied.com/blog/multi-agent-orchestration-5-patterns-that-work
- Claude Code agents cost (model tiering) - https://www.cloudzero.com/blog/claude-code-agents/
- Grounding: gsr-automation-v2 GSR-WORKFLOW-CANON.md reconciled tool registry; CLAUDE.md project state.
