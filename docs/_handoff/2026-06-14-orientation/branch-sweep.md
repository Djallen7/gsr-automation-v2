# Branch sweep — vetted (2026-06-14)

A research agent surveyed all ~39 branches. I verified its load-bearing claims against
`origin/main` and the current branch before trusting them, and corrected two false alarms.
Bottom line: **almost everything is already in main or dead. Exactly one small unmerged item
is worth considering, and it's not urgent.**

## The one real find
- **`feat/propresenter-txt-export`** (1 commit, 2026-06-13). Adds `apps/dashboard/src/lib/propresenter-export.ts` (+59) and a tweak to the Ready-for-ProPresenter page (`ready/ready-output.tsx`, +45) to export approved lower thirds as a **ProPresenter-ready `.txt` file**. Verified genuinely unmerged (`propresenter-export.ts` does not exist on the current branch).
  - **Safe:** it produces a file to copy/download. It does NOT push to the ProPresenter machine, so it respects the David Rule and the build-plan rule that the send stays human until slice 10. It's a legit human-paste aid, the natural output end of Slice 1.
  - **Recommendation:** verify it applies cleanly onto the current branch and fold it in around **Day 5** (the output/demo step). Skip it if it conflicts messily. Not for tonight.

## Corrected false alarms (do NOT merge these)
- **`feat/lower-thirds-table`** = PR **#50** (rename graphics → production_lower_thirds) and **`fix/lt-merge-blockers`** = PR **#52** (merge blockers + variations preservation) are **already in main and already in the current branch.** The agent's "73 / 68 unique commits" is a squash-merge illusion (the originals show as "unique" because they were squashed). Re-merging them would reintroduce the conflict markers #52 was created to repair. Leave them alone.

## Everything else
- Old guest/parser branches (`feat/script-extract-pipeline`, `feat/gsr-voice-profile`, `claude/focused-keller-*`, `feat/comprehensive-schema-v2`): late-May, far behind main; their content (the `/extract` page, guests, the episode workspace, those migrations) is already in main via squashes. Not worth merging — conflict risk, no gain.
- The rest are `ALREADY-IN-MAIN`, design/spec-docs, or stale single commits. **Deleting the merged/dead branches is a post-deadline cleanup chore, not a build task — and a destructive one, so it waits for an explicit go.**
