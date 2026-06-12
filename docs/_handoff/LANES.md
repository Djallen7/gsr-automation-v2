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

_Last updated 2026-06-11 21:55:19 UTC (11 hours ago)._

## Live sessions (snapshot 16 hours ago)
- **-Users-claudefix** [Unknown] 16 hours ago
- **-Users-claudefix** [Unknown] 16 hours ago
- **-Users-claudefix** [Unknown] 23 hours ago
- **-Users-claudefix** [Unknown] 1 day ago
- **-Users-claudefix** [Unknown] 1 day ago
- **-Users-claudefix** [Unknown] 1 day ago
- **-Users-claudefix** [Unknown] 1 day ago
- **-Users-claudefix** [Unknown] 1 day ago
- **-Users-claudefix-Downloads-GSN-Dashboard-Local-GSR-GraphicsPackage** [Unknown] 1 day ago
- **-Users-claudefix** [Unknown] 1 day ago
- **-Users-claudefix** [Unknown] 1 day ago
- **-Users-claudefix** [Unknown] 1 day ago

---

## Lane 1 - Dashboard redesign (liquid glass)
**Status:** IN PROGRESS.
**Summary:** Daniel locked the direction 2026-06-12 (canon s19): scrap the current UI, rebuild nav around the actual workflow with only recent-canon features, liquid glass theme synthesized from his world mocks. Plan of record: docs/_handoff/2026-06-12-dashboard-redesign-plan.md.
**Done:** Mock iterations (v1/v2/v3) and a 7-direction bake-off (Calm Minimalism, Editorial Data-Density, Material 3, Neo-Brutalist, Bento, Humanist, Mission-Control) with screenshots. UI Foundation course module (m13) now teaches dashboard design from the ground up; its Lock step settles the UI direction (operational: per-role Today queue + Pipeline Matrix + mobile-first), backed by 4 cited research briefs in docs/_handoff/ui-research/. 2026-06-12: Daniel rejected the current UI + the bake-off frame; liquid glass directive captured (canon s19); redesign build plan authored with IA, screen blueprints, R1-R5 sequencing; theme preview built from the world-mock synthesis.
**To finish:**
- R1 theme foundation: tokens, glass primitives, nav shell (Jun 13-14).
- R2 Today + Pipeline Matrix on real data (Jun 15-16).
- R3 Lower Thirds hub consolidating import/extract/upload/approved/ready, gates unchanged (Jun 16-18).
- R4 Distribution hub v1 + Rumble prep card 4.1a (Jun 19-20).
- R5 Guests reskin, episode workspace polish, redirects, m13 screenshots (Jun 21-23); slice-5 close by Jun 25.
**Blocked on:** Nothing hard: Daniel one-taps the workflow statement, station list, and theme preview; build proceeds on the recommended defaults meanwhile.
**Files:** `docs/_handoff/2026-06-12-dashboard-redesign-plan.md`, `docs/ui-mocks/2026-06-12-liquid-glass-dashboard-preview.html`, `docs/_handoff/GSR-WORKFLOW-CANON.md (s19)`, `docs/_handoff/ui-research/`
**Recent activity:**
- 2026-06-12 - Liquid glass directive captured (canon s19); redesign plan + theme preview authored; lane renamed from UI design direction.
- 2026-06-08 - UI Foundation module (m13) built + 4 research briefs added; UI direction now lockable in-course
- 2026-06-08 - course: expand m0 to Orientation + GitHub, add m13 Finish-the-Build handoff
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 1), canon s19, and docs/_handoff/2026-06-12-dashboard-redesign-plan.md (the plan of record). Build the next R-step in the plan sequence on the session branch: liquid glass tokens + primitives first, then screens in order, gates unchanged, mock-content tested, desktop + phone screenshots per step, tsc/eslint clean, draft PR. Do not resurrect the bake-off or the tool-named page set.`

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
- BUILD TASK 1 (do first, stable session only): rename graphics -> production_lower_thirds + clean it (drop image cols, add ordering cols), keep production_graphics as the graphics table (+ display_duration, last_line, Intro Graphic/Book Cover types), per docs/_handoff/2026-06-09-build-task-1-schema-rename.md. Coordinated DB+code change (~20 call sites). Prereq: strip review-only public files + merge PR #47 to main.
- Keep applying the standards to new data.
- Add a per-episode chyron-affiliation override field on episode_guests (flagged enhancement).
- Promote the booking frameworks from GUEST-CORRECTIONS.md into canon on the next pass.
- Periodic guest/data hygiene.
**Files:** `docs/_handoff/GSR-WORKFLOW-CANON.md`, `docs/_handoff/GUEST-CORRECTIONS.md`, `docs/decisions/0004-templated-master-metadata.md`
**Recent activity:**
- 2026-06-08 - Captured review decisions to canon s13; built GUEST-CORRECTIONS.md (+ frameworks); authored ADRs 0004-0006; intro rule + README version pin.
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 8) and GSR-WORKFLOW-CANON.md. Apply the recorded standards to any new data, and when ready, add the per-episode chyron-affiliation override on episode_guests (migration + types + verify).`

## Lane 9 - Autonomous research loop
**Status:** IN PROGRESS.
**Summary:** Fable 5 pipeline mission (2026-06-11): Phase R complete + independently verified; PR stack #47/#50/#52 squash-merged 2026-06-12 (Lane A, Daniel's one-tap yes), CL-009 resolved, plan 0.2 truth sweep done. Next: Daniel merges PR #53, then Phase B lanes 10-15 open.
**Done:** docs/_handoff/research-queue.md set up. Optimization report and per-stage tool suggestions produced.
**To finish:**
- Merge PR #53 under the standing grant (in progress this session).
- Open Phase B: item 1.0 import-gate hardening next, with mock-content testing, on the session branch.
- Graphics + segment-timing questions go out as one-tap card batches when slices need them (decision 5 resolved).
**Files:** `docs/_handoff/research-queue.md`
**Resume prompt:** `Read docs/_handoff/LANES.md (Lane 9), docs/_handoff/2026-06-11-pipeline-build-plan.md (the plan, v3), docs/_handoff/2026-06-11-mission-run-notes.md (goal checklist + corrections), and docs/_handoff/2026-06-11-claim-ledger.json. If transcripts exist in 2026-06-11-transcript-pull-kit/transcripts/, mine them per item 3.2 (statuses mined/rejected, claims ASSUMED->verified). If Daniel has answered section 7, append answers to canon dated and open the Phase B lanes the plan lists in section 9. Starred defaults stand unless he says otherwise. Never bypass canon s15 gates.`

---

## Done / closed lanes (for the record)
- Repo consolidation: blueprint retired, everything in gsr-automation-v2 (2026-06-08).
- Course-freshness CI gate + conflict-purge batch 3 + role scopes: merged to main (PR #43).
- Session changelog written: docs/_handoff/2026-06-08-session-changelog.md.
- Export archaeology: 19-agent sweep of the full Claude data export + 90-item decision triage; decisions captured to canon s13, 2026-06-08-review-decisions.md, and export-archaeology-backlog.json (2026-06-08).
- Easy-builds chain executed: guest corrections, guest topic-brief template, ADRs 0004-0006, intro rule, pre-air email update, README pin. Tracker: 2026-06-08-easy-builds-chain.md (2026-06-08).
- Outreach: Rumble / StreamHoster / Fireside emails drafted in Daniel's Gmail (his to send from a working account); flight decisions worksheet delivered (gsr-flight-worksheet.html) (2026-06-08).
