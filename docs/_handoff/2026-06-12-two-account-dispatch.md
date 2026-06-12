# Two-Account Dispatch (2026-06-12)

How to run GSR work across a **primary** and a **secondary** team account at the
same time, to move roughly half the heavy work off the primary, without context
bleed and without the git collisions that have bitten us before.

## The one idea that makes this safe

Sessions do not share live memory, and they should never need to. **The shared
brain is the repo** (`CLAUDE.md`, `GSR-WORKFLOW-CANON.md`, `LANES.md`), synced only
through pushed commits. Every session, on either account, boots cold from those
files. You never copy chat history between accounts. That is what "no context
bleed" actually means here: not migrating context, but making the repo complete
enough that no migration is needed.

## Five rules (both accounts, every session)

1. **One lane = one branch = one account at a time.** Before working a lane, set
   its Status in `LANES.md` to `IN PROGRESS (account, date)` and push, so the
   other account sees it is taken.
2. **Only the PRIMARY account merges to main.** The secondary account only pushes
   its own lane branch and opens a draft PR. This serializes the single step that
   caused the conflict-marker mess.
3. **Boot cold.** A session's first action is: pull latest, then read `CLAUDE.md`,
   `GSR-WORKFLOW-CANON.md`, and its lane in `LANES.md`. Nothing from another chat.
4. **Push at every clean milestone.** The other account can only see pushed work,
   never your local files or your chat.
5. **Shared files are append-only, pull-before-push.** Do not restructure
   `GSR-WORKFLOW-CANON.md` or `LANES.md` from a secondary lane session.

## Who runs what

**SECONDARY account** (heavy, credential-light, touches files away from the live
core, so it is safe to run in parallel):

- **Lane 2 - Course rebuild** (15 modules into the review-and-refine model). Pure
  docs/HTML, no external keys, the single biggest token cost. Best first offload.
- **Lane 1 - UI build** (after the UI direction is locked). Repo + Vercel preview
  only; primary must stay out of the dashboard screens while this runs.
- **A research lane** (Lane 9 / Phase B). Web research with self-contained output.

**PRIMARY account** (credential-bound + coordination work, lower token cost):

- Lane 3 (database fill), Lane 4 (Rundown Creator sync), Lane 5 (Basecamp) - these
  need live API keys / connectors.
- Lane 6 (migration), Lane 8 (canon + standards).
- **Lane 7 - shipping / merging to main. PRIMARY ONLY, always.**

Unit of assignment is a **whole lane**, never half a lane across two accounts.
Moving a lane between accounts is just flipping its owner in `LANES.md`.

## Check once before you switch

The secondary account's environment must have: the `gsr-automation-v2` repo
connected, plus the Supabase + Vercel + GitHub connectors. **Do not bring the
crypto / Gmail / file-drive / Postman connectors to the new account.** The three
secondary lanes above need no secret API keys, so you can start them even before
key parity is set up.

## Tap-to-copy: secondary-account cold-start prompts

Paste one into a fresh session on the secondary account. Each is self-contained.

**LANE 2 - Course rebuild**
```
You are on the SECONDARY account. First: cd into gsr-automation-v2, git pull the
latest main, and read CLAUDE.md, docs/_handoff/GSR-WORKFLOW-CANON.md, and Lane 2 in
docs/_handoff/LANES.md. Work only on branch chore/course-rebuild off main; never
merge to main (the primary account does that). Set Lane 2 Status to IN PROGRESS
(secondary, today) and push. Task: rebuild the course in docs/_handoff/
gsr-automation-v2-course.html into the review-and-refine model seeded by the
90-item decision backlog, piloting one stage first (Lower Thirds or Distribution)
before rolling across all 15. Validate the embedded JS after every edit. Push at
each clean milestone and open a draft PR. Do not touch the dashboard app or canon.
```

**LANE 1 - UI build** (only after Daniel locks the UI direction)
```
You are on the SECONDARY account. First: cd into gsr-automation-v2, git pull the
latest main, and read CLAUDE.md, GSR-WORKFLOW-CANON.md, Lane 1 in LANES.md, the UI
Foundation module (m13) in docs/_handoff/gsr-automation-v2-course.html, and the
briefs in docs/_handoff/ui-research/. Work only on branch feat/ui-build off main;
never merge to main. Set Lane 1 Status to IN PROGRESS (secondary, today) and push.
Daniel's locked direction is: [FILL IN]. Build it into the real dashboard screens
with the existing tokens + shadcn, render desktop + mobile screenshots, open a
draft PR. Do not pick the direction yourself, and do not touch the database lanes.
```

If you want a third secondary lane, tell the next primary session and it will write
that lane's cold-start prompt here the same way.
