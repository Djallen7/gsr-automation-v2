# Decision Log: 2026-05-22 Conversation

This document captures the architectural decisions made in this conversation. It supersedes any conflicting guidance in earlier versions of MASTER_CONTEXT or other planning docs.

---

## Decision 1: Supabase replaces Notion as the SSOT

**Date:** 2026-05-22
**Status:** Decided
**Supersedes:** Any earlier "Notion as primary backend" planning

Notion is no longer the spine of the GSR automation system. Supabase is. The reasoning:

- Notion's API rate limits and lack of realtime support make every future feature 3x harder
- Notion is not designed as a backend; it fights you on file storage, binary data, and strict typing
- Supabase gives Postgres + realtime + storage + auth + edge functions in one $25/month tier
- Migration cost is low now (early-phase data); it would be catastrophic later

**Notion's new role:** Optional, for human-readable prose docs only. Show bible, meeting notes, marketing planning. Never connected to automation. Never the source of truth for operational data. Can be dropped entirely without affecting the system.

---

## Decision 2: Feature-at-a-time build, not full foundation first

**Date:** 2026-05-22
**Status:** Decided

The original plan implied designing the entire data model and architecture before building any features. This is reversed. The new approach:

- Build one feature end-to-end before starting the next
- Let the data model grow as features demand it
- Resist the temptation to design tables for features that aren't being built yet
- Each feature becomes the test case for whether the patterns work

This is captured in detail in START_HERE.md.

---

## Decision 3: Lower-thirds approval is the first feature

**Date:** 2026-05-22
**Status:** Decided

The first feature built is the Jakob lower-thirds approval workflow. Reasoning:

- Tiny blast radius (failure doesn't break production)
- Fast feedback loop (20 graphics per session, vs 1 episode per week for distribution)
- Contains every pattern needed later (database, storage, AI, approval queue, roles)
- No server access required
- Three tools needed: Supabase + Next.js + Claude API

Full spec: FEATURE_1_LOWER_THIRDS.md

---

## Decision 4: ProPresenter stays

**Date:** 2026-05-22
**Status:** Decided
**Corrects:** Earlier audit recommendation that flagged ProPresenter

Earlier conversations referenced "ProPresenter is a mess" — I misread this as a complaint about the software. The actual complaint was about Google Drive organization and overall file sprawl. ProPresenter the software stays because:

- It's the right tool for visual slide-based control
- Interns find it accessible (slides, not rows of text)
- No Mac-native alternative exists (vMix is Windows-only)
- The layering capabilities (lower third + bug + graphic + super source) are what the show relies on
- Replacing it would cost hundreds of hours rebuilding templates for marginal gain

Future ProPresenter work: API integration for pushing approved graphics. That's phase 2 of feature 1. ProPresenter is not replaced.

---

## Decision 5: Server stays read-only, working data lives elsewhere

**Date:** 2026-05-22
**Status:** Decided (consistent with prior architecture constraint)

The QNAP3/QNAP5 servers are the archive and broadcast source. They must remain in the system. But:

- Working data (current operational state) lives in Supabase, not on the server
- The dashboard reads from both: Supabase for live state, server for archived/finalized files
- Finished masters get archived to the server at end of cycle
- The server is the destination, not the workspace

This resolves the "can I bypass the server" question: no, but you also don't need to bypass it.

---

## Decision 6: Most tool swaps wait

**Date:** 2026-05-22
**Status:** Decided

The tooling audit identified ~6 potential swaps. The decision: do not swap any of them as part of the foundation work. Specifically:

- **Fireside.fm → Transistor:** wait until distribution features are built. Manual upload continues for now.
- **StreamHoster → Cloudflare Stream:** same. Wait.
- **Rundown Creator → Cuez:** wait until rundown automation is being built. Until then, current Rundown Creator workflow continues.
- **Vercel AI SDK → direct Anthropic SDK:** wait. Pick whichever is convenient when you write the first AI call. They're nearly identical for our use case.
- **Add Bitfocus Companion:** optional, can add anytime, low risk. Not blocking anything.
- **Add Langfuse for prompt management:** wait. For feature 1, prompts live in the codebase. Add Langfuse when you have 5+ prompts to manage.

The audit document remains in the repo as reference, but it is NOT a TODO list. Treat it as research, not roadmap.

---

## Decision 7: GitHub MCP not currently connected

**Date:** 2026-05-22
**Status:** Operational note

The Claude session running this conversation does not have GitHub write access. Files created in this conversation need to be added to the repo by Daniel manually (drag-and-drop in the GitHub web UI, or commit via Claude Code on the Mac).

**Action item:** Connect a GitHub MCP for future sessions to be able to push directly. Until then, all repo updates flow through Daniel.

---

## Decision 8: Claude.ai Projects are not the home for voice DNA samples long-term

**Date:** 2026-05-22
**Status:** Decided

Voice DNA Skills currently live in Claude.ai Projects. This works for Daniel personally calling Claude.ai. It doesn't work for the dashboard backend calling Claude API. The decision:

- Keep voice samples in the gsr-automation-v2 repo (e.g., `/voice-samples/` directory)
- For feature 1, this doesn't matter; lower-thirds don't use voice DNA
- When script-writing automation is built (much later), the backend reads samples from the repo and includes them in prompts
- Claude.ai Projects can still exist as a convenient frontend for Daniel's ad-hoc use, but it's not the source of truth

---

## Decision 9: Order of operations after feature 1

**Date:** 2026-05-22
**Status:** Decided in principle, subject to revision after feature 1 ships

After lower-thirds approval works in production for one cycle:

1. Phase 2 of lower-thirds: ProPresenter API push
2. Episode metadata schema (transcripts, descriptions, chapters)
3. YouTube upload automation
4. Guest pipeline schema and outreach automation
5. Distribution to other platforms (begins with Cloudflare Stream + Transistor swap if appropriate)
6. n8n introduction (only when 3+ workflows need orchestration)

Each of these is a separate feature with its own spec. None get designed in detail until they're next in line.

---

## Decision 10: This document is the truth

**Date:** 2026-05-22
**Status:** Decided

Earlier planning docs (MASTER_CONTEXT v2.0, the audit, the research charter) remain in the repo as historical context. Where any of them conflict with this decision log, this decision log wins.

When a new decision is made, add it here. Don't go back and edit old documents to match. The audit log is the source of truth for the architecture's current state.

---

## Open questions (for future sessions to resolve)

- **Will Daniel need to sell David Rives on the Supabase migration?** Probably yes, eventually. Feature 1 doesn't require David's buy-in because lower-thirds isn't user-facing for him. Distribution features will.
- **Will Daniel need help convincing the team to move off Fireside / StreamHoster?** Yes when those swaps happen. Until then, no need.
- **When does Miryam get onboarded to the dashboard?** During the feature 1 real-episode test, probably. She doesn't need to use it for lower-thirds, but she should know it exists.
- **What's the GSR brand identity for the dashboard?** Get the actual brand assets (lower-third design, logo, color palette) from Jakob during the stage 2 dashboard shell build. Don't worry about it before then.

---

## What changed in this conversation that should be reflected in MASTER_CONTEXT v3.0

When MASTER_CONTEXT gets a v3.0 update, these are the deltas:

1. Section 6 (Architecture) — Supabase is no longer "ADR needed," it's chosen. Notion is removed from the database options list.
2. Section 7 (Phased Roadmap) — replaced with the feature-at-a-time approach. POST/PRE/LIVE tracks remain as eventual destinations but aren't the build order.
3. Section X11 (Open Questions) — most of these are now decided. Closed.
4. New Section 8.5 or wherever: the lower-thirds spec becomes its own subsection.
5. Tool inventory — note the swap candidates explicitly, with status "deferred until distribution features built."

This v3.0 update is not urgent. Make it after feature 1 ships, when we have real evidence of what works.
