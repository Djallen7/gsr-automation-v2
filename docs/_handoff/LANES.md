# GSR Work Lanes (living tracker)

This is the master list of workstreams ("lanes") in flight, what is done, what is
left, and a paste-ready prompt to resume each one in ANY session. It is NOT a
per-session report. It is the running to-do across the whole project.

## How to use this file (every session, read this first)
- This file is the shared brain. Any session can read AND update it.
- Before working a lane: `git pull --rebase`, then set that lane's **Status** to
  `IN PROGRESS (your name/session, date)` and push, so other sessions see it is taken.
- When you pause: update Done / To finish, set Status back to `OPEN` (or `BLOCKED`),
  commit and `git pull --rebase` then `git push`.
- Sessions do not share live memory, so each **Resume prompt** is self-contained:
  it tells a fresh session what to read first, then what to do.
- **Multiple sessions at once:** there is no live lock, only this file. To avoid two
  sessions colliding on the same files, either (a) one session owns a lane at a time
  (the IN PROGRESS flag), or (b) split a lane into sub-lanes that touch different files
  (e.g. "UI: Today screen" vs "UI: Schedule screen"). If two do edit the same file,
  git will flag a conflict on push, recoverable, but the flag above prevents most.

Always read `/home/user/gsr-automation-v2/CLAUDE.md` and
`docs/_handoff/GSR-WORKFLOW-CANON.md` before acting. All work lives in
gsr-automation-v2 now (blueprint is retired). Dev branch: `claude/codebase-handoff-review-M9Aia`.

---

## Lane 1 - UI design direction
**Status:** OPEN, needs Daniel's decision.
**Done:** mock iterations (v1/v2/v3) and a 7-direction bake-off (Calm Minimalism, Editorial Data-Density, Material 3, Neo-Brutalist, Bento, Humanist, Mission-Control) with screenshots. Files: `docs/ui-mocks/preview-1..7-*.html`, `docs/_handoff/2026-06-07-gsr-ui-strategy.md`, `docs/_handoff/2026-06-07-gsr-ui-bakeoff-research.html`.
**To finish:** Daniel picks a direction (or two); then build it into the real dashboard screens and render screenshots for review.
**Blocked on:** Daniel's pick.
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 1), the 7 previews in docs/ui-mocks/, and 2026-06-07-gsr-ui-bakeoff-research.html. Daniel's chosen direction is: [FILL IN]. Build that direction into the real dashboard screens (Today queue, Schedule matrix, episode drill, graphics page), render desktop + mobile screenshots, and report. Do not pick the direction yourself.`

## Lane 2 - Course modules
**Status:** OPEN.
**Done:** m0 reworked to Orientation + GitHub; m13 "Finish the Build" added; course overview at `docs/_handoff/2026-06-08-gsr-course-overview.html`. Course file: `docs/_handoff/gsr-automation-v2-course.html`.
**To finish:** the UI Customization module; embed the chosen-UI screenshots into modules; final polish + adaptive-gating review.
**Blocked on:** Lane 1 (for the embedded UI screenshots).
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 2), the course file docs/_handoff/gsr-automation-v2-course.html (the M array + engine), and the course overview. Build the UI Customization module matching the existing module schema, validate the JS with node --check, commit. Do not break the course.`

## Lane 3 - Episode & segment data
**Status:** eps 1-17 DONE in the live DB; ongoing for the rest.
**Done:** eps 1-17 filled (titles incl ep16, full guest names, webstream publish dates, ep1-8 descriptions, 8 shoot dates, 34 episode_guests links, 68 scripts segment rows); guests-table fixes (Williams org, Janzen merge, Brian Thomas added). Reference: `docs/_handoff/2026-06-08-s3-ep1-16-dataset.md`.
**To finish:** 9 deferred shoot dates (need Basecamp, Lane 5); ep9-16 descriptions (fill as produced); fill eps 18+ as they air; confirm early-episode rc_rundown_id block mapping; a per-episode chyron-affiliation field (see Lane 8).
**Blocked on:** Basecamp (shoot dates) for the deferred ones.
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 3) and 2026-06-08-s3-ep1-16-dataset.md. Using the Supabase MCP (project lafkbxypmciopebentxp), fill any newly-available episode data (read-only verify first, then idempotent writes scoped to the episodes), and update the deferred shoot dates once Basecamp dates exist. Verify by read-back.`

## Lane 4 - Rundown Creator sync
**Status:** OPEN (RC API works).
**Done:** RC reachable; rundowns + segment order ingested; scripts scaffolded for eps 1-17. RC is one-rundown-per-episode only from Ep021 onward; eps 1-17 were block-taped.
**To finish:** build the script-to-rundown two-way sync (clean per-episode from Ep021 on); pull script_text via getScript into the scripts table.
**RC API recipe:** base `https://www.rundowncreator.com/davidrives/API.php`; env vars `RUNDOWN_CREATOR_API_KEY` / `RUNDOWN_CREATOR_API_TOKEN` (TRIM all whitespace, URL-encode); actions getRundowns / getRows(RundownID) / getScript(RowID).
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 4). Using the RC API recipe in that lane, design and build the script-to-rundown sync. Start read-only, gate any write-back.`

## Lane 5 - Basecamp integration + 2026 schedule
**Status:** IN PROGRESS (OAuth + read-only discovery running in a separate session).
**Done:** OAuth steps defined; discovery prompt issued (pulling schedule, to-dos, card tables, docs). Env vars expected: `BASECAMP_CLIENT_ID` / `BASECAMP_CLIENT_SECRET` / `BASECAMP_ACCOUNT_ID`.
**To finish:** complete the OAuth link; commit the full map to `docs/_handoff/2026-06-08-basecamp-map.md`; persist the refresh token as `BASECAMP_REFRESH_TOKEN`; design + build the two-way sync (read-first, gated writes); build the 2026 production schedule view in the dashboard (tapings + air + webstream dates).
**Blocked on:** OAuth completion in the keyed session.
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 5) and docs/_handoff/2026-06-08-basecamp-map.md if it exists. Continue the Basecamp integration: finish the OAuth/token if needed, then design the two-way sync and build the 2026 schedule view. Writes back to Basecamp must be gated.`

## Lane 6 - Webstream rename cleanup
**Status:** OPEN (one follow-up).
**Done:** expand-contract migration added `webstream_scheduled_publish_at` (backfilled; old `youtube_scheduled_publish_at` kept); code/types updated; docs reframed.
**To finish:** after this branch deploys to main, a cleanup migration to DROP the old `youtube_scheduled_publish_at` column.
**Blocked on:** the branch reaching main (Lane 7).
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 6). Only after the webstream code is live on main: write and apply an idempotent migration dropping episodes.youtube_scheduled_publish_at, regenerate types, verify.`

## Lane 7 - Ship the branch (PR to main)
**Status:** OPEN.
**Done:** large body of work committed on `claude/codebase-handoff-review-M9Aia` (course, webstream, data tooling, docs). Only PR #43 has reached main so far.
**To finish:** open/refresh a draft PR for the branch; Daniel reviews via the Vercel preview + screenshots; squash-merge to main on his approval so it goes live.
**Blocked on:** Daniel's review/approval.
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 7). Summarize what the branch changes vs main, ensure tsc/eslint clean, open or refresh a draft PR, and give Daniel the Vercel preview link + screenshots to review before any merge. Do not merge without his yes.`

## Lane 8 - Data standards & canon
**Status:** ONGOING (standing).
**Done:** standards recorded in the canon, full guest names; chyron uses the topic-relevant affiliation; one-tap confirmations; "webstream" = the weekly multi-platform release umbrella.
**To finish:** keep applying the standards to new data; add a per-episode chyron-affiliation override field on episode_guests (flagged enhancement); periodic guest/data hygiene.
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 8) and GSR-WORKFLOW-CANON.md. Apply the recorded standards to any new data, and when ready, add the per-episode chyron-affiliation override on episode_guests (migration + types + verify).`

## Lane 9 - Autonomous research loop (paused)
**Status:** PAUSED.
**Done:** `docs/_handoff/research-queue.md` set up; optimization report and per-stage tool suggestions produced.
**To finish:** resume the queue when wanted (remaining items: per-direction UI research docs, etc.).
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 9) and docs/_handoff/research-queue.md. Resume the self-paced loop draining that queue, committing each result.`

---

## Done / closed lanes (for the record)
- Repo consolidation: blueprint retired, everything in gsr-automation-v2 (2026-06-08).
- Course-freshness CI gate + conflict-purge batch 3 + role scopes: merged to main (PR #43).
- Session changelog written: `docs/_handoff/2026-06-08-session-changelog.md`.
