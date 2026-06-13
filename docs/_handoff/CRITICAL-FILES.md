# CRITICAL FILES — the start-from-scratch carry-list

**Purpose.** If this project ever had to be rebuilt from nothing, this is the
list of files you would carry with you. Everything here is either *irreplaceable*
(human knowledge that no tool can regenerate) or *the definition of the system*
(recreatable only with real effort). If a file is not on this list, it is
regenerable or disposable — losing it costs time, not knowledge.

This file exists so that no critical file gets silently missed. It is kept
honest by `scripts/check-critical-files.sh`, which fails loudly if any file
inside the `check:start / check:end` fence below has gone missing. That check
also runs in the session-start health snapshot, so a fresh session shouts if
the carry-list has drifted.

**How to maintain it.** When you add a file that carries irreplaceable facts or
defines the system, add a bullet here in the right tier, in the form
`` - `path/to/file` — one line on why ``. When you intentionally delete or
rename a carry-list file, update this list in the same commit. The check reads
the backtick-quoted path at the start of each bullet between the fence markers.

---

## Tier 0 — Irreplaceable (no tool or person can regenerate this)

Daniel's verified facts, the system's lived history, voice/style canon, infra
map, and the operating rules. Lose these and the knowledge is gone for good.

<!-- check:start -->

### Source of truth (read-first handoff set)
- `docs/_handoff/GSR-WORKFLOW-CANON.md` — how Daniel actually runs the show; his gospel facts; the established distribution stack + vendor registry (§11). The single highest-authority doc.
- `docs/_handoff/HANDOFF.md` — the read-first orientation; where everything is.
- `docs/_handoff/2026-06-04-SYSTEM-EVOLUTION.md` — the full live-verified system reference (eras, decisions, current state).
- `docs/_handoff/VERIFIED-FACTS.md` — facts confirmed against the live system, not memory.
- `docs/_handoff/2026-06-04-CONFLICT-REGISTER.md` — known doc/code conflicts mapped to milestones; the cleanup punch list.
- `docs/_handoff/CONTEXT-README.md` — the guide to the handoff folder itself.
- `docs/_handoff/CRITICAL-FILES.md` — this carry-list; the index of what must survive a rebuild.
- `docs/_handoff/2026-06-04-tools-curriculum-timeline.md` — the tools/curriculum timeline analysis behind the build sequence.
- `docs/_handoff/2026-06-05-distribution-research.md` — the distribution-targets research backing the canon's vendor stack.
- `docs/_handoff/transcript.txt` — raw archaeology of the 879 prior conversations; the primary source the verified facts were distilled from.
- `config/production.json` — the established stack + operational config; source-of-truth #3 for platforms/vendors.
- `CLAUDE.md` — the mandatory operating rules (security, David rule, anti-churn, authority).
- `docs/PROJECT_INSTRUCTIONS_CLAUDE_DESKTOP.md` — the Claude Desktop project operating instructions (the rules that govern non-Code sessions).

### Voice, style, and editorial canon (hard-won, on-air stakes)
- `docs/GSR_VOICE_PROFILE.md` — the show's voice; protects David on air.
- `docs/EMAIL_VOICE_SYSTEM_PROMPT.md` — the email voice system prompt.
- `docs/EMAIL_TEMPLATES.md` — established outbound templates.
- `docs/LOWER_THIRDS_STYLE_GUIDE.md` — lower-thirds style rules the extractor must honor.
- `docs/GSR_METADATA_PATTERN.md` — the metadata naming/structure pattern.
- `docs/GSR_Research_Charter.md` — research scope and standards.
- `docs/PROMPT_LIBRARY.md` — the curated prompt set.

### Infra, risk, and roadmap (operational memory)
- `docs/INFRASTRUCTURE_INVENTORY.md` — machines, IPs, the off-limits production hardware map.
- `docs/FAILURE_MODES.md` — how this system breaks and what not to repeat.
- `docs/AUTOMATION_ROADMAP.md` — the named-task backlog (the anti-churn ledger).
- `docs/OPEN_SOURCE_STACK.md` — the tooling decisions and rationale.
- `docs/SUPABASE_SCHEMA_DESIGN.md` — the schema design intent behind the migrations.

### Agents and guardrails (the system-aware operators)
- `.claude/agents/gsr-architect.md` — the system-aware planner that boots knowing GSR.
- `.claude/agents/gsr-health.md` — the repo-health auditor.
- `agents/gsr-editorial.md` — the copy/voice reviewer.
- `.claude/hooks/session-start.sh` — session bootstrap + health snapshot.
- `.claude/hooks/pre-commit-check.sh` — the TypeScript commit gate.
- `.claude/settings.json` — the harness wiring that activates the hooks/agents.

### Source reference material (irreplaceable originals)
- `docs/reference/Video_Pipeline_Setup.docx` — the original pipeline setup doc.
- `docs/reference/training-plan.docx` — the training plan source.
- `docs/reference/training-plan.pdf` — training plan (PDF original).

## Tier 1 — System definition (recreatable only with real effort)

The shape of the database and the load-bearing code. You could rebuild these by
reverse-engineering the live system, but you would not want to.

- `supabase/migrations/` — the entire schema history; the actual definition of the database (46 migrations, 2 enums, RLS, views, functions, triggers).
- `apps/dashboard/AGENTS.md` — the Next.js 16 caveats; wrong assumptions here break every route.
- `apps/dashboard/package.json` — the dependency + script manifest for the live app.
- `apps/dashboard/src/lib/segments.ts` — the canonical 12-value SEGMENTS list shared across import/upload/extract.
- `apps/dashboard/src/app/api/import/route.ts` — the gated import logic (dry-run, conflict refusal); the heart of the David-rule import safety.
- `apps/dashboard/src/lib/import-mode.ts` — the server-side Type-YES write gate: no confirm token, no write (2026-06-12).
- `docs/_handoff/GUEST-CORRECTIONS.md` — do-not-contact / deceased / title corrections; guest-facing safety authority.
- `docs/_handoff/lanes.json` — source of truth for the lanes tracker (LANES.md and lanes.html are generated from it).
- `docs/_handoff/2026-06-11-claim-ledger.json` — the verified-claims ledger (VERIFIED/PARTIAL/REFUTED evidence base for every build decision).
- `docs/_handoff/2026-06-11-pipeline-build-plan.md` — the build plan of record (slices 0-10 + addenda).
- `docs/_handoff/2026-06-12-dashboard-redesign-plan.md` — the dashboard redesign plan of record (navigation IA + build sequence; the visual sections were retired by the 2026-06-12 UI fresh start).
- `docs/_handoff/DESIGN-TASTE.md` — the ONLY visual design guidance (Daniel's reactions, append-only; all older mocks/UI advice live in `docs/_archive/2026-06-12-ui-fresh-start/` and are not guidance).
- `docs/_handoff/2026-06-11-mission-run-notes.md` — mission decisions, verifier verdicts, incident retros, standing procedures.
- `docs/_handoff/2026-06-11-fable5-mission-prompt.md` — the mission contract the research phase executed under.
- `docs/_handoff/2026-06-08-review-decisions.md` — full record behind canon s13 (Daniel's gospel decisions).
- `docs/_handoff/export-archaeology-backlog.json` — the triage backlog canon s13 cites.
- `docs/_handoff/2026-06-11-superstore-lookup-spec.md` — the creationsuperstore.com lookup contract (plan 7.4 builds on it).
- `.claude/agents/gsr-editorial.md` — the editorial/voice agent definition.
- `docs/decisions/` — the ADRs; the decision record of record (esp. 0012 Supabase backend).
- `docs/runbooks/stage-7-episode-test.md` — the live episode-test runbook (the real Stage 7 milestone).
- `docs/2026-06-08-basecamp-dashboard-integration.md` — the Basecamp two-way-sync data contract: which Basecamp data feeds each of the 4 role dashboards, and sync direction.
- `docs/2026-06-08-basecamp-build-spec-isaac-board-my-tasks.md` — build spec for the two new Basecamp surfaces (Isaac's GSR editing board + per-role My Tasks): data model, API ops, EARS acceptance, open decisions.
- `scripts/extract_email_voice.py` — the email-voice extraction script.
- `scripts/basecamp_token.py` — mints the Basecamp access token from the stored refresh token; the entry point for every Basecamp API read.

<!-- check:end -->

---

## Tier 2 — Regenerable or derived (do NOT need to carry)

Listed so it is explicit these are *not* missing knowledge. The check does not
police these; rebuild them on demand.

- `apps/dashboard/src/lib/supabase/database.types.ts` — generated from the schema; regenerate with `generate_typescript_types`.
- `docs/_handoff/LANES.md` + `docs/_handoff/lanes.html` — generated from lanes.json by `tools/build_lanes.mjs`.
- `apps/dashboard/node_modules/` — reinstall with `npm install`.
- `docs/_handoff/gsr-automation-v2-course.html` — derived presentation of facts already in the handoff docs.
- `docs/GIT_CHEATSHEET.md` — convenience reference; reproducible from any git docs.
- The bulk of `apps/dashboard/src/app/**/*.tsx` UI — rebuildable from the canon + specs above.
- `docs/_handoff/2026-06-08-basecamp-map.md` — point-in-time read-only snapshot of the Basecamp account; re-pull anytime via `scripts/basecamp_token.py` + the API.

The coverage audit skips these deliberately-disposable files:

<!-- audit:ignore -->
- `docs/_handoff/*-preview.html` — derived HTML previews of the handoff docs.
- `*/.gitkeep` — empty directory placeholders.
- `docs/2026-06-08-basecamp-env-diagnosis.md` — point-in-time Basecamp credential fix verification record; not carry-forward canon.
- `docs/2026-06-08-basecamp-import-review-sheet.md` — transient decision aid for Daniel to pick Basecamp import elements; superseded once the integration doc is finalized.
- `docs/2026-06-08-monologue-cue-spec.md` — provisional monologue graphics-cue spec from the data export; superseded once validated against a real David sample.
- `docs/_handoff/LANES.md` — generated from lanes.json.
- `docs/_handoff/lanes.html` — generated from lanes.json.
- `docs/_handoff/sessions-snapshot.json` — point-in-time session inventory; re-snapshot anytime.
- `docs/_handoff/2026-06-11-video-research-queue.json` — mission run state; corpus outcomes live in the claim ledger.
- `docs/_handoff/2026-06-11-next-prompts.md` — staged prompts for the mission's follow-on sessions; consumed as they run.
- `docs/_handoff/research-queue.md` — superseded by the 2026-06-11 mission queue.
- `docs/_handoff/2026-06-07-build-optimization-report.md` — point-in-time optimization report.
- `docs/_handoff/2026-06-07-gsr-ui-strategy.md` — UI direction record; locked outcomes live in canon 9-9d and the course m13.
- `docs/_handoff/2026-06-07-gsr-ui-bakeoff-research.html` — derived research presentation.
- `docs/_handoff/2026-06-07-tool-suggestions-by-stage.md` — point-in-time tool survey; durable picks live in ADR-0013.
- `docs/_handoff/2026-06-08-s3-ep1-16-dataset.md` — episode data now imported into the live episodes table.
- `docs/_handoff/2026-06-08-segment-publishing-schedule.md` — schedule snapshot; the DB owns publish dates.
- `docs/_handoff/2026-06-08-session-changelog.md` — historical session log.
- `docs/_handoff/2026-06-08-easy-builds-chain.md` — superseded by the pipeline build plan.
- `docs/_handoff/2026-06-08-gsr-course-overview.html` — derived course overview.
- `docs/_handoff/2026-06-08-export-archaeology.md` — narrative of the export dig; decisions live in review-decisions + canon s13.
- `docs/_handoff/2026-06-09-discussion-queue.md` — items since resolved into canon s14 or the plan.
- `docs/_handoff/2026-06-09-build-task-1-schema-rename.md` — historical spec; the rename shipped 2026-06-12.
- `docs/_handoff/gsr-flight-worksheet.html` — the offline worksheet; answers live in canon s14.
- `docs/_handoff/guest-topic-brief-template.html` — reusable template, regenerable from the research repo's build script.
- `docs/_handoff/PRODUCER-JOURNAL.md` — raw exploratory brain-dump intake (producer-model lane parked 2026-06-13); the durable statements were promoted to canon (Tier 0).
- `docs/_handoff/2026-06-12-rant-to-model-method.md` — point-in-time enablement-method proposal (parked 2026-06-13; its superseded content lives in canon).
<!-- audit:end -->

---

## Companion repo: `gsr-blueprint` (staging workspace)

These live in the other repo, so this repo's check cannot see them. Carry them
too — verify by hand, or run the check from inside that repo if a copy is added there.

- `gsr-blueprint/CLAUDE.md` — the staging-workspace rules + established-facts pointer.
- `gsr-blueprint/docs/2026-06-03-gsr-handoff.md` — the original full project handoff (read-first there).
- `gsr-blueprint/docs/2026-06-03-gsr-system-blueprint.md` — the system blueprint.
- `gsr-blueprint/docs/2026-06-03-BUILD-HERE-return-checklist.md` — the return/orientation checklist.
