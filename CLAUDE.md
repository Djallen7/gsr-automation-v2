# CLAUDE.md — Working with Daniel Allen

## Identity

Daniel Allen is the sole producer at David Rives Ministries (DRM), where he writes, researches, and books for **The Genesis Science Report (GSR)** — a weekly creationist science TV show anchored by David Rives. DRM's broader platform includes **Creation in the 21st Century (C21C) on TBN**, a 24/7 Creation TV channel, a 100,000 sq ft facility, and **creationsuperstore.com**. Daniel is a non-developer building real production tooling alongside writing broadcast copy. He signs guest outreach as "Daniel Allen" on David Rives' behalf. He uses AI primarily for **guest research, lower thirds, script writing, and outreach automation** — in that order of volume.

## What to do

- **Be brief and audio-scannable.** Daniel is often in the car using voice-to-text. Lead with a short rationale (1–2 sentences), then deliver the output. Defer deep detail until he asks.
- **Just do it.** When he says "just do it," stop qualifying and execute. Over-confirmation frustrates him.
- **Self-direct.** He delegates broadly. Make confident recommendations with reasoning rather than asking him to choose between five options.
- **Plain English, no jargon.** Explain every technical decision in producer-friendly language. Numbered checklists work well.
- **Copy-pasteable commands only.** Never use placeholders like `/path/to/repo` — he will paste verbatim without reading. Fill in real values.
- **Honest risk assessment, not optimism.** Flag fragile automation, unverified claims, and credibility risks explicitly. He self-corrects toward pragmatism when given clear tradeoffs.
- **Search project knowledge and prior conversations before launching new research.** Confirm file accessibility explicitly before promising to build on existing docs.

## What he's building

- **Multi-stage GSR production pipeline**: research → scoring → booking → outreach → script prep, deployed via Apps Script. Each Claude Code prompt must be **self-contained with context baked in** (contact lists, guest-picking rules, show philosophy) — project files won't be available at runtime.
- **Voice DNA extraction system for David Rives**: Claude Skills that extract abstract voice markers from authenticated David scripts (some corpus may be team-written or AI-drafted — apply authenticity filtering first). Keep raw samples *out* of the generation context; use the extracted markers only. Ground all authorship claims in textual evidence.
- **Outreach tool for Christian broadcast TV stations**: static-HTML + localStorage, no backend. Visually clean, ministry-branded (not technical-looking). Ministry-appropriate tone, never corporate or salesy. Don't name specific partner stations — reference broader partnerships.
- **Rundown Creator (RC) API integration**: source of truth for the show. Use direct API (APIKey + APIToken), not Drive exports or MCP. Two-pass finishing workflow: **Pass 1 = graphics transfer** (monologues: graphics list only; ministry reports: graphics + last line before next cue trigger). **Pass 2 = timer population.** Always use **column IDs, not column names** as field keys — writes silently fail otherwise. Save scripts with `isPlainText=false` and `\n\n` paragraph breaks. Avoid `rc_list_*` endpoints (they time out); use `rc_get_rows` with known RundownIDs.
- **Lower thirds variation system**: 3-column Primary/Var 1/Var 2 tied to specific segments. Supabase storage expects **flat JSON arrays, not nested wrappers**.
- **Single growing Google Doc** for email logs with bold H1/H2 headers. Save to **My Drive root** — GSR Shared Folder (owned by davidrives.com) blocks API writes. For Drive ops, use **Composio's `GOOGLEDRIVE_MOVE_FILE`/`TRASH_FILE`** directly (skip Anthropic's Drive MCP); expect large folder moves to time out.

## Locked references

**Hook framework (check the hook guide BEFORE drafting, not after):**
> Universal Anchor → Disruption → Stakes → Guest

Establish something the audience already owns before any fact, jargon, or name. Second-person ("You've smelled it…") beats declarative openers. The opening sentence follows directly after **"Welcome back to The Genesis Science Report"** and must carry immediate substantive weight.

**Episode titles**: ~30% shorter than natural length. Always. Don't make him remind you.

<<<<<<< HEAD
<<<<<<< HEAD
## Project Stack (current as of 2026-05-27)

- **Backend:** Supabase — Postgres + Realtime + Storage + Auth + Edge Functions
- **Frontend:** Next.js **16.2.6** + React **19.2.4** + shadcn/ui (`shadcn@4`)
- **AI:** Anthropic SDK **0.98.0** (Claude API), called from Edge Functions or server actions only — never from the client.
- **Active app:** `apps/dashboard/` (the `hub-ui/` location in older docs is the wireframes folder, not the runtime app).
- **Architecture decision of record:** ADR-0012 (Supabase pivot, accepted 2026-05-23). ADRs 0001 and 0011 are sunk-cost / historical.

## Next.js 16 caveat (read this before writing route handlers, server actions, or App Router code)

This is **not** the Next.js your training data knows. See `apps/dashboard/AGENTS.md`. Read `apps/dashboard/node_modules/next/dist/docs/` for the relevant guide before writing code. Heed deprecation notices in the build output.

## Conventions

- `snake_case` for tables and columns; PKs are `bigint generated always as identity` unless documented otherwise.
- **RLS enabled on every table** before any policy is written. Service role used only in Edge Functions, never in client code.
- Schema changes go through Supabase migrations (`apply_migration` via MCP, or the CLI). Never `execute_sql` for DDL.
- After every schema change: regenerate TS types, run advisors, commit together.
- Atomic state mutations (graphics approval, etc.) go through SQL RPC, not read-modify-write from a route handler.

## Feature 1 — Jakob lower-thirds approval workflow

Active build. Stages 2–6.5 merged (PRs #7 through #13). Do **not** propose Phase 2+ features until Feature 1 ships through one full real-episode cycle. Canonical plan: `docs/PROJECT_PLAN.md`.

## Off-limits to automation (non-negotiable)

- **ProPresenter production machine** (GSN-PropRes, Tailscale 100.98.215.7) — covered by "The David rule" above.
- **ATEM, Bitfocus Companion** — production hardware.
- **QNAP write access** — read-only SMB only; admin doesn't exist.
- **Notion workspace** — wiki-only after ADR-0012; do not extend the pre-pivot `scripts/notion_*.py` code.

## Context

Read `docs/MASTER_CONTEXT.md` at the start of any session to get full project context.
Read `docs/SESSION_HANDOFF.md` for where things left off.
Custom Claude Code subagents (gsr-editorial, gsr-pipeline, gsr-supabase) live in `~/.claude/agents/` — invoke via the Agent tool.

<!-- headroom:learn:start -->
## Headroom Learned Patterns
*Auto-generated by `headroom learn` on 2026-05-26 — do not edit manually*

### Skills Installation
*~3,000 tokens/session saved*
- The `npx skills add <pkg>` command requires `skills@latest` (not bare `skills`) — use `npx -y skills@latest add <pkg>` from a directory that is NOT a Node project, or pass `--global`.
- Running `npx skills` from this repo root fails with ENOENT (no package.json). Either `cd ~` first or use `--global` flag.

<!-- headroom:learn:end -->
=======
---
=======
**Lower thirds (GSR standard)**:
- 15 per segment, ALL CAPS, no commas, no em dashes, **60–65 characters**
- L3 #1 = newsy hook from the intro (not a show preview)
- L3 #2 = evergreen standalone headline (triggerable anywhere in monologue)
- L3s #3–15 progressively advance the monologue argument
- Guest chyron uses pipes: `DR. MICHAEL HOUTS | NASA | SPACE NUCLEAR PROPULSION`
- Tone: punchy cable-news, biblical worldview

**Script format**:
- Teleprompter-style: short sentences, ellipsis-paced, loose paragraphs
- `DAVID QUESTION #N` / `GRAPHIC N` / `ANDREW ANSWER #N` production cues
- Fox News cadence: short declarative, present tense, direct address, contractions, no stacked adjective fragments
- **"Thanks, David!"** opens guest segments; **creationsuperstore.com** CTA is the **final line** of any closer
- **Roll cue**: `Let's take a look, right now`
- THD tosses: up to 6 sentences, smooth gear-shift pivots
- GSM tosses: at least 3 sentences, name the segment, angle differs from THD
- Ministry reports: same newsy plainspoken tone as monologue (not pastoral); lead with people/outcomes, not the ministry's own actions
- All copy must work as **standalone spoken audio** — no fragment hooks, no graphic-dependent teases
- Intros: narrative tension, not info delivery. Vary sentence rhythm from draft 1 — flag your own repetitive short-sentence (≤5 word) patterns before delivering.

**Guest workflow**:
- Two-step approval: pitch slug-line + hook first → deep research only after approval
- Cross-reference recent airings before pitching returning guests (e.g., Tommy Lohman has covered Behemoth, soft tissue/collagen — don't retread)
- Anchor talking points to Daniel's **exact pitch email language**, not independent angle generation
- Standard workflow: propose interview topics/bullets for approval, then no separate talking points or questionnaire forms needed
- Outreach emails: short, direct, lead with science hook, one-line show credentials, specific filming dates, 48-hour response request. **No em-dashes. No fact-dump openers. Casual producer voice — not academic.**
>>>>>>> e4d36ca (Add archaeology output artifacts)

**Source documents**: verbatim only — emails, spreadsheets, Apple Notes. **No AI-generated summaries or scripts.** Cross-reference interview times against Apple Notes monthly schedule before defaulting to TBD.

<<<<<<< HEAD
**Active app:** `apps/dashboard` — Next.js 16, shadcn/ui, Supabase SSR, deployed on Vercel
**Supabase project:** `lafkbxypmciopebentxp`
**Active feature:** Feature 1 — Episode Graphics & Asset Tracker
**Current stage:** Stage 7 (real episode test) — all code complete, awaiting first real episode run
=======
**Scripts (GSR teleprompter format)**: short in-studio hook intro (2–3 paragraphs), brief credentialed guest intro (check remote vs. in-studio first), **numbered questions only — no pre-written answers**, parenthetical thank-you, David's scriptural reflection, resource mention. B-roll cues: generic and reusable; named subjects/specific footage require real source URLs.
>>>>>>> e4d36ca (Add archaeology output artifacts)

**Rundown Creator defaults**: Monologue intros = `Title Graphic` type, `Not Started` status (only `Created` for PM-prefixed items), assign Isaac to monologue rows, skip reuse graphics, only modify text inside `<gfx...>` tags when editing cue names.

**Mac/dev environment**: Homebrew Python blocks pip3 system-wide. Always `python3 -m venv .venv && source .venv/bin/activate` first. Use `nano` over heredocs — terminal paste truncation breaks heredocs.

## Common pitfalls when helping Daniel

- **Don't suggest recently-aired guests.** You don't have reliable airing data — ask, don't guess.
- **Don't lead with facts in intros.** Universal Anchor first. He will reject fact-first hooks.
- **Don't write three-short-beats rhetorical patterns** or repeat sentence structures across segments. He catches stylistic tics fast.
- **Don't put creationsuperstore.com mid-paragraph.** It ends the closer.
- **Don't write lower thirds as general topic labels.** Each must map to a specific discussion point.
- **Don't use insincere praise** in segment transitions ("What a powerful interview…"). Functional two-sentence tosses only.
- **Don't apply Christian framing to non-Christian guests** in their segments — let David apply it in his sign-off.
- **Don't pitch interview topics to recurring guests without checking past coverage.**
- **Don't fabricate creationsuperstore.com products.** If a guest's book isn't there, say so and offer a website plug instead.
- **Don't include unverified guest credentials** without flagging them. Distinguish what the guest said themselves vs. secondary summaries.
- **Don't reference template files by name when reliability matters** — paste template text directly into the prompt.
- **Don't workshop solutions when prepping him for boss conversations.** Lead by extracting boss's vision/priorities. His boss sets WHAT; Daniel executes HOW.
- **Don't ignore his solo-producer bandwidth** when scoping projects or partnerships.
- **Don't inflate self-scoring rubrics** to force convergence. He'll adjust criteria; you maintain honesty.
- **Don't over-explain before producing copy.** Long visible reasoning frustrates him under deadline.

<<<<<<< HEAD
## Development Conventions

**Branching**
- All feature work on a new branch off `main`
- Branch names: `feat/short-description`, `chore/short-description`, `fix/short-description`
- Never push directly to `main`
- Always create a draft PR immediately after first push

**Merging**
- Use squash merge to keep main history clean
- PR title becomes the commit message — make it descriptive

**Migrations**
- One concern per migration file
- Filename format: `YYYYMMDDHHMMSS_snake_case_description.sql`
- All DDL statements must be idempotent (`IF NOT EXISTS`, `OR REPLACE`, etc.)
- After applying a migration remotely, verify with `list_migrations`

**TypeScript**
- Run `cd apps/dashboard && npx tsc --noEmit` before committing any dashboard changes
- Run `npx eslint src/` to check for lint errors
- Both must be clean before a PR is opened

**When you add a new page or API route**
- Add it to the Routes section of `BUILD_STATUS.html`
- Update `LAST_UPDATED` in `BUILD_STATUS.html`

**When you complete a stage or planned item**
- Update the status badge in `BUILD_STATUS.html`
- Update `LAST_UPDATED`

**When you apply a migration**
- Add it to the Migrations section of `BUILD_STATUS.html`

---

## Session Orientation

At the start of any session:
1. Run `git status` and `git log --oneline -5` to see current state
2. Run `git fetch origin main && git log --oneline origin/main -3` to check if main has moved
3. Check for open PRs if continuing existing work
4. Read `BUILD_STATUS.html` for a visual overview of what's built

Read `docs/SESSION_HANDOFF.md` for historical context if needed (note: may be outdated — BUILD_STATUS.html is more current).

---

## Context

- Daniel Allen is the project owner and a non-developer. He uses Claude Code for all building.
- Show: Genesis Science Report (GSR), Christian creation-science TV, ~58 min, weekly, Season 3
- Team: Daniel + Miryam (core producers), ~7-8 crew on shoot days
- David Rives is the on-screen talent and ministry director — don't break anything that affects him
>>>>>>> 6773d02 (chore: tooling improvements — Playwright MCP, TS pre-commit hook, CLAUDE.md update)
=======
## Default to

When in doubt:

1. **Search project knowledge first.** Confirm what exists before generating new.
2. **One short rationale, then the output.** No repeated confirmation requests.
3. **Shorter, more conversational, more specific.** Cut adjectives, cut hedges, cut em-dashes.
4. **Apply locked references automatically** (30% titles, hook framework, 60–65 char L3s, CTA placement) without being reminded.
5. **Flag credibility risks loudly** — unverified claims, fabricated products, shaky authorship inferences. He'd rather catch it now than on-air.
6. **Deliver under deadline pressure.** If a shoot date is imminent, pivot from planning to usable script copy immediately.
7. **Recommend, don't poll.** Trust your judgment on organizational calls when he's given you that trust.
>>>>>>> e4d36ca (Add archaeology output artifacts)
