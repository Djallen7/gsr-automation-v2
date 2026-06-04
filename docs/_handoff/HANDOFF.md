# GSR Automation v2 - Crash Course + Build Plan: HANDOFF

**Purpose of this file:** let a different Claude session (or a new contractor) pick up exactly where this left off, with zero prior context. Read this top to bottom; it is self-contained.

---

## 1. What was built

A single self-contained interactive HTML artifact: **`gsr-automation-v2-course.html`**. It is two things at once:

1. **An ADHD-friendly crash course** that teaches Daniel Allen (TV producer, non-developer who directs AI coding tools) the actual tech stack behind GSR Automation v2, scoped tight, with analogies and quizzes.
2. **A single-source-of-truth build planner.** As Daniel works each module he (a) records how he thinks the step should work, (b) learns the concept, and (c) locks a decision. He then exports a **Build Plan (Markdown)** that an AI agent runs against the existing `gsr-automation-v2` repo so the build does not start from scratch.

The artifact runs entirely in the browser (no server, no API calls). Progress saves to localStorage with an in-memory fallback. Buttons: Export Build Plan, Export JSON, Import, Reset, plus a per-module "Ask the Consultant" that copies a context-loaded prompt to the clipboard for Daniel to paste into a Claude chat.

---

## 2. Structure (locked, do not redesign without asking Daniel)

- **Pipeline order, 12 modules + a Finale.** Order: 0 Ground rules -> 1 Triggers/webhooks -> 2 Guest DB -> 3 Outreach -> 4 Script & voice -> 5 Validation (Zod) -> 6 Graphics/lower-thirds -> 7 Rundown intake -> 8 ProPresenter -> 9 Transcription -> 10 Dashboard & approval -> 11 Distribution -> Finale.
- **Each module has three sub-tabs:** (1) Blueprint intake (interactive, FIRST, captures Daniel's intent before teaching), (2) Learn + quiz, (3) Decide (the decision becomes a build record/ADR in the export).
- **"Ask the Consultant"** is a clipboard prompt bundler only (no live API). It assembles the module + intake answers + locked decision + the David Rule into a prompt Daniel pastes into his own Claude chat.

---

## 3. Who Daniel is (learner profile)

TV producer at David Rives Ministries, runs the Genesis Science Report. Non-developer, GUI-first, ADHD (burns out on irrelevant or unengaging content). He directs Claude Code / Claude.ai rather than hand-coding; the goal is enough understanding to direct, debug, and supervise AI. **Hard style preferences honored throughout: NO em dashes anywhere in copy; concise; analogies are not restricted to production concepts.**

---

## 4. The system being built (GSR Automation v2)

**Architecture of record (Era 3, accepted 2026-05-23):** a real app = Next.js 16 (App Router) + React + TypeScript + shadcn/ui + Tailwind v4, Supabase (hosted Postgres + Auth + Storage + RLS + Edge Functions), deployed on Vercel; Claude API via `@anthropic-ai/sdk` (model `claude-opus-4-7`); Python for email tooling; 1Password CLI for secrets; Git/GitHub.

**Live Supabase project `lafkbxypmciopebentxp`:** 20 tables, 45 migrations, 2 enums, 2 views, 3 functions, 3 triggers, 1 storage bucket (`lower-thirds`). episodes = 48 rows, guests = 175 rows, **graphics = 0 rows** (no live import has run yet; an operational milestone, not a defect).

**Real routes/contracts:** `/import`, `/lower-thirds`, `/approved`, `/upload`; API `/api/import` (Zod, dry-run "type YES"), `/api/extract-lower-thirds` (Claude, returns a payload, no DB write, model from `ANTHROPIC_REGENERATE_MODEL` default `claude-opus-4-7`, max_tokens 4096), `/api/regenerate` (3 variations), `/api/scripts` (upsert per episode+segment, fires `on_script_save` -> `notify_script_extract()` -> `extract-on-script-save` Edge Function), `/api/rc-explore` and `/api/rc-import` (Rundown Creator passthrough; maps 10 RC segment names -> 12-value internal enum; fixes Latin-1 -> UTF-8 mojibake).

**Production pipeline today:** script (Claude Desktop / Rundown Creator) -> extract lower thirds -> import (Zod, dry-run) -> review at /lower-thirds (approve/reject/regenerate) -> /approved + /lower-thirds/ready -> **copy text into ProPresenter BY HAND**. Distribution half (Dropbox master -> transcript -> metadata -> platforms) is largely future.

---

## 5. Decisions baked into the course (the "consultant verdicts")

These are the recommended options the artifact presents. They are defaults, not dogma; Daniel can pick otherwise per module.

- **M0 Ground rules:** branches + draft PRs + squash merge; build **directly in `gsr-automation-v2`** (see section 7).
- **M1 Triggers:** Dropbox folder-watch -> Supabase Edge Function webhook (+ audio companion ~30MB), cursor-poll fallback. Make.com/n8n only for the later RSS research sweep.
- **M2 Guest DB:** no-repeat via a status field + filtering query; normalize the guest sheet into the table.
- **M3 Outreach:** AI drafts, human sends; DNC stays a manual marked field; re-run the Dovecot smoke test live.
- **M4 Script & voice:** parse the fenced `===LOWER-THIRDS===` block deterministically (15 per ep); voice = a Skill with a short guide + 3-6 exemplars + do-not rules + Vale (NOT an "antislop" framing; see section 6). Chyron `NAME | ORG | FIELD`, truncate 62 + ellipsis over 65.
- **M5 Validation:** Zod safeParse, flag failures for human; keep the dry-run "type YES"; use the SDK `zodOutputFormat` helper.
- **M6 Graphics:** the table is `graphics` (the bucket is `lower-thirds`); keep 3 regenerate variations + the chyron rule, reviewed before approve. **There is no `lower_thirds` table - it is a documented phantom (see section 6).**
- **M7 Rundown:** intake via rc-explore/rc-import; **always read the JSON body because Rundown Creator returns errors as HTTP 200**; Season-3 IDs 79/81/83/82/84.
- **M8 ProPresenter:** manual copy today; if automated, Bitfocus Companion + pre-built Props triggered by ID, read-only/test-only until David approves. The machine (GSN-PropRes, Tailscale 100.98.215.7), ATEM, Companion are off-limits to automation.
- **M9 Transcription:** local Whisper via fswatch + ffmpeg at `~/Productions`, OpenAI Whisper API fallback (~$0.36/hr); add WhisperKit + SpeakerKit for speaker labels.
- **M10 Dashboard:** App Router + `@supabase/ssr` + RLS on every table + magic-link auth. Correct AI off Pages Router and the deprecated `@supabase/auth-helpers-nextjs` every session.
- **M11 Distribution:** YouTube auto (videos.insert), Rumble via YouTube channel sync, Fireside + GSN as manual handoff cards. Do NOT browser-automate Fireside. Pin youtubeuploader v1.25.5.

---

## 6. Fact-accuracy notes (verified June 4, 2026; see VERIFIED-FACTS.md)

- **YouTube** upload quota dropped from ~1,600 to ~100 units on Dec 4, 2025 (~100 uploads/day). Confirmed.
- **WhisperKit** v1.0.0 (May 2026); repo renamed to `argmax-oss-swift`; bundles SpeakerKit. Its 2.2% WER is a **vendor benchmark** (independent leaderboards show higher) - frame it that way.
- **"Skills 2.0"** is journalistic shorthand; cite "the skill-creator update of March 2026," not an official version string.
- **"Antislop" is NOT an Anthropic concept.** Ground voice curation in general few-shot guidance + the Vale linter, never in a fabricated Anthropic finding.
- **Fireside.fm** has a read-only metrics API only (no publish API). Transistor.fm / Buzzsprout have publish APIs if podcast automation is ever wanted.
- **The `lower_thirds` table is a phantom.** The first migration's filename says "lower thirds" but its body creates `graphics`; every query uses `graphics`. Fix is documentation, not code.

---

## 7. Important active decision: repo target

The older planning docs said "stage all new files in `gsr-blueprint` until a deliberate migration." **Daniel has now directed that the course and build plan target `gsr-automation-v2` directly.** Treat that as the active decision. The whole artifact and the exported build plan point at `gsr-automation-v2`. Do not route new work into `gsr-blueprint`.

---

## 8. Off-limits (the David Rule)

Automation talks to cloud APIs only. Never write to: the live broadcast chain, the ProPresenter machine (GSN-PropRes, Tailscale 100.98.215.7), the QNAP NAS (read-only SMB; admin revoked per ADR-0011), ATEM, or Bitfocus Companion. Production pulls from the database on its own schedule.

---

## 9. How to continue this work

- **To edit the artifact:** it is one HTML file. Module content lives in the `const M=[...]` array (each module: `blueprint`, `lesson`, `analogy`, `facts`, `quiz`, `decision`, `repo`, `tell`). The engine is below it. Keep NO em dashes in copy. Validate with `node --check` on the extracted `<script>` before shipping.
- **To extend the build:** open the artifact, lock decisions, Export Build Plan, then run it in Claude Code against `gsr-automation-v2`.
- **Cross-cutting next moves:** clear the Google API audit for YouTube early (only Daniel can; uploads stay private until approved); normalize the guest sheet; re-run the Dovecot smoke test live; reconcile ADR-0012 text (says Next.js 15) with the live 16.2; run the first real-episode import (graphics = 0); resolve the lower_thirds phantom; supply the `gsr-interview-segment` skill output + one sample script (Stage 1 blocker).

---

## 10. Files in this bundle

See CONTEXT-README.md.
