# GSR Parser — Five-Day Plan + Day-1 Prompt (2026-06-14 → 2026-06-18)

**The one job this week:** make the script + lower-thirds **ingestion (parser)** trustworthy
enough that Daniel can paste a script and get correct rows in `production_lower_thirds` on the
first try, with no hand-correction. Everything here finishes that spine before anything else.
The proactive "brain" (email-watching, guest-status anticipation, nudges) is explicitly **out of
scope** this week — it is months of supervised work and starts no earlier than build-plan slice 6.4.

Built from a five-agent deep read (branch archaeology, pipeline state, repo inventory, repo-health
audit, parser code-correctness) plus live read-only DB verification on 2026-06-14. Sources of record:
`2026-06-11-pipeline-build-plan.md` (slices), `GSR-WORKFLOW-CANON.md` (rules), the
`2026-06-04-CONFLICT-REGISTER.md` §6 (verified state + code-health), and `2026-06-14-repo-inventory.md`
(read-order + branch map).

---

## 0. Three decisions needed from Daniel before Day 2 (one-tap, each with a recommendation)

1. **Destination correction.** Last night's note said the parser populates "the tracker AND Rundown
   Creator." Canon s0/s9c is firm: **lower thirds never go to Rundown Creator — only graphics do.**
   *Recommendation:* parser writes `production_lower_thirds` only; Rundown Creator stays a separate,
   later graphics path. If your workflow has changed, say so and canon gets updated (your word wins).

2. **Clean the test data?** The live DB holds a labeled test episode (season 99, "TEST - Pipeline Demo,
   safe to delete") with 10 `pending_review` rows from a prior session. *Recommendation:* delete that
   episode + its rows before the first real import, so the "first real rows landed" milestone is clean
   and the stray row can't collide with `/api/import`'s upsert on `(season, episode_number)`. (Deletion
   is a live write; it waits for your yes.)

3. **Which two un-merged branches to combine.** The freshest base, `claude/vigilant-ramanujan-kt4fdc`
   (0 behind main), has the episode-workspace UI and canon s19. The var_1/var_2-preservation fix and the
   safer pre-drop migration live only on `fix/lt-merge-blockers`. They also disagree on the character
   limit (soft-warn-over-65/ceiling-70 vs hard-block-over-70). *Recommendation:* base the week on
   `vigilant-ramanujan`, cherry-pick the var-preservation from `lt-merge-blockers`, and use the canon-s13
   character rule (sweet spot 60-65, soft warn 66-70, hard block over 70).

---

## 1. The reality the plan is built on (verified, not assumed)

- **The deterministic parser Daniel described does not exist yet.** Both extraction engines
  (`api/extract-lower-thirds/route.ts`, `functions/extract-on-script-save/index.ts`) *generate* lower
  thirds from prose. Neither *separates* a pasted script from a listed lower-thirds block. So this week
  builds a new capability, it does not just tune an existing one (Conflict Register CH-05).
- **No test corpus is in the repo.** Real scripts with aired lower thirds live in Google Drive / Basecamp
  (need Daniel's logins). The verbatim aired answer key (13 chyrons, monologue beats, the 5 interview
  patterns) is inside `docs/LOWER_THIRDS_STYLE_GUIDE.md`. The named real example is **S03 Ep022 Interview 1
  Tim Clarey**, Drive doc `17N9JfyN3P3CKGqB7llgNGWa8UNiv6xwpJ2MPrTBgmcE`.
- **The Type-YES import gate is solid** (`import-mode.ts` + `import/route.ts`: no write without
  `confirm==='YES'`). Leave it alone. The weak spots are the *write paths that bypass it* (upload-form,
  RC import) — see the fix-first list.
- **Live counts:** 10 test rows (season-99), 49 episodes (1 is the test row), 50 migrations.

---

## 2. The five-day sequence (chronological; finish each before the next; no feature-hopping)

**Guardrails every day:** work on a `feat/` branch off the chosen base, draft PR; `npx tsc --noEmit`
and `npx eslint src/` clean before reporting; **no live `/api/import` without a dry-run + Daniel's
Type-YES**; test against fixtures/mock content first, then one real doc; token leash — deterministic
work is $0, cap AI-extraction validation at a handful of calls. **Leash rule:** if a day's primary task
blocks, drop to that day's named fallback rather than skipping ahead, so a blocked night still ships
something whole.

### Day 1 (Sat Jun 14) — Stop the quiet bleeders + build the test harness. W1 F1 ~$0
The two live breakages sit on the exact screens the parser needs, and both fail *silently*:
- **CH-01:** fix `/api/regenerate` → `review-grid.tsx` response-shape mismatch (read `data.variations[0]`).
- **CH-02:** add the missing `page.tsx` server wrapper for `/lower-thirds/[episode_id]` so the linked
  workspace stops 404-ing (or remove the link). 
- Build the **test fixture set + harness:** 4-6 canon-shaped combined files (script body + a `LOWER THIRDS`
  block) whose expected output is the style guide's verbatim aired lines, plus deliberate format-variation
  cases (numbered vs `L3:` vs `LOWER THIRD:`, em dashes to strip, over-70 lines, missing beat numbers).
- **Done when:** regenerate renders variations again; the episode workspace loads; fixtures + expected-output
  JSON committed; tsc/eslint clean; draft PR open.
- **If blocked:** expand the fixture set + answer keys. Never idle.

### Day 2 (Sun Jun 15) — The deterministic level-1 parser (new build-plan item 1.0b). W2 F2 ~$0
*(Ming Wang films today; this is a pure code day, no Daniel ask needed.)*
- Build the **separator**: given one combined file, find the `LOWER THIRDS` header (case-insensitive), split
  it from the script body, parse each line to a row — strip numbered prefixes and `L3:`/`LOWER THIRD:`/
  `GRAPHIC:`/`TOPIC L3`/`GUEST CHYRON`/`DISCUSSION L3` labels, map labels → `l3_type`, assign **contiguous**
  `beat_number` (never restart on type change), detect the `NAME | ORG | FIELD` chyron, emit the `/api/import`
  payload. **No AI call.**
- **Done when:** it runs against all Day-1 fixtures and output matches the answer keys exactly (every beat,
  type, verbatim text), and the format-variation cases parse identically. Pure function, unit-tested like
  `import-mode.ts` (a `scripts/test-*.mjs`). tsc/eslint clean.
- **If blocked** (a fixture won't parse): log the exact failing line shape, handle it, add it as a regression
  case. Durability to variation IS the deliverable.

### Day 3 (Mon Jun 16) — Validate against ONE real script + wire the quality checks. W2 F2 ~$0
- 30-second ask: Daniel pastes the Tim Clarey Ep022 doc (or confirms Drive MCP read). Run the Day-2 parser on
  it; compare to the style guide's verbatim chyrons/LTs.
- Build-plan **item 1.7 / P7:** wire the 5 quality checks (length band 55-70 / over-70, banned chars, ALL CAPS,
  pipe-vs-colon, end punctuation) as **soft warnings** in the parse output — never hard blocks (so an exception
  never forces a tape-day workaround). This also fixes the stale "55-65" prompt text (CH-07 / register M-02).
- **Done when:** the real Tim Clarey block parses to correct rows on the first try, zero hand-correction;
  warnings render on seeded-bad rows and block nothing. tsc/eslint clean.
- **If blocked** (Daniel unavailable / Drive unreadable): validate against the style guide's verbatim sets as
  the answer key, flag the real-doc check as the one outstanding item, proceed. Do not stall.

### Day 4 (Tue Jun 17) — First REAL Type-YES import + the three-column review view. W2 F2 ~$0.10-0.30
- (If Daniel said yes to decision 2: first delete the season-99 test episode so the milestone is clean.)
- Build-plan **item 1.4:** take one parsed real episode, dry-run `/api/import`, show the episode/graphic/rejected
  counts, get Type-YES, land rows. Then **item 1.6:** the Primary | Var1 | Var2 comparison view renders them.
- **Done when:** real rows land via the gate (the true Stage-7 milestone), counts were shown before the live run,
  the review grid renders on desktop + mobile, screenshot captured.
- **If blocked** (Daniel can't type YES): stop at the dry-run, capture the counts + a screenshot, hand him a
  one-tap "type YES to land these N rows" card. The import never proceeds without him — that is the guardrail,
  not a failure.

### Day 5 (Wed Jun 18) — Length-band reconcile + level-2 drafter on the spine + close-out. W1-2 F2 ~$0.05-0.15
- Build-plan **item 1.2:** reconcile the character validator AND both extraction prompts to the canon 55-70 band.
- Stand up **level-2 positional drafting** as the AI path layered ON the deterministic spine: when a script has
  NO lower-thirds block, the AI generator drafts 3 variations per beat following positional rules (15 monologue,
  2+15 interview), honoring the corrected length band, routed through the same dry-run + Type-YES gate.
- **Done when:** validator shows amber under 55 / green 60-65 / amber 66-70 / red over 70; the level-2 drafter
  produces canon-count, canon-length output on a fixture; everything flows through one gate; `LANES.md` Lane 10
  updated; PR ready for review.
- **If blocked:** ship the validator reconcile (the safe deterministic part) and document the level-2 drafter as
  next week's first task. No loose ends in the parser itself.

**Boundary marker:** the week ends with a trustworthy deterministic parser (level 1), a gated AI drafter
(level 2), real rows in the DB, and a review surface. The "brain," the 16-episode data migration, and
guest-entry-on-confirmation are NOT parser work and stay parked unless the parser finishes early.

---

## 3. Fix-first code-health list (the order to clear them)

1. **CH-01** regenerate→review-grid shape (blocker, Day 1) · 2. **CH-02** `[episode_id]` 404 (blocker, Day 1)
· 3. **CH-05** build the extract-from-doc parser (the feature, Day 2) · 4. **CH-08 + l3_type validation**
contiguous beats + positional types + enum check surfaced in the dry-run (Day 2-3) · 5. **CH-07** real length +
chyron enforcement, kill the `...` truncation (Day 3) · 6. **CH-04** DB unique key on
`(episode_id, segment, beat_number)` + upsert (Day 4) · 7. **CH-06 / CH-03** harden RC ingestion (read the body)
and close the upload-form gate bypass (as they touch each day's surface). Full detail + file:line in
`2026-06-04-CONFLICT-REGISTER.md` §6.2.

---

## 4. Essential files for the Day-1 session (token-efficient, ordered)

Main is too large to load whole. For parser work, read only these:
1. `CLAUDE.md` — rules. 2. `apps/dashboard/AGENTS.md` — Next.js 16 caveats (mandatory before route code).
3. `apps/dashboard/src/lib/segments.ts` — 12-value enum. 4. `apps/dashboard/src/lib/import-mode.ts` — the gate.
5. `apps/dashboard/src/app/api/import/route.ts` — the payload contract. 6. `apps/dashboard/src/app/api/extract-lower-thirds/route.ts` — the generator.
7. `supabase/migrations/20260609115904_rename_graphics_to_production_lower_thirds.sql` — live LT schema.
8. `docs/LOWER_THIRDS_STYLE_GUIDE.md` §§1-4, 5.6, 6, 10 — format rules + verbatim answer key.
9. `docs/_handoff/GSR-WORKFLOW-CANON.md` §§0, 1, 13, 14, 15-gates — two-systems rule, deterministic-parse
   contract + the Tim Clarey doc format, the 55-70 band, the gate.
10. `docs/_handoff/2026-06-14-five-day-plan.md` (this file) + `2026-06-04-CONFLICT-REGISTER.md` §6.
Plus, from the branch map, read `fix/lt-merge-blockers` (var-preservation + safer migration) and
`claude/vigilant-ramanujan-kt4fdc` (episode workspace) before building. **Skip:** the basecamp-map, the
transcript-pull-kit, SYSTEM-EVOLUTION (background only).

---

## 5. Day-1 ready-to-paste prompt

> Copy this into a fresh Claude Code session tomorrow. It assumes the decisions in §0 are answered; if not, it
> asks for them first.

```
You are working on GSR Automation v2 (Next.js 16 App Router + Supabase + Anthropic SDK).
Read CLAUDE.md and apps/dashboard/AGENTS.md first, then the parser reading list in
docs/_handoff/2026-06-14-five-day-plan.md §4. This is DAY 1 of the five-day parser plan in
that file. Do not feature-hop: finish Day 1 before anything else.

Branch: create feat/parser-day1 off claude/vigilant-ramanujan-kt4fdc (the chosen base).
Draft PR after the first push. tsc --noEmit and eslint src/ must be clean before you report.

Confirm these three from Daniel before any build (one-tap, each with your recommendation):
  1. Lower thirds populate production_lower_thirds only, NOT Rundown Creator (canon s0/s9c). Confirm.
  2. OK to delete the season-99 "TEST - Pipeline Demo" episode + its 10 rows before the real import? (live write, needs yes)
  3. Base on vigilant-ramanujan + cherry-pick var-preservation from fix/lt-merge-blockers, canon-s13 char rule. Confirm.

Day 1 tasks, in order:
  A. Fix /api/regenerate -> lower-thirds/review-grid.tsx response-shape mismatch (CH-01): the route
     returns { variations: [{text, variationNumber}] }; the grid reads data.text/data.variationNumber.
     Make the grid read data.variations[0] (or render all three). Verify the regenerate button works.
  B. Add the missing server page.tsx for /lower-thirds/[episode_id] that loads the episode + scripts +
     graphics and renders <EpisodeWorkspace> (CH-02), so the link from lower-thirds/page.tsx stops 404-ing.
  C. Build the test harness: 4-6 canon-shaped combined files (script body + a "LOWER THIRDS" block) under
     a fixtures/ dir, each with an expected-output JSON keyed to the verbatim aired lines in
     docs/LOWER_THIRDS_STYLE_GUIDE.md. Include format-variation cases (numbered vs "L3:" vs "LOWER THIRD:",
     em dashes to strip, an over-70 line, a missing beat number). No parser yet — just the fixtures + a
     runner stub that will diff parser output against the answer keys on Day 2.

Do NOT: run a live /api/import without a dry-run + Daniel's typed YES; touch the season-99 test data
unless Daniel says yes; build the deterministic parser itself (that is Day 2); touch ProPresenter, QNAP,
Rundown Creator writes, or any production hardware. Report at the end: what works now, what is staged for
Day 2, and anything you need from Daniel.
```
