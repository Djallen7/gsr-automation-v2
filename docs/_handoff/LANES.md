# GSR Work Lanes (living tracker)

This is the master list of workstreams ("lanes") in flight, what is done, what is
left, and a paste-ready prompt to resume each one in ANY session. It is NOT a
per-session report. It is the running to-do across the whole project.

> This file is generated from `docs/_handoff/lanes.json` by `tools/build_lanes.mjs`.
> Edit the json (or let the nightly job append activity), then rebuild. Do not
> hand-edit the lane sections below the divider; they will be overwritten.

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
- **Command Center:** open `docs/_handoff/lanes.html` on a phone or laptop for a
  filterable, tap-to-copy view of every lane (it embeds the data, no server needed).

Always read `/home/user/gsr-automation-v2/CLAUDE.md` and
`docs/_handoff/GSR-WORKFLOW-CANON.md` before acting. All work lives in
gsr-automation-v2 now (blueprint is retired). Dev branch: `claude/codebase-handoff-review-M9Aia`.

_Last updated 2026-06-08 20:00:44 UTC (10 hours ago)._

---

## Lane 1 - UI design direction
**Status:** OPEN.
**Summary:** Pick a UI direction from the bake-off, then build it into the real dashboard screens. Needs Daniel's decision.
**Done:** Mock iterations (v1/v2/v3) and a 7-direction bake-off (Calm Minimalism, Editorial Data-Density, Material 3, Neo-Brutalist, Bento, Humanist, Mission-Control) with screenshots. UI Foundation course module (m13) now teaches dashboard design from the ground up; its Lock step settles the UI direction (operational: per-role Today queue + Pipeline Matrix + mobile-first), backed by 4 cited research briefs in docs/_handoff/ui-research/.
**To finish:**
- Lock the UI direction via the UI Foundation module's Lock step (recommended), or pick from the bake-off.
- Build the chosen direction into the real dashboard screens.
- Render screenshots for review.
**Blocked on:** Daniel's pick (now framed as the UI Foundation module's Lock step).
**Files:** `docs/_handoff/gsr-automation-v2-course.html`, `docs/_handoff/ui-research/`, `docs/ui-mocks/preview-1..7-*.html`, `docs/_handoff/2026-06-07-gsr-ui-strategy.md`, `docs/_handoff/2026-06-07-gsr-ui-bakeoff-research.html`
**Recent activity:**
- 2026-06-08 - UI Foundation module (m13) built + 4 research briefs added; UI direction now lockable in-course
- 2026-06-08 - course: expand m0 to Orientation + GitHub, add m13 Finish-the-Build handoff
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 1), the UI Foundation module (m13) in docs/_handoff/gsr-automation-v2-course.html, and the 4 briefs in docs/_handoff/ui-research/. Daniel's locked direction is: [FILL IN, default operational: per-role Today queue + Pipeline Matrix + mobile-first, one on-brand theme]. Build that into the real dashboard screens (Today queue, Pipeline Matrix, episode drill, graphics page) using the existing design tokens + shadcn components, render desktop + mobile screenshots, and report. Do not pick the direction yourself.`

## Lane 2 - Course modules
**Status:** OPEN.
**Summary:** Build out and polish the automation course; one module is blocked on the chosen UI screenshots.
**Done:** m0 reworked to Orientation + GitHub. Finish-the-Build handoff added (now m14). UI Foundation module (m13) built: ground-up dashboard design, deeply researched + cited (NN/g heuristics + progressive disclosure, Stephen Few operational vs analytical, Refactoring UI, Material 3 tokens, WCAG 2.2 AA numbers, Apple HIG touch targets). 15 modules, JS re-validated. Course overview at docs/_handoff/2026-06-08-gsr-course-overview.html.
**To finish:**
- TOMORROW (2026-06-09): rebuild the course into the review-and-refine model, seeded by the 90-item decision backlog. Each stage = review your setup + add/edit/remove + Build/Later items shown as the plan + Discuss items shown as session flags (not cold questions) + plain-English coding logic + phased automation. Pilot one stage first (Lower Thirds or Distribution), then roll across all 15. Daniel paused this on 2026-06-08 to do lighter tasks first.
- Embed the chosen-UI screenshots into the UI Foundation module once a direction is built (Lane 1).
- Final polish + adaptive-gating review.
**Blocked on:** Nothing for the rebuild (decisions are captured). Lane 1 only blocks embedding the eventual UI screenshots.
**Files:** `docs/_handoff/gsr-automation-v2-course.html`, `docs/_handoff/ui-research/`, `docs/_handoff/2026-06-08-gsr-course-overview.html`
**Recent activity:**
- 2026-06-08 - 19-agent archaeology sweep of the Claude data export (407 convs + projects + memories) -> 90-item backlog; Daniel triaged all 90 (24 build / 9 later / 29 skip / 28 discuss) and resolved 14 conflicts; decisions captured to canon section 13 + 2026-06-08-review-decisions.md. Course rebuild queued for tomorrow.
- 2026-06-08 - Built the UI Foundation module (m13) + 4 cited research briefs; handoff renumbered to m14
- 2026-06-08 - Fix course: premade_library is an existing table, not a missing enum
- 2026-06-08 - Course fact-corrections + record role scopes and deferred per-role login
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 2) and the course file docs/_handoff/gsr-automation-v2-course.html (the M array + engine). The UI Foundation module (id mui, m13) is built. Remaining: once Lane 1 builds a real direction, embed its screenshots into that module, then a final adaptive-gating polish pass. Validate the embedded JS after any edit (extract the <script> and run with a document stub). Do not break the course.`

## Lane 3 - Episode & segment data
**Status:** IN PROGRESS.
**Summary:** Episode and segment data in the live DB. Eps 1-17 done; ongoing for the rest.
**Done:** Eps 1-17 filled (titles incl ep16, full guest names, webstream publish dates, ep1-8 descriptions, 8 shoot dates, 34 episode_guests links, 68 scripts segment rows). Guests-table fixes (Williams org, Janzen merge, Brian Thomas added).
**To finish:**
- 9 deferred shoot dates (need Basecamp, Lane 5).
- ep9-16 descriptions (fill as produced).
- Fill eps 18+ as they air.
- Confirm early-episode rc_rundown_id block mapping.
- A per-episode chyron-affiliation field (see Lane 8).
**Blocked on:** Basecamp (shoot dates) for the deferred ones.
**Files:** `docs/_handoff/2026-06-08-s3-ep1-16-dataset.md`
**Recent activity:**
- 2026-06-08 - canon: topic-relevant guest affiliation/chyron + one-tap confirmation rules
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 3) and 2026-06-08-s3-ep1-16-dataset.md. Using the Supabase MCP (project lafkbxypmciopebentxp), fill any newly-available episode data (read-only verify first, then idempotent writes scoped to the episodes), and update the deferred shoot dates once Basecamp dates exist. Verify by read-back.`

## Lane 4 - Rundown Creator sync
**Status:** OPEN.
**Summary:** Two-way script-to-rundown sync with Rundown Creator. RC API works.
**Done:** RC reachable; rundowns + segment order ingested; scripts scaffolded for eps 1-17. RC is one-rundown-per-episode only from Ep021 onward; eps 1-17 were block-taped.
**To finish:**
- Build the script-to-rundown two-way sync (clean per-episode from Ep021 on).
- Pull script_text via getScript into the scripts table.
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 4). Using the RC API recipe in that lane, design and build the script-to-rundown sync. Start read-only, gate any write-back. RC API recipe: base https://www.rundowncreator.com/davidrives/API.php; env vars RUNDOWN_CREATOR_API_KEY / RUNDOWN_CREATOR_API_TOKEN (TRIM all whitespace, URL-encode); actions getRundowns / getRows(RundownID) / getScript(RowID).`

## Lane 5 - Basecamp integration + 2026 schedule
**Status:** IN PROGRESS.
**Summary:** OAuth + read-only discovery running in a separate session. Two-way sync and 2026 schedule view to follow.
**Done:** OAuth steps defined. Discovery prompt issued (pulling schedule, to-dos, card tables, docs).
**To finish:**
- Complete the OAuth link.
- Commit the full map to docs/_handoff/2026-06-08-basecamp-map.md.
- Persist the refresh token as BASECAMP_REFRESH_TOKEN.
- Design + build the two-way sync (read-first, gated writes).
- Build the 2026 production schedule view in the dashboard (tapings + air + webstream dates).
**Blocked on:** OAuth completion in the keyed session.
**Files:** `docs/_handoff/2026-06-08-basecamp-map.md`
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 5) and docs/_handoff/2026-06-08-basecamp-map.md if it exists. Continue the Basecamp integration: finish the OAuth/token if needed, then design the two-way sync and build the 2026 schedule view. Writes back to Basecamp must be gated. Env vars expected: BASECAMP_CLIENT_ID / BASECAMP_CLIENT_SECRET / BASECAMP_ACCOUNT_ID.`

## Lane 6 - Webstream rename cleanup
**Status:** BLOCKED.
**Summary:** Expand-contract rename of the webstream publish column. One follow-up migration left, gated on the branch reaching main.
**Done:** Expand-contract migration added webstream_scheduled_publish_at (backfilled; old youtube_scheduled_publish_at kept). Code/types updated; docs reframed.
**To finish:**
- After this branch deploys to main, a cleanup migration to DROP the old youtube_scheduled_publish_at column.
**Blocked on:** The branch reaching main (Lane 7).
**Recent activity:**
- 2026-06-08 - Rename publish-date column to webstream via expand-contract; reframe generic publish docs
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 6). Only after the webstream code is live on main: write and apply an idempotent migration dropping episodes.youtube_scheduled_publish_at, regenerate types, verify.`

## Lane 7 - Ship the branch (PR to main)
**Status:** OPEN.
**Summary:** Open/refresh a draft PR for the dev branch and get Daniel's review before a squash-merge to main.
**Done:** Large body of work committed on claude/codebase-handoff-review-M9Aia (course, webstream, data tooling, docs). Only PR #43 has reached main so far.
**To finish:**
- Open/refresh a draft PR for the branch.
- Daniel reviews via the Vercel preview + screenshots.
- Squash-merge to main on his approval so it goes live.
**Blocked on:** Daniel's review/approval.
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 7). Summarize what the branch changes vs main, ensure tsc/eslint clean, open or refresh a draft PR, and give Daniel the Vercel preview link + screenshots to review before any merge. Do not merge without his yes.`

## Lane 8 - Data standards & canon
**Status:** IN PROGRESS.
**Summary:** Standing lane: keep applying recorded data standards and canon to new data.
**Done:** Standards recorded in the canon, full guest names. Chyron uses the topic-relevant affiliation. One-tap confirmations. "webstream" = the weekly multi-platform release umbrella. Canon section 13 added: review decisions (L3 band 55-70 / Topic 60-65, standardize Intro Graphic, THD = The Heavens Declare, 270 hours, etc.) + Rumble outreach correction. Guest Corrections / Do-Not-Book / routing reference built (GUEST-CORRECTIONS.md), incl. the recovered booking frameworks (40/40/15/5, Five-Point Stakes, four hook types, Barentine Test, tiers). ADRs 0004-0006 authored (templated master-metadata, Dropbox-no-metadata, AI-metadata-needs-approval); SYSTEM-EVOLUTION reconciled. Voice profile: added the 'Phenomenon Before Term' intro rule. README pinned to Next.js 16.2.6.
**To finish:**
- Keep applying the standards to new data.
- Add a per-episode chyron-affiliation override field on episode_guests (flagged enhancement).
- Promote the booking frameworks from GUEST-CORRECTIONS.md into canon on the next pass.
- Periodic guest/data hygiene.
**Files:** `docs/_handoff/GSR-WORKFLOW-CANON.md`, `docs/_handoff/GUEST-CORRECTIONS.md`, `docs/decisions/0004-templated-master-metadata.md`
**Recent activity:**
- 2026-06-08 - Captured review decisions to canon s13; built GUEST-CORRECTIONS.md (+ frameworks); authored ADRs 0004-0006; intro rule + README version pin.
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 8) and GSR-WORKFLOW-CANON.md. Apply the recorded standards to any new data, and when ready, add the per-episode chyron-affiliation override on episode_guests (migration + types + verify).`

## Lane 9 - Autonomous research loop
**Status:** PAUSED.
**Summary:** Self-paced research queue. Paused; resume when wanted.
**Done:** docs/_handoff/research-queue.md set up. Optimization report and per-stage tool suggestions produced.
**To finish:**
- Resume the queue when wanted (remaining items: per-direction UI research docs, etc.).
**Files:** `docs/_handoff/research-queue.md`
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 9) and docs/_handoff/research-queue.md. Resume the self-paced loop draining that queue, committing each result.`

---

## Done / closed lanes (for the record)
- Repo consolidation: blueprint retired, everything in gsr-automation-v2 (2026-06-08).
- Course-freshness CI gate + conflict-purge batch 3 + role scopes: merged to main (PR #43).
- Session changelog written: docs/_handoff/2026-06-08-session-changelog.md.
- Export archaeology: 19-agent sweep of the full Claude data export + 90-item decision triage; decisions captured to canon s13, 2026-06-08-review-decisions.md, and export-archaeology-backlog.json (2026-06-08).
- Easy-builds chain executed: guest corrections, guest topic-brief template, ADRs 0004-0006, intro rule, pre-air email update, README pin. Tracker: 2026-06-08-easy-builds-chain.md (2026-06-08).
- Outreach: Rumble / StreamHoster / Fireside emails drafted in Daniel's Gmail (his to send from a working account); flight decisions worksheet delivered (gsr-flight-worksheet.html) (2026-06-08).
