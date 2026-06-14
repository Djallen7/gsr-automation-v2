# Lower-Thirds Pipeline — 5-Day Plan + Day-1 Prompt (2026-06-14)

Execution scaffold for the 5-day deadline. Finishes **Slice 1** (the lower-thirds pipeline)
of `docs/_handoff/2026-06-11-pipeline-build-plan.md` before anything else. Grounded in a
read of the actual code, not the docs. One thread per day; each day has a "done when" bar
and a fallback so a blocked night still moves forward. Every gate stands (Type-YES import,
no production writes, David Rule).

---

## Current state — what's real (verified in code)

**Works:** the Type-YES gate is server-enforced and pure (`import-mode.ts`: no `confirm:"YES"`
= dry-run, always); the workspace route is wired and loads episode + scripts +
`production_lower_thirds` + variations; the in-workspace extract → dry-run → Type-YES
two-step is built correctly; the review card enforces the canon band and hard-blocks
Approve over 70; `/api/import` refuses duplicates (409 on existing segment+beat);
auto-extraction is held by default (`auto_extract_apply` = false), so a saved script writes
nothing until confirmed.

**Three findings worth your attention (the honest part):**

1. **The gate has never run for real.** The test rows (S99E001) were a direct database
   write that BYPASSED `/api/import`. So the gate is proven as a unit but never proven
   end-to-end. Doing one real gated import is the actual Stage-7 milestone, still open.
2. **There are two doors to the same room, and one is a dead end.** Path A (paste/save →
   Extract → dry-run → Type-YES) works in the workspace. Path B (save script → auto-extract
   holds a result → confirm it) has its confirm step (`/api/scripts/confirm-extraction`)
   wired ONLY to the separate `/extract` page — the workspace never surfaces or applies it,
   yet its RC panel says "lower-thirds auto-generating…". That mismatch is exactly the
   "three forward, two back" confusion to kill.
3. **A premise gap:** canon describes a *deterministic* parser of the LOWER THIRDS block in
   the script; what's built is an *AI extractor* that reads the whole script and generates
   chyrons. Also the extractor prompt still says "never over 65" while the band now allows
   70 (extractor is stricter than the validator — safe, but unreconciled).

**David Rule:** nothing here touches David or the broadcast chain; lower thirds land in a DB
for review. Safe to exercise for real this week, behind the gate + the conflict refusal.

---

## The 5-day plan

**Day 1 (Sat Jun 14) — One real episode, first live Type-YES import.**
Take ONE finished interview script (canon names S03 Ep022 Interview 1, Tim Clarey), use a
REAL episode row (not S99E001), paste in the workspace → save → Extract → dry-run → show
counts → type YES.
- DONE when: `production_lower_thirds` has rows for a REAL episode written THROUGH
  `/api/import` (not a direct insert), counts were shown first, and rows render with correct
  band colors.
- Fallback: if extraction 502s or no vetted script, hand-build a 3-row import JSON through
  `/import` (dry-run → Type-YES). Still proves the gate end-to-end.

**Day 2 (Sun Jun 15, filming day — keep light) — Make the extractor trustworthy.**
Reconcile the extraction prompt ceiling to 70 (target 60-65) so extractor and validator
agree; re-run on the Day-1 script; eyeball every row for banned-character/ALL-CAPS. Then
make the parser decision (deterministic block-parser vs AI extractor) and log it one line.
- DONE when: extractor yields a clean in-band set and the parser decision is written down.
- Fallback: do the prompt reconcile only; defer the quality verdict.

**Day 3 (Mon Jun 16) — One door to review.**
Pick the in-workspace manual flow as THE path. Either surface the held-extraction in the
workspace (show `pending_confirmation` with apply/discard) OR make it explicitly dormant and
fix the misleading "auto-generating…" copy. No dead buttons.
- DONE when: an episode shows exactly one obvious script→review path; choice noted in canon.
- Fallback: at minimum fix the RC-panel copy and confirm the flag is off.

**Day 4 (Tue Jun 17) — Prove regenerate + the 3-variation review on real rows.**
On a real pending row: Regenerate → confirm 3 stored variations → pick → adopt → primary
updates; confirm the Primary|Var1|Var2 comparison + "Use this" work; check the 20/hour rate
limit doesn't bite.
- DONE when: a real row goes original → 3 variations → adopt, all visible with correct bands.
- Fallback: exercise the comparison + "Use this" on the variations already stored from Day 1.

**Day 5 (Wed Jun 18) — End-to-end dry run + the demo + close the slice.**
Fresh real episode, full loop → approve a few → confirm they reach the Approved / Ready
view. `tsc` + `eslint` clean. Refresh the draft PR. Capture screenshots + a plain-English
"what you can now do" report.
- DONE when: one episode goes start→finish with no direct DB touch, checks clean, report written.
- Fallback: demo the Day-1 episode and file any late bug with a named fix date.

**Explicitly NOT this week:** Mission Control, transcript mining, RC write-back, the
deterministic block-parser build, Rumble cards, ProPresenter. Any of those now = the churn.

---

## Tonight's single highest-value action

Run one real episode's script through the workspace and execute the **first live Type-YES
import** (Day 1). It's the one thing the system has never actually done; doing it converts
the slice from "built" to "working." **Note:** this is a human-in-the-app step — it needs a
real script and your Type-YES in the browser, so it's yours (or a desktop/Mac session), not
something this cloud session can press for you.

## Open question — recommendation

**Tonight, test the extract → dry-run → Type-YES import path ONLY. Defer the
strip-and-regenerate (held auto-extraction) path.** Why: the auto-extract door is currently
a dead end in the workspace and its trigger→Edge-Function chain has four unverified links;
debugging that at night is the churn trap. The manual path produces the same rows in the
same table, so proving it tonight de-risks ~90% of what the auto path would. If the import
goes green early, do Day 4's regenerate-on-real-rows next, not the auto path.

---

## Ready-to-paste Day-1 prompt (fresh session, branch `claude/vigilant-ramanujan-kt4fdc`)

```
Read CLAUDE.md, docs/_handoff/GSR-WORKFLOW-CANON.md (the operating mandates + s0/s1),
docs/_handoff/2026-06-11-pipeline-build-plan.md Slice 1, and
docs/_handoff/2026-06-14-orientation/5-day-plan-and-day1-prompt.md (the plan of record for
this week).

Today = Slice 1.4, the Stage-7 milestone: take ONE real finished interview script (canon
suggests S03 Ep022 Interview 1, Tim Clarey), use a REAL episode row (not the S99E001 test),
paste it in /lower-thirds/[episode_id] -> Save script -> Extract lower-thirds -> Validate
(dry run) -> show Daniel the episode/graphic/rejected counts -> Daniel types YES -> rows land.

DONE when: production_lower_thirds has rows for a REAL episode written THROUGH /api/import
(never a direct DB insert), the counts were shown before the live write, and the rows render
in the review card with correct char-band colors (amber <55, green 60-65, amber 66-70,
red/blocked >70).

If extraction 502s or no script is ready, fall back to a hand-built 3-row import JSON pasted
into /import (dry-run -> Type-YES) to still prove the gate end-to-end with real data.

Do NOT touch the auto-extract / confirm-extraction path, the deterministic block-parser, or
anything outside Slice 1 tonight. All gates stand: no live write without Type-YES; David
Rule. Once a real import is proven, delete the S99E001 test episode to reset. Finish with
tsc + eslint clean and a refreshed draft PR.
```

## Essential files for tomorrow

`CLAUDE.md` · `docs/_handoff/GSR-WORKFLOW-CANON.md` · `docs/_handoff/2026-06-11-pipeline-build-plan.md` (Slice 1) · this file · `apps/dashboard/src/lib/import-mode.ts` · `apps/dashboard/src/app/api/import/route.ts` · `apps/dashboard/src/app/api/extract-lower-thirds/route.ts` · `apps/dashboard/src/app/lower-thirds/[episode_id]/episode-workspace.tsx` · `apps/dashboard/src/app/lower-thirds/graphic-card.tsx`
