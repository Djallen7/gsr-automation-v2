# GSR Research Charter

**Purpose:** A north-star document that every GSR tooling research sweep (and every Claude session running one) reads *first* to calibrate priorities before evaluating tools, repos, or platforms.

**Owner:** Daniel Allen
**Last updated:** 2026-05-22
**Status:** Living document — append-only by default, supersede with version notes.

---

## 0. How to use this document

**If you are a Claude session about to run a research sweep:**

1. Read Sections 1–4 (principles, hard constraints, future-feature hopper, anti-patterns) before touching the web.
2. Use Section 5 (status taxonomy) and Section 6 (output format) for every entry you produce.
3. If a candidate tool conflicts with a hard constraint in Section 2, mark it 🔴 SKIP and move on without further evaluation.
4. If a candidate tool conflicts with the future-feature hopper in Section 3, do not auto-reject — surface it as a flagged tradeoff so Daniel can decide.
5. Append findings to `GSR_Tooling_Resources.md` using the established batch-tag system.

**If you are a human reader:**

This is the lens. It does not enumerate every preference — it captures the ones that recur, conflict with otherwise-attractive options, or matter for features that don't exist yet.

---

## 1. Strategic principles (the lens)

These are not tiebreakers. They are the lens through which all tooling decisions get made.

**1.1 Flexibility-first.** Pick tools that don't box in future features. When two tools are close, prefer the one that lets the platform grow sideways (new feature, new integration, new view) without ripping out the foundation. Specifically: prefer extensible data stores over rigid SaaS databases, prefer composable component frameworks over template-based site builders, prefer tools with documented public APIs over tools with only proprietary UIs.

**1.2 Bus-factor protection.** Anything the team needs to use must be usable without Daniel sitting at his computer. Tools that only work inside Daniel's Claude.ai app, or only with his personal credentials, fail this test for shared workflows.

**1.3 GUI-first when possible, code-second when necessary.** Daniel is a non-developer. If a tool requires daily CLI work or hand-written code to operate, that's a tax. Tools where Claude Code or an AI assistant can do the hand-coding behind a GUI are acceptable. Tools that require Daniel to learn a new programming concept to operate are not.

**1.4 Read-only against production servers.** Following the server incident, no automation runs on QNAP3/QNAP5 and no automation writes to them. Servers may be READ from (mirror, mount, API). Outputs land in a staging location for IT to move.

**1.5 Risk-averse on live production paths.** Anything that touches the studio during a shoot day (ProPresenter live control, live chyron, automated rundown changes mid-show) must have a manual override and a fail-safe. "It crashed during taping" is not acceptable. Build pre-production automation first; defer live-production automation until the pre-production version has been stable for at least 5 episodes.

**1.6 Maximum upside per integration.** Prefer tools that solve multiple problems over single-purpose tools. Example: Supabase (Postgres + realtime + auth + storage + edge functions in one) beats stitching together five separate services even if each individual service is slightly better at its niche.

**1.7 No vendor lock-in for the spine.** The database, the dashboard host, and the orchestrator are the spine. They should all be portable. Use standards (Postgres, Node, HTTP) so the platform can survive any single vendor decision. SaaS is fine for outputs (YouTube, RLN). SaaS is risky for the spine.

---

## 2. Hard constraints (auto-reject if violated)

**License:**
- ❌ AGPL — hard no
- ✅ MIT, Apache 2.0, BSD, MPL — preferred
- ⚠️ GPL-3 — acceptable for end-user tools, not for things that get embedded in distributed code

**Maintenance:**
- Last commit must be within 6 months, OR within 12 months if the tool is feature-complete and the project is stable.
- Single-maintainer projects with no recent activity = ❌ SKIP for production use.
- Pre-alpha or "experimental" projects = ❌ SKIP unless explicitly evaluating a future direction.

**Platform:**
- Must work on macOS. Daniel's machine is a MacBook Pro. Miryam is also on Mac.
- Linux-only tools = ❌ SKIP for anything Daniel or Miryam will run directly.
- Windows-only tools = ❌ SKIP entirely.
- Server-side tools that run somewhere else (cloud, Mac mini) and have a web UI = ✅ fine.

**Operational complexity:**
- Kubernetes = ❌ SKIP
- Custom CUDA = ❌ SKIP
- Build-from-source as the only install path = ❌ SKIP
- Docker = ✅ acceptable for isolated services, ❌ NOT on production NAS

**Scale signals (minimum stars):**
- General-purpose tools: 200+ stars
- Production-pipeline tools (anything in the critical path of an episode shipping): 500+ stars
- Niche broadcast tools (lower thirds, rundown, etc.): 50+ stars acceptable if maintained and well-documented

**Server architecture:**
- ❌ No execution on QNAP3 or QNAP5
- ❌ No write access to production server filesystems
- ✅ Read-only mirrors, read-only mounts, API-based reads, staging buckets

---

## 3. Future-feature hopper (flag conflicts, do not auto-reject)

These are features Daniel wants to add later. Research should flag when a tool under evaluation would make any of these harder. Do not auto-reject — surface the tradeoff.

**3.1 Live ProPresenter slide mirror in dashboard.** Real-time preview of what's currently on the ProPresenter output, visible in the dashboard while editing lower thirds. ProPresenter 7.9.1+ supports this via OpenAPI streaming + websocket `status/slide` channel. Requires: dashboard host with persistent websocket capability, network access to ProPresenter machine (Tailscale), realtime-capable database for state, frontend that can render live updates. **Flags:** tools that lock you into static rendering or non-realtime DBs.

**3.2 Live chyron from ASR (long-term).** OBS + obs-localvocal → topic detection → ProPresenter lower-third push during taping. Highest-risk feature. **Flags:** tools that prevent custom Node services running alongside the dashboard.

**3.3 Multi-user concurrent dashboard.** Daniel + Miryam + correspondents reviewing/approving simultaneously. **Flags:** local-only databases (SQLite past prototype), single-tenant SaaS, anything without row-level subscriptions.

**3.4 Episode-level review queue with embedded video.** Watch raw episode in browser, leave timestamped notes, approve/reject metadata, all in one view. **Flags:** dashboards that can't embed video well (Notion struggles here), databases without good blob storage.

**3.5 Voice DNA usable outside Claude.ai.** Backend-callable script drafting that uses David's voice patterns without requiring Daniel to operate Claude.ai personally. **Flags:** anything that traps voice samples inside Claude Projects only — samples need to live in a repo or DB the backend can read.

**3.6 Guest pipeline as a relational graph.** Guests ↔ topics ↔ episodes ↔ outreach status ↔ recurrence rules ("no repeat within cycle"). **Flags:** flat spreadsheet-only solutions; tools without proper relations or queries.

**3.7 Rundown Creator replacement.** Rundown Creator's silent-fail bugs and lack of public API make it a fragile dependency. **Flags:** anything that bakes `rc_*` calls into multiple places without an adapter layer.

**3.8 Migrate podcast off Fireside.fm.** Long-term, move to a host with a real API (Transistor, Buzzsprout, Captivate). **Flags:** Don't invest deeply in Fireside-specific Playwright tooling beyond the minimum needed to ship.

**3.9 Sub-second push notifications and approvals.** ntfy is in use. **Flags:** orchestrators that can't trigger push fast enough for an "approve this metadata" workflow.

**3.10 Sponsorship / pitch deck / marketing dashboards.** Reuse the same platform spine for non-episode data. **Flags:** dashboards that can't host multiple "apps" or views without becoming a mess.

**3.11 Team-facing operational views.** Each team member sees their queue (Isaac's Opening Monologue graphics, Gabe's edit list, Jakob's MOGRTs). **Flags:** dashboards without role-based views or query-able databases.

**3.12 Integration with team Calendar / Drive / Gmail.** Already partly there via MCP. **Flags:** automation hosts that can't reach Google APIs from where they run.

---

## 4. Anti-patterns (do not recommend these)

**4.1 Don't recommend running services on QNAP3 or QNAP5.** Period.

**4.2 Don't recommend Notion as the primary SSOT for the spine.** Notion is fine as one of several views or for human-readable docs. It is not the right shape for realtime state, live media, custom widgets, or anything in the future-feature hopper above.

**4.3 Don't recommend SQLite past the Phase-1 prototype.** Single-writer, no realtime, no multi-user concurrency. It's a fine local cache. It's not the SSOT.

**4.4 Don't recommend v0.dev as the dashboard foundation.** It's fine for generating individual components inside a real Next.js project. It is not the project.

**4.5 Don't recommend Frame.io as the database.** It's a video review tool, not a database. Use it for what it's good at, not as the backbone.

**4.6 Don't recommend AGPL anything.** See Section 2.

**4.7 Don't recommend tools that lock voice samples inside Claude.ai.** Skills are a good frontend for Daniel, but the source of truth lives in the repo / database.

**4.8 Don't recommend single-vendor proprietary protocols for spine components.** Rundown Creator is already a known weak point; don't make this worse by adding more.

**4.9 Don't recommend tools that require Daniel to maintain custom CUDA, custom build pipelines, or self-hosted Kubernetes.**

**4.10 Don't recommend "just rebuild it on top of [framework X]" without scoping migration cost.** Daniel is risk-averse and a non-developer. Migration cost is real and must be in the eval.

---

## 5. Status taxonomy (the existing flag system)

Every entry in `GSR_Tooling_Resources.md` must carry one of:

- 🟢 **EVAL** — Actively evaluating. Has passed hard constraints. Worth a deeper look.
- 🟡 **WATCH** — Interesting but not the right time. Re-check in a future batch.
- 🟠 **MAYBE** — Could work but has flags worth noting. Not a yes, not a no.
- 🔴 **SKIP** — Fails one or more hard constraints. Document why so we don't re-evaluate it next sweep.

Entries are append-only. To change status, add a new dated note rather than rewriting the old entry. Nothing is deleted.

---

## 6. Output format expectations

Every research entry should include:

- **Name + link**
- **One-line summary** (what it is, no marketing)
- **Status flag** (🟢🟡🟠🔴) with a one-sentence rationale
- **Batch tag** (BATCH-001, BATCH-002, etc.)
- **Category tag** (existing list: graphics-mogrt, chyron-lower-thirds, teleprompter, rundown-newsroom, transcription-asr, chapters-timecodes, b-roll-index, audio-cleanup, ai-video-gen, prose-linter-style, youtube-metadata, email-outreach, mcp-server, show-bible-pm, misc-other)
- **License + last-commit date**
- **macOS-friendly: yes/no/unclear**
- **Stars (with date checked)**
- **Conflicts with future-feature hopper:** which Section 3 items, if any, this would make harder
- **Notes:** anything that didn't fit above. Limit to what's actually decision-relevant.

---

## 7. Things this charter intentionally does NOT do

- It does not enumerate every preference Daniel has. The constitution / MASTER_CONTEXT does that.
- It does not prescribe specific tools by name except where they are already chosen or already rejected.
- It does not freeze decisions. Anything here can be reconsidered with a dated note.
- It does not replace the existing Repo Discovery Criteria — it supplements them with strategic context.

---

## 8. Version log

- **v0.1 (2026-05-22)** — Initial draft. Founding principles, hard constraints, future-feature hopper, anti-patterns, status taxonomy, output format.
