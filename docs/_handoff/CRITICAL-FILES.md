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
- `apps/dashboard/src/lib/text-only-sentinel.ts` — the text-only guard used by the extraction path.
- `apps/dashboard/src/app/api/import/route.ts` — the gated import logic (dry-run, conflict refusal); the heart of the David-rule import safety.
- `docs/decisions/` — the ADRs; the decision record of record (esp. 0012 Supabase backend).
- `docs/runbooks/stage-7-episode-test.md` — the live episode-test runbook (the real Stage 7 milestone).
- `scripts/extract_email_voice.py` — the email-voice extraction script.

<!-- check:end -->

---

## Tier 2 — Regenerable or derived (do NOT need to carry)

Listed so it is explicit these are *not* missing knowledge. The check does not
police these; rebuild them on demand.

- `apps/dashboard/src/lib/supabase/database.types.ts` — generated from the schema; regenerate with `generate_typescript_types`.
- `apps/dashboard/node_modules/` — reinstall with `npm install`.
- `docs/_handoff/gsr-automation-v2-course.html` — derived presentation of facts already in the handoff docs.
- `docs/GIT_CHEATSHEET.md` — convenience reference; reproducible from any git docs.
- The bulk of `apps/dashboard/src/app/**/*.tsx` UI — rebuildable from the canon + specs above.

The coverage audit skips these deliberately-disposable files:

<!-- audit:ignore -->
- `docs/_handoff/*-preview.html` — derived HTML previews of the handoff docs.
- `*/.gitkeep` — empty directory placeholders.
- `docs/2026-06-08-basecamp-env-diagnosis.md` — point-in-time Basecamp credential fix verification record; not carry-forward canon.
<!-- audit:end -->

---

## Companion repo: `gsr-blueprint` (staging workspace)

These live in the other repo, so this repo's check cannot see them. Carry them
too — verify by hand, or run the check from inside that repo if a copy is added there.

- `gsr-blueprint/CLAUDE.md` — the staging-workspace rules + established-facts pointer.
- `gsr-blueprint/docs/2026-06-03-gsr-handoff.md` — the original full project handoff (read-first there).
- `gsr-blueprint/docs/2026-06-03-gsr-system-blueprint.md` — the system blueprint.
- `gsr-blueprint/docs/2026-06-03-BUILD-HERE-return-checklist.md` — the return/orientation checklist.
