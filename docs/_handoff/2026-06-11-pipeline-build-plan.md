# GSR Pipeline Build Plan - DRAFT (2026-06-11)

**Status: DRAFT v2 (citations filled).** All four research agents have reported; every
citation slot now points at a ledger claim (docs/_handoff/2026-06-11-claim-ledger.json,
47 claims). Critique rounds 1-3 (red team, gsr-health, editorial) and the rubric check
follow. Per the mission contract, Phase B starts only after Daniel okays this plan.

Operating answers in force (starred defaults, run-notes 2026-06-11):
1A 2A 3A 4A 5A 6A 7A 8B 9A 10A 11A 12B 13A 14A 15A 16A.

Effort key: S = under ~2 hours · M = about half a day · L = a day or more.
Scores: W = dashboard/runtime weight 1-5 · F = fragility 1-5 · $ = API cost per run.

---

## 1. Mission recap and the sequencing spine

Daniel commissioned a research loop (claim ledger doctrine: nothing ASSUMED or REFUTED ships)
followed by this build plan: sequence the 24 BUILD decisions from the 2026-06-08 review, the
mission's own named deliverables (Mission Control on lanes.html, standing loops, transcript
mining), and the DISCUSS queue as decision-ready proposals, all under canon s15 gates.

**The spine (what unblocks what):**

1. **FIRST: the PR stack #47 -> #50 -> #52 must merge before build slice 1.** The live DB
   already renamed `graphics` -> `production_lower_thirds` (PR #50's migration is applied),
   but deployed main still queries `graphics`, so the deployed lower-thirds pages hit a
   missing table until the stack merges and deploys. Verified live 2026-06-11; impact is
   bounded because every lower-thirds table has 0 rows. (CL-007, CL-009.) Re-confirmed today:
   even this dev branch carries 20 `.from('graphics')` call sites and no rename migration;
   only the PR branch has the fix. Nothing dashboard-side builds until the stack lands.
2. Slice 1 (lower-thirds vertical slice, answer 1A) sits directly on the renamed schema.
3. Mission Control (slice 2) and transcript mining (slice 3) have **zero dependency on the
   PR stack** and start immediately, in parallel.
4. The Mac jobs-table poller (slice 7 opener) is the control plane every heavy Mac task
   needs: transcription, uploads, Mac Mail, Apple Notes. It gates slices 7 onward.
5. Two Daniel working sessions (graphics decisions, segment timing) gate their own small
   build clusters; nothing else waits on them.

Ship dates below assume Daniel approves this plan and merges the PR stack by **2026-06-13**.
Every date after slice 0 slides day for day with that merge. June 15 is kept clear of asks
(Ming Wang filming, 9:30 arrival).

---

## 2. Slice overview (one line each)

| # | Slice | Ships | Depends on |
|---|---|---|---|
| 0 | Merge gate + post-merge verification | Jun 12-13 | Daniel's merge |
| 1 | Lower-thirds vertical slice on `production_lower_thirds` | Jun 13-18 | Slice 0 |
| 2 | Mission Control on lanes.html + standing loops | Jun 12-14 | nothing (parallel now) |
| 3 | Transcript mining resumption (Mac kit + R6) | Jun 12-19 | Daniel's Mac, ~15 min |
| 4 | Quick wins batch (docs, one-tap sends, fact checks) | Jun 12-14 | nothing |
| 5 | Dashboard UI operational default (3A locked) | Jun 18-23 | Slice 1 |
| 6 | Data + sync backbone (RC, backfill, contacts, schedule) | Jun 22-27 | Slice 0; P1 yes |
| 7 | Mac worker + transcription + metadata | Jun 26 - Jul 1 | jobs table (7.1) |
| 8 | Voice DNA + monologue arc | Jun 30 - Jul 2 | nothing hard |
| 9 | Social clips + posts UI | Jul 2-6 | Slice 5 patterns |
| 10 | ProPresenter test-machine track | Jun 27 - Jul 9 | feasibility verify (10.1) |

Working sessions (Daniel, 30-45 min each, proposed week of Jun 22): graphics decisions;
segment timing. Their gated builds are in section 4.

---

## 3. Build slices

### Slice 0 - Merge gate + verification (Jun 12-13)

**0.1 PR stack merged: #47, then #50, then #52.**
Ship Jun 12-13 · Owner: Daniel (review + squash-merge); sessions keep drafts refreshed (9A) · Effort S (review only) · W1 F2 $0.
Done when: all three merged, Vercel production deploy green, deployed `/lower-thirds` loads
against the renamed schema with zero rows.
Cite: CL-007, CL-009; Daniel's Q16 answer (A).

**0.2 Post-merge verification + docs truth sweep.**
Ship same day as merge · Lane 8 · Effort S · W1 F1 $0.
Done when: `list_migrations` shows the rename migration; security+performance advisors clean;
`npx tsc --noEmit` + `npx eslint src/` clean on main; CLAUDE.md Project State and canon
section 0 say `production_lower_thirds`; AUTOMATION_ROADMAP's stale "graphics" lines updated;
repo grep for "the lower-thirds table is `graphics`" returns nothing.
Cite: CL-009; build-task-1 verify list (2026-06-09-build-task-1-schema-rename.md).

### Slice 1 - Lower-thirds vertical slice (Lane 10, new) (Jun 13-18)

This is answer 1A. PR #50 carries the rename migration + ~20 call-site code updates; what
remains is everything Build Task 1 listed that the stack does not already include, plus the
first real data and the variations flow.

**1.1 Intro Graphic follow-up migration on `production_graphics`.**
Ship Jun 13 · Lane 10 · Effort S · W1 F2 $0.
Scope: `graphic_type` CHECK gains "Intro Graphic" + "Book Cover", any "Title Graphic" rows
migrate, the term retires system-wide. PR #50 already ships `display_duration` + `last_line`;
PR #52 explicitly DEFERRED this Intro Graphic standardization to its own follow-up migration
(the in-migration version aborted), so this item is that follow-up. Done when: migration
listed remotely, advisors clean, types regenerated.
Cite: canon s13 (Intro Graphic standard), s14 (duration + last-line columns); CL-046.

**1.2 Character validator reconciled to the canon 55-70 band.**
Ship Jun 13 · Lane 10 · Effort S · W1 F1 $0.
PR #52 already moves the validator to soft amber over 65 (66-70 allowed, never blocks) and
targets 60-65 in the extraction prompt. Canon s13 additionally wants: under 55 amber, and
over 70 BLOCKED red. This item adds those two missing edges post-merge (Topic L3 stays
60-65). Done when: component shows amber under 55, green 60-65, amber 66-70, red block over
70; tsc/eslint clean.
Cite: canon s13 length ruling; CL-046.

**1.3 Webstream contract migration (Lane 6 unblock).**
Ship Jun 14 · Lane 6 · Effort S · W1 F2 $0.
Drop `episodes.youtube_scheduled_publish_at` and repoint `v_episode_workflow` to
`webstream_scheduled_publish_at`, in one migration, ONLY after slice 0 deploys (the deployed
view still references the old column until then). Done when: migration applied, view
queries clean, advisors clean.
Cite: AUTOMATION_ROADMAP follow-up section; canon s12 webstream ruling.

**1.4 First real episode import through the Type-YES gate.**
Ship Jun 16 · Lane 10 · Effort S-M · W2 F2 · $ ~0.10-0.30 Claude extraction per script, $0 import.
Pick one episode with a finished script; extract (saved-script hold +
`/api/scripts/confirm-extraction`, or `/extract`); dry-run `/api/import`; show Daniel the
episode/graphic/rejected counts; he types YES; rows land. Done when:
`select count(*) from production_lower_thirds` > 0, the counts were shown before the live
run, and the review grid renders the rows. This is the real Stage 7 milestone.
Cite: CL-007; canon s15 Type-YES gate; CLAUDE.md import rule.

**1.5 Three-variation regenerate flow on `lower_thirds_variations`.**
Ship Jun 17 · Lane 10 · Effort M · W2 F2 · $ ~0.05-0.15 per regenerate call.
PR #50 renames the child table and #52 already persists Var 1/Var 2 into
`lower_thirds_variations` slots 2/3 (slot 1 = primary) across all three write paths, so this
item is: post-merge verify that flow on real rows, then extend the chyron path to produce 3
topic-relevant variations per guest (each highlighting the credential most relevant to that
episode's topic), drawing on past examples. Done when: a regenerate on a real row yields 3
stored variations, tsc/eslint clean.
Cite: canon s13 chyron-variations ruling; CL-046.

**1.6 Three-column comparison view (lt-three-column-view).**
Ship Jun 17 · Lane 10 · Effort M · W2 F1 $0.
`/lower-thirds` gains a Primary | Var 1 | Var 2 comparison layout for review. Done when: page
renders the three columns with real rows, mobile usable, screenshot captured.
Cite: 2026-06-08-review-decisions BUILD list.

**1.7 Five quality tests as soft warnings (rides on proposal P7).**
Ship Jun 18 · Lane 10 · Effort S · W1 F1 $0.
If Daniel taps yes: the 5 checks render as non-blocking warnings in the review UI (band,
banned characters, ALL CAPS, pipe/colon usage, end punctuation). Done when: warnings render
on seeded bad rows; nothing is hard-blocked.
Cite: review-decisions DISCUSS lt-5-quality-tests; proposal P7 below.

### Slice 2 - Mission Control + standing loops (Lane 11, new) (Jun 12-14, parallel now)

Answer 11A: extend lanes.html, one place, already works on Daniel's phone. Assume 5-10
parallel sessions (12B). No parallel tracker gets built (anti-churn).

**2.1 Sessions summarizer script -> `sessions` block in lanes.json.**
Ship Jun 13 · Lane 11 · Effort M · W2 F3 (JSONL format can shift between CLI versions) · $0
(local parse; ~$0.02/refresh if a model summarizes).
A script on Daniel's Mac merges two verified feeds into per-session rows (last task, state,
files touched, last activity): `claude agents --json` for live background-session state, and
Agent SDK `list_sessions()` whose `SDKSessionInfo.summary` field already carries an
auto-generated per-session summary (the transcript reader, if ever needed, is
`get_session_messages()`, not "Session.History"). The official "Building a session browser"
cookbook is the reference pattern. Done when: `lanes.json` validates with a populated
`sessions` block from at least 3 real sessions.
Cite: CL-015 (claude agents --json), CL-030 (SDK session APIs + cookbook), CL-031 (storage).

**2.2 lanes.html sessions panel.**
Ship Jun 14 · Lane 11 · Effort S · W1 F1 $0.
`tools/build_lanes.mjs` renders the sessions block as a live "what is every session doing"
panel next to the lanes. Done when: lanes.html shows it, phone-readable, no server needed.
Cite: answer 11A.

**2.3 `cleanupPeriodDays: 90` on the Mac.**
Ship Jun 12 · Owner: Daniel or any Mac session (this container is blocked from settings
edits) · Effort S · W1 F1 $0.
One line in `.claude/settings.json` so session history survives long enough to analyze.
Done when: the key is present on the Mac.
Cite: CL-008 (verified: project-level key is honored).

**2.4 Standing loops wired.**
Ship Jun 14 · Lane 11 · Effort M · W1-2 F2 · $ varies, ~$0.50-2.00/day total at current usage.
(a) nightly lanes updater: `tools/nightly_lanes_update.mjs` exists, schedule it (Routine on
the Mac, launchd fallback); (b) CI babysitter per open PR (15-min loop: re-check CI, diagnose
+ push fix, never merge per 9A); (c) weekly claim-ledger re-verification (tools shift weekly);
(d) Mission Control refresh feeding 2.1. Loops PREPARE but never fire a gated action (canon
s15). Placement rule from verification: /loop tasks are session-scoped and expire after 7
days, so anything standing goes to a Routine (Anthropic cloud, fresh clone, structurally
cannot reach QNAP/ProPresenter; caps Pro 5 / Max 15 runs/day, min interval 1h) or to
Supabase Cron, never to a long-lived /loop. Done when: each loop has run once with logged
output.
Cite: mission §5 standing loops; CL-026 (/loop limits), CL-027 (Routines verified).

**2.5 Adopt memo + ADR (adopt vs extend) + the 8B install batch.**
Ship Jun 14 · Lane 11 · Effort S · $0.
The verification swarm settled the adopt set (it differs from the mission doc's first
guess): ADOPT = official Agent View (`claude agents`, built-in, no install; needs the small
habit of backgrounding working sessions with `/bg` or left-arrow) + ccusage as the weekly
cost lens (its live monitor was removed in v18; `blocks --active` still shows burn) +
claude-devtools for after-the-fact forensics (MIT, zero outbound network). WATCH =
claude-code-log, claude-self-reflect (passed install-safety), claude-view (telemetry
default-on). SKIP = claude-squad (its autoyes mode fails the David Rule's spirit) and the
mission-control platform (replaces the workflow; anti-churn). The same memo carries the R3
stack proposals: supabase/agent-skills + vercel-labs/next-skills (both first-party,
instruction-only), commit-commands (official plugin), ergut remote transcript MCP (cloud
mining unblock) and jkawamoto local transcript MCP (Mac). Nothing installs before Daniel's
one-tap yes. Done when: ADR committed; every proposal in the ledger with a yes/no
recommendation and risk note.
Cite: CL-010..CL-017 (Mission Control verdicts), CL-036..CL-041 (R3 candidates); answer 8B.

### Slice 3 - Transcript mining resumption (Lane 9) (Jun 12-19, parallel, Mac)

**3.1 Mac rung-2 pull run.**
Ship Jun 13 · Owner: Daniel (~15 min active) or a Mac session · Effort S · F3 (YouTube
blocking is the known risk) · $0 on free rungs.
Run the pre-staged kit (`docs/_handoff/2026-06-11-transcript-pull-kit/`, urls.txt ready,
rank-1 seeds first); transcripts land in `transcripts/`. Paid rungs 5-7 only after a one-tap
cost yes. CLOUD SHORTCUT (one-tap, part of the decision-2 batch): connect the ergut remote
transcript MCP, which fetches from Cloudflare's IP, then live-test it from a cloud session;
if YouTube serves it, cloud sessions mine without waiting for the Mac.
Done when: transcript files exist for >= 60 of 99 seeds or every rung is exhausted with
logged failures.
Cite: CL-002 (cloud IP block, live-tested); CL-036 (ergut remote, endpoint live-checked);
CL-037 (jkawamoto local for the Mac); mission rung ladder.

**3.2 Mine the 99 seeds into the ledger.**
Ship Jun 18 · Lane 9 · Effort M · $ token cost only.
Every seed ends `mined` or `rejected` with claims logged ASSUMED -> verified per doctrine.
Done when: queue JSON shows 0 `pending` seeds; ledger committed.
Cite: mission R1; canon s15 doctrine.

**3.3 R6 lead-driven expansion, +50 to +100 videos (answer 6A).**
Ship Jun 19 · Lane 9 · Effort M · $ token cost only.
Score the seed corpus for leads, add net-new videos with `source: "R6-lead:<lead>"`, mine
through the same doctrine. Done when: >= 50 net-new videos mined; low-signal finds rejected
with one-line reasons.
Cite: mission R6; answer 6A.

**3.4 Plan addendum v2.**
Ship Jun 19 · Lane 9 · Effort S · $0.
Fold new VERIFIED claims into this plan as a dated addendum; re-run the rubric. Done when:
addendum committed citing ledger IDs only (no ASSUMED, no REFUTED).
Cite: mission Phase S rules.

### Slice 4 - Quick wins batch (Lane 8 mostly) (Jun 12-14, parallel)

**4.1 Rumble Upload API request sent.**
Ship Jun 12 · Owner: Daniel, one tap (send the drafted Gmail from a working account) · $0.
Done when: sent without a bounce; follow-up reminder set for +7 days.
Cite: canon s13 Rumble correction (the 2026-05-15 bounces were sender-side).

**4.2 Booking frameworks promoted into canon.**
Ship Jun 13 · Lane 8 · Effort S · $0.
GUEST-CORRECTIONS.md section 5 (40/40/15/5, Five-Point Stakes, hook types, Barentine Test,
tiers) gets its canon section. Done when: canon section exists, dated; GUEST-CORRECTIONS
links to it.
Cite: Lane 8 to-finish; easy-builds #8.

**4.3 Superstore lookup spec (build lands in 7.4).**
Ship Jun 14 · Lane 8 · Effort S · W1 F2 $0.
Spec the guest/topic -> products lookup so on-air plugs are never fabricated. Done when:
spec doc committed with the fetch contract.
Cite: easy-builds #5 (QUEUED); review-decisions meta-superstore-lookup.

**4.4 Kilauea figure fact-checked.**
Ship Jun 13 · Lane 8 · Effort S · $0.
Verify the "48" in the Kilauea metadata is a count of past eruptive events per the source
article; lock the record-breaking framing. Daniel asked to be fact-checked before air. Done
when: wording locked in the episode row + note citing the article.
Cite: canon s14 confirms list; proposal P15.

**4.5 SessionStart hook: confirm fixed, close the item.**
Ship Jun 12 · Lane 8 · Effort S · $0.
s14 said "fix the malformed SessionStart hook"; the run-notes audit found repo hooks now
serving correctly. Verify on the Mac too, then close. Done when: hook fires on a fresh Mac
session; item closed in the backlog.
Cite: run-notes Phase E hooks row.

**4.6 gsr-research repo hygiene (rides on proposal P14).**
Ship Jun 14 · Lane 8 · Effort S · $0.
If Daniel taps yes: copy the handoff-docs + branch-and-PR structure into gsr-research. Done
when: that repo has a CLAUDE-readable handoff and branch protection mirrors this repo.
Cite: discussion queue ops-gsr-research-handoff.

### Slice 5 - Dashboard UI operational default (Lane 1) (Jun 18-23)

Answer 3A locks the direction: per-role Today queue + Pipeline Matrix, mobile-first, one
on-brand theme. No bake-off wait.

**5.1 Today queue + Pipeline Matrix screens.**
Ship Jun 22 · Lane 1 · Effort L · W2 F1 $0.
Built with existing design tokens + shadcn components, desktop + mobile. Where a screen
needs live status (import/extraction state changing while Daniel watches), use the
broadcast-from-database realtime pattern Supabase now recommends, not polling. Done when:
both pages render real episode/guest data, screenshots rendered, tsc/eslint clean, draft
PR open.
Cite: answer 3A; ui-research briefs; Lane 1 resume prompt; CL-018 (realtime pattern).

**5.2 Production-urgency tracker (ui-daniel-homepage, part 1).**
Ship Jun 22 · Lane 1 · Effort M · W2 F2 $0.
DB-backed urgency surface in the dashboard (not forced onto the homepage). Mac Mail and
Apple Notes parts wait for the Mac worker (7.5). Done when: page renders, items sortable by
air-date pressure.
Cite: review-decisions ui-daniel-homepage + canon s13 dashboard-surfaces ruling.

**5.3 Episode drill polish + course m13 screenshot embed.**
Ship Jun 23 · Lanes 1 + 2 · Effort S-M · $0.
Done when: episode drill page screenshotted; m13 embeds the real direction; course JS still
validates. This also unblocks Lane 2's remaining step.
Cite: Lane 2 to-finish.

### Slice 6 - Data + sync backbone (Lanes 3, 4, 5) (Jun 22-27)

**6.1 Rundown Creator adapter (rides on proposal P1).**
Ship Jun 23 · Lane 4 · Effort M · W1 F2 $0 (and it permanently lowers every future RC item's F).
One module is the only thing allowed to talk to RC: wraps HTTP-200-error bodies, numeric
column ids, frozen/template write blocks, retries. Done when: existing `/api/rc-*` routes go
through it, tsc/eslint clean, a forced error surfaces correctly.
Cite: CL-006 (verified RC error behavior); discussion queue rc-adapter-pattern.

**6.2 RC script pull into `scripts`.**
Ship Jun 24 · Lane 4 · Effort M · W2 F4 (RC API quirks) · $0.
getScript per row -> scripts table, read-only, clean per-episode from Ep021 on. Done when:
script_text populated for >= 5 episodes, read-back verified, no write-back.
Cite: Lane 4 recipe.

**6.3 Season 3 backfill agent team (ops-season3-backfill-agents).**
Ship Jun 25 · Lane 3 · Effort M · $ ~2-5 per run (agent tokens).
Fill ep9-16 descriptions, eps 18+ rows as aired, early-episode rc_rundown_id mapping. Done
when: row-count and field-fill deltas reported; read-back verified; idempotent.
Cite: review-decisions BUILD; Lane 3 to-finish.

**6.4 Email cross-reference + 507-contact classification.**
Ship Jun 26 · Lane 3 · Effort L · F4 (email parsing is a known fragile entry point) · $ token cost.
Agent team classifies which of the remaining 332 contacts were approached AS GSR GUESTS
(vs other reasons) from the email archive + GSR-Email-Threads.numbers, then imports only
guest-relevant ones; do-not-contact flags carry "unverified" markers per the source-of-truth
map. Done when: classification sheet produced for Daniel's one-tap batch approve, then
guests row-count delta matches the approved list.
Cite: review-decisions guests-email-crossref-agents; canon s14 (classify first).

**6.5 2026 production schedule view (Basecamp read-only slice).**
Ship Jun 26 · Lane 5 · Effort M · W2 F3 · $0.
Tapings + air + webstream dates rendered in the dashboard from Basecamp (`PROD |` calendar
events only) + the airing schedule. Read-only; the full two-way sync stays deferred per the
roadmap. Hard prerequisite from verification: Basecamp OAuth tokens expire after TWO WEEKS,
so even this read-only view ships with the token-refresh loop (launchpad refresh_token
grant) or it dies quietly in 14 days. Per-project webhooks (10x retry) are the later
push-sync path. Done when: page renders the season calendar; refresh loop proven by a
forced-expiry test; zero Basecamp writes.
Cite: canon s12 Basecamp rulings; CL-021 (token expiry + webhooks, verified).

**6.6 Per-episode chyron-affiliation override on `episode_guests`.**
Ship Jun 24 · Lane 3 · Effort S · W1 F1 $0.
The flagged enhancement (Janzen case): migration + types + UI field so each appearance
carries its topic-relevant affiliation; feeds 1.5's three variations. Done when: migration
applied, advisors clean, Ep15 case representable without notes-field workarounds.
Cite: canon s12 affiliation ruling.

**6.7 YouTube RSS poller Edge Function.**
Ship Jun 27 · Lane 3 · Effort S-M · W1 F2 · $0 (RSS, no quota).
Hourly pg_cron poll of the channel feed; parses `S03, EpN`; flips `youtube_url` +
`youtube_published_at` from scheduled to actual. RSS costs zero API quota, and the upload
quota itself is no longer scarce (videos.insert now = 1 unit in a 100-uploads/day bucket);
the real distribution gate is the one-time Google API project audit, started early in
slice 4 era. Done when: function deployed, one real row flipped or a dry log proves the
match logic.
Cite: AUTOMATION_ROADMAP item 8 (priority high); CL-023 (quota flip + audit gate, verified).

**6.8 Guest email workflow UI (roadmap Phase 1A).**
Ship Jun 27 · Lane 3 · Effort M · W2 F1 $0.
Surface `v_episode_workflow` due dates (zoom link, pre-air, post-shoot, YouTube emails);
mark-sent buttons write timestamps. Done when: page renders computed due dates; a mark-sent
round-trips to `episode_guests`.
Cite: AUTOMATION_ROADMAP Phase 1A (schema ready).

### Slice 7 - Mac worker + transcription + metadata (Lane 12, new) (Jun 26 - Jul 1)

**7.1 Jobs table + Mac poller v1 (the control plane).**
Ship Jun 26 · Lane 12 · Effort M · W2 F2 $0.
Canon-locked shape: dashboard writes a job; the Mac polls Supabase, runs, writes status back;
no inbound connection to the Mac. Implementation refinement from verification: build it on
Supabase Queues (pgmq, the official pull-queue) exposed through the Data API with a
visibility timeout, instead of a hand-rolled table; same polling shape Daniel locked, but
durability, retries, and archival come free. Done when: a no-op test job round-trips
dashboard -> Mac -> status row; migration + RLS + types committed.
Cite: canon s12 job-transport ruling; CL-019 (Supabase Queues verified, pull-only).

**7.2 Diarized transcription (trans-diarization).**
Ship Jun 29 · Lane 12 · Effort L · W3 F3 · $0 (local).
WhisperKit + SpeakerKit per the canon registry (WhisperX honorable fallback), labeling
David, guests, AND the two correspondent segments (Viewer Voices, Featured Resource). Runs
as a job via 7.1. Done when: one real 58-min episode produces a diarized transcript with
all four speaker classes labeled, stored on the episode row.
Cite: review-decisions BUILD + canon s13 correspondent note; canon s12 tool registry;
CL-047 (WhisperKit v1.0.0 + SpeakerKit, repo-verified 2026-06-04; re-verify at build time).

**7.3 Title + timecode pipeline -> Supabase.**
Ship Jun 30 · Lane 12 · Effort M · W2 F2 · $ ~0.20 per episode (Claude titles).
Transcript -> segment cues -> 30%-shorter YouTube titles, written to the DB (NOT a Drive
sheet, per Daniel). Done when: one episode's segments + titles land in the DB; the
30%-shorter rule is enforced in the prompt + a length assert.
Cite: review-decisions meta-title-timecode-pipeline + canon s13 output ruling.

**7.4 Superstore live lookup (from spec 4.3).**
Ship Jun 30 · Lane 12 · Effort S · W1 F2 · $0 (scrape/search).
Done when: a guest/topic query returns real products with prices; a no-match returns
empty, never invented.
Cite: AUTOMATION_ROADMAP item 6.

**7.5 Mac Mail + Apple Notes surfaces (ui-daniel-homepage, part 2).**
Ship Jul 1 · Lane 12 · Effort M-L · W2 F3 · $0.
Via the jobs poller: Mac-side scripts read Mail + the rolling Notes to-do; dashboard renders
them. Read-only first. Done when: both render real data in the dashboard; zero writes to
Mail/Notes.
Cite: review-decisions ui-daniel-homepage (Mac Mail not Gmail); canon s13.

**7.6 Google Sheets write path (ops-sheets-mcp-gap).**
Ship Jul 1 · Lane 12 · Effort M · F3 · $0.
Pick and verify a cell-level Sheets write path for future Graphics Tracker sync; Composio
is out (known unreliable). Candidates already in hand: the native googleapis Node client,
and Daniel's own fork of the DuckDB Google-Sheets extension (djallen7/duckdb_gsheets, reads
AND writes Sheets) if a SQL-shaped path suits the tracker better. The verification IS this
item's deliverable (nothing unverified ships from it); any install is 8B-gated. Done when:
a test write to a scratch sheet round-trips; recommendation logged in the ledger.
Cite: review-decisions ops-sheets-mcp-gap; AUTOMATION_ROADMAP blockers table; verification
deliverable (resolved at build, ledger entry required).

### Slice 8 - Voice DNA + monologue intake (Lane 14, new) (Jun 30 - Jul 2)

**8.1 Voice DNA versioned Supabase table.**
Ship Jul 1 · Lane 14 · Effort S · W1 F1 $0.
Done when: migration + RLS + types committed; v1 row seeded from the existing voice profile.
Cite: review-decisions intake-voice-dna-supabase.

**8.2 Voice DNA 4 skills (interview segments only).**
Ship Jul 2 · Lane 14 · Effort M · $ token cost at use.
Scoped per Daniel: improve the interview setup specifically; pulls the same sources. Done
when: skills committed; one sample interview setup generated and checked against the
locked `gsr-interview-segment` format.
Cite: review-decisions scope note; canon s13 Voice DNA scope.

**8.3 Monologue 5-beat L3 arc, flexible.**
Ship Jul 2 · Lane 14 · Effort S-M · $ ~0.10 at use.
Encode the arc as guidance with explicit room for exceptions; monologue = 15 approved lower
thirds total. Done when: extraction/review surfaces the arc as suggestions, never a hard
block; the 15-count rule asserts in review.
Cite: canon s13 (arc acceptable only with flexibility; 15 L3s).

### Slice 9 - Social (Lane 15, new) (Jul 2-6)

**9.1 Content clips UI.**
Ship Jul 3 · Lane 15 · Effort M · W2 F1 $0.
Timecode in/out, verbatim quote, segment, platform fit; per-episode list. Schema is live.
Done when: a clip row round-trips through the UI.
Cite: AUTOMATION_ROADMAP (content_clips ready); review-decisions social-clips-social-ui.

**9.2 Social posts UI.**
Ship Jul 6 · Lane 15 · Effort M · W2 F1 $0.
Captions, hashtags, platform + type, schedule/mark-posted; FK to clips + episodes. Done
when: a post row round-trips; links to a clip.
Cite: same.

### Slice 10 - ProPresenter test-machine track (Lane 13, new) (Jun 27 - Jul 9)

All of this is test machine only until the live-rig design doc + Daniel's in-the-moment
yes path (canon s15). Nothing here touches GSN-PropRes.

**10.1 Thumbnail-export feasibility verify (gates 10.3).**
Ship Jun 27 · Lane 13 · Effort S · $0.
Can ProPresenter export slide thumbnails programmatically? Live-test on the test machine
against the official HTTP API (openapi.propresenter.com). Verification already settled the
surface: the official API covers trigger/status/props/looks/macros/timers/clear-layer with
chunked-HTTP status streaming, and the product's version era is now ProPresenter 17+
subscription, so FIRST record the test machine's exact version and pin it in the ledger.
Done when: version pinned + a thumbnail yes/no with evidence is in the ledger.
Cite: discussion queue QA note; CL-022 (official API surface + version era, verified).

**10.2 ProPresenter pre-population from the Graphics Tracker.**
Ship Jul 7 · Lane 13 · Effort L · W2 F3 · $0.
Tracker rows -> test-machine playlist/slides. Done when: a sample episode's tracker rows
appear as slides on the test machine; a re-run is idempotent.
Cite: review-decisions pp-prepop-from-tracker; canon s14 (preproduction only) + s15.

**10.3 ProPresenter QA verification screen.**
Ship Jul 9 · Lane 13 · Effort M-L · W2 F4 (rides on 10.1) · $0.
Slide screenshots displayed next to the linked graphic/L3 record for human verification
before tape. Done when: screen renders real thumbnails beside DB rows for one episode.
Cite: canon s14 QA ruling.

**10.4 Live-rig wiring design doc (s15-authorized path).**
Ship Jul 9 · Lane 13 · Effort M · $0.
Design (not yet wire) the GSN-PropRes control path including Tailscale for this path only:
dry-run -> show what will fire -> wait for Daniel's in-the-moment yes, per action, not
waivable. Critical design input from verification: the ProPresenter API has NO server-side
dry-run mode, so the dry-run layer is OURS to build (read-only GET verification of the
exact target + a show-before-fire preview), and it must exist before any live wiring.
Includes a /security-review pass. Done when: design doc committed; red-team pass recorded;
nothing executed against the live rig.
Cite: canon s15 ProPresenter authorization; CL-022 (no dry-run mode in the API, verified).

---

## 4. Gated on Daniel's two working sessions (proposed week of Jun 22)

**Graphics-decisions session (30-45 min)** unlocks: graphics-ai-gen-rules (the 1,737-graphic
archive + tracking-archive philosophy scan, monologue + interview attention),
graphics-request-template + image-gen feasibility, MOGRT scope. Builds land ~Jul 3 after
the session. Cite: canon s13 "needs a working session"; s14 graphics block.

**Segment-timing session (30-45 min)** unlocks: the 58:00 runtime calculator (3000s baseline
+ ~480s segue/transition budget, per-segment targets adjusted) and resolves C-14 (run-of-show
tease rows) in the same sitting. Build is S once numbers exist; lands ~Jul 3.
Cite: canon s13 + s14 timing notes; conflicts table C-14.

---

## 5. Already shipped (do not re-plan) and parked

**Shipped via the 2026-06-08 easy-builds chain (verified in-repo today):**
guest corrections/do-not-book reference; guest topic-brief template; intro-writing rule
(Phenomenon Before Term); pre-air email YouTube purge (Template 5); 1,000-hours purge
(no-op in repo, remaining instances are Daniel-side pitch docs); git training (course m0 +
cheatsheet); booking frameworks captured (promotion to canon = 4.2); ADRs 0004-0006 authored
with 0007-0008 closed as never-real decisions; Season 3 = 48 confirmed in DB.

**Parked (the 9 LATER items, for the record):** push-once fan-out; CBN + Daystar (blocked,
no specs); CCB single-location ingestion; Fireside->Transistor + StreamHoster->Cloudflare
swaps; role-scoped three-frontend dashboards (explicit preconditions stand); per-guest tone
calibration (guest profiles will be the source); post-air analytics loop; Wonders Center
curriculum (separate project); CTN/WWN schema (separate project).

---

## 6. Proposals (DISCUSS queue) - each decision-ready, recommendation marked

**P1. Rundown Creator adapter (rc-adapter-pattern).** RC is a single fragile vendor: errors
arrive as HTTP 200, columns are numeric ids, frozen rundowns silently block writes. One
adapter module becomes the only code allowed to talk to RC, so when RC changes or breaks we
fix one file, not every feature. You flagged this one ASAP yourself. **Recommend: YES, build
first in slice 6 (6.1) before any more RC automation.**

**P2. Transcription: buy vs build (trans-decision-a).** Buying (a paid API) is easy but
recurring cost plus an upload step for 58-minute masters every week. Building local
(WhisperKit + SpeakerKit on the Mac, already the canon registry pick) is free, private, and
the jobs poller gives it a clean trigger; the cost is one setup day. **Recommend: BUILD
local (7.2); revisit only if correspondent-segment diarization quality fails on the first
real episode.**

**P3. Operator runbook.** A one-page "when X breaks, do Y" for running the system under
deadline. Genuinely valuable, but only once the system is in real weekly use, and you said
you want to see the value first. **Recommend: YES, but write it the week after slice 7
ships (target Jul 8), seeded from whatever actually broke during slices 1-7.**

**P4. Standalone HTML tools sprawl (ui-static-html-sprawl).** You have scattered HTML tools
(GSN dashboard, RLN upload hub, guest-picker, Monday Tasks) each saving its own data.
**Recommend: fold guest-picker + Monday Tasks into the dashboard during slice 5; keep
lanes.html standalone on purpose (it must work on a phone with no server); retire the rest
unless you name one you still use.**

**P5. STATUS.md session-state trigger (ops-status-md-trigger).** A file each session reads
at start and rewrites at end. The lanes system + Mission Control (slice 2) already do
exactly this job, shared across sessions instead of one file. **Recommend: NO separate
STATUS.md; anti-churn says no parallel tracker. Close the item when slice 2 ships.**

**P6. Kanban / gallery / timeline L3 views.** Three alternate views of the lower-thirds
queue. The three-column comparison view (1.6) plus the ready queue covers review today.
**Recommend: SKIP for now; revisit after three real weekly cycles tell us what view you
actually reach for.**

**P7. Five L3 quality tests before approval.** A 5-point checklist per lower third.
**Recommend: YES as soft warnings only (1.7), never hard blocks, so an exception never
requires a workaround on tape day.**

**P8. AI graphics request template + image-gen feasibility.** **Recommend: decide inside
the graphics-decisions session; do not pre-commit.** The philosophy scan output should
shape the template, not the other way around.

**P9. MOGRT template set.** Animated lower-thirds templates would change the ProPresenter
hand-paste workflow. Worth Isaac's input on layer limits and render flow. **Recommend:
graphics-decisions session, with Isaac's constraints in the room (even as notes).**

**P10. 58:00 runtime calculator button.** Needs your real per-segment targets and a
segue/transition budget (~480s) first. **Recommend: 30-minute segment-timing session, then
it is a small build; resolve C-14 (tease rows) in the same sitting.**

**P11. Live ASR -> ProPresenter lower thirds.** Live speech-to-text driving on-air text is
the highest-stakes item on the list (it lands on David if it misfires). **Recommend: DEFER
until the QA screen (10.3) and the live-rig confirm path (10.4) are proven; it is also tied
to your live photo/b-roll sourcing idea, which deserves its own design pass.**

**P12. L3 ordering fields.** Already settled: Build Task 1 locked `segment_order`,
`l3_type_order`, `line_number` into the rename migration (PR #50). **Recommend: no
discussion needed; confirm the columns exist post-merge (slice 0.2).**

**P13. Cline rules file (ops-clinerules).** Only relevant if you use the Cline tool, which
you do not. **Recommend: SKIP.**

**P14. gsr-research repo hygiene.** Your booking repo has no handoff docs and no
branch-and-PR safety net. Low effort, prevents the exact context-loss this repo solved.
**Recommend: YES (4.6).**

**P15. Kilauea "Episode 48" wording.** You believe it is a count of past eruptive events,
framed as record-breaking, and asked to be fact-checked. **Recommend: YES, verify against
the article before it is used on air (4.4); send the article link if you have it handy,
otherwise we find it.**

**P16. RC token rotation (sec-rotate-rc-token).** You marked this skip, and that is your
call to keep. Honest flag anyway: that token appeared in a past chat, which makes it a
standing credential exposure, and rotation is a five-minute task. **Recommend: rotate once,
log in 1Password, close forever.**

---

## 7. Decisions only Daniel can make

1. **Merge the PR stack: #47, then #50, then #52.** Everything in slice 1 waits on it, and
   merging closes the live schema-skew window (deployed code currently queries a table that
   no longer exists; zero data at risk, but the pages error). Recommend: this week.
2. **The one-tap install batch (8B), each individually yes/no:** (a) ccusage - weekly cost
   lens, local-only; (b) claude-devtools - session forensics, zero outbound network;
   (c) ergut remote transcript MCP - may let CLOUD sessions mine YouTube transcripts (the
   big R1 unblock; live-tested reachable today); (d) jkawamoto local transcript MCP for
   your Mac; (e) supabase/agent-skills + vercel-labs/next-skills - first-party instruction
   files, near-zero risk; (f) commit-commands official plugin. Recommend: yes to all six.
   Agent View itself is built-in (no install) - just adopt the /bg backgrounding habit.
3. **RC adapter (P1): yes/no.** Gates slice 6. Recommend: yes.
4. **Transcription buy vs build (P2).** Gates slice 7's shape. Recommend: build local.
5. **Calendar: pick two 30-45 minute working sessions** (graphics decisions; segment
   timing), proposed week of Jun 22. They unblock the section-4 builds.

One owner ACTION, not a decision: tap send on the drafted Rumble email (4.1).

---

## 8. Gates (canon s15, restated; these survive every item above unchanged)

- **QNAP is read-only SMB. Never write to it. No exceptions, no carve-outs**, including
  inside any loop, goal, or unattended run.
- **Never act on stale info.** Pull latest branch state first; verify claims against
  current sources before acting on them.
- **ProPresenter live rig:** designing and wiring control of GSN-PropRes is authorized,
  Tailscale included for that path, but test machine first, and **every action against the
  LIVE rig needs a human yes in the moment: dry-run, show exactly what will fire, wait.**
  Not waivable, ever.
- **Lower-thirds bulk import keeps its Type-YES gate:** `/api/import` dry-run first, counts
  shown, explicit YES before any live write. The auto-extract path stays gated the same way
  (`app_config.auto_extract_apply` defaults false).
- **Credentials only via 1Password CLI / env.** Never paste a secret into chat or a file;
  reference items by 1Password name only.
- **No skill/plugin/MCP installs without Daniel's one-tap yes (answer 8B).** Candidates are
  proposed in the ledger with risk notes; nothing that exfiltrates data or wants credentials
  outside 1Password is ever proposed.
- **Goals and loops never bypass a confirmation gate.** A loop may PREPARE a live action, a
  bulk import, or anything irreversible, then it stops and waits for the in-the-moment yes.
- **Every decision Daniel makes is appended to canon, dated**, so he is never re-asked; his
  word beats any doc.
- **Questions to Daniel are batched** (max 4 at a time, recommended defaults marked);
  proceed on defaults when he is away and log the assumption.

---

## 9. Lane updates for lanes.json (listed here; lanes.json is NOT edited by this draft)

New lanes to add when the plan is approved:

- **Lane 10 - Lower-thirds vertical slice.** Summary: build slice 1 on
  `production_lower_thirds` after the PR stack merges: Intro Graphic migration, 55-70
  validator, first Type-YES import, 3-variation regenerate, three-column view. Resume
  prompt: `Read docs/_handoff/LANES.md (Lane 10) and docs/_handoff/2026-06-11-pipeline-build-plan.md slice 1. Confirm PR #47/#50/#52 are merged and deployed (do not start otherwise). Work the slice items in order on a feat/ branch; tsc + eslint clean; draft PR; the import step requires Daniel's Type-YES after a dry-run. Update LANES.md as you go.`
- **Lane 11 - Mission Control + standing loops.** Summary: sessions block in lanes.json +
  lanes.html panel, nightly/CI/ledger/refresh loops, adopt-set proposals (8B), ADR. Resume
  prompt: `Read docs/_handoff/LANES.md (Lane 11) and the build plan slice 2. Build the sessions summarizer against ~/.claude/projects JSONL (Agent SDK list_sessions if available), extend tools/build_lanes.mjs to render it, wire the standing loops, and keep installs proposal-only per 8B. Never bypass canon s15 gates from a loop.`
- **Lane 12 - Mac worker + transcription/metadata.** Summary: jobs table + Mac poller
  control plane, diarized transcription (incl. the 2 correspondent segments), title +
  timecode pipeline to Supabase, superstore lookup, Mac Mail/Notes surfaces, Sheets write
  path. Resume prompt: `Read docs/_handoff/LANES.md (Lane 12) and the build plan slice 7. Build 7.1 (jobs table + poller) first; everything else rides on it. Heavy work runs on the Mac via polling; no inbound connections; QNAP stays read-only.`
- **Lane 13 - ProPresenter test-machine track.** Summary: thumbnail feasibility, tracker
  pre-population, QA screen, live-rig design doc under s15 gates. Resume prompt: `Read docs/_handoff/LANES.md (Lane 13), the build plan slice 10, and canon s15. Test machine only; run 10.1 feasibility first; the live rig gets a design doc, not commands; every future live action needs Daniel's in-the-moment yes.`
- **Lane 14 - Voice DNA + monologue intake.** Summary: versioned voice table, 4 interview
  skills, flexible 5-beat arc + 15-L3 rule. Resume prompt: `Read docs/_handoff/LANES.md (Lane 14), the build plan slice 8, GSR_VOICE_PROFILE.md, and canon s13's Voice DNA scope (interview segments only). Build the table, then the skills, then the arc as soft guidance.`
- **Lane 15 - Social clips + posts UI.** Summary: content clips UI then social posts UI on
  the live schema. Resume prompt: `Read docs/_handoff/LANES.md (Lane 15) and the build plan slice 9. Build clips first, posts second, matching slice 5's UI patterns; tsc + eslint clean; draft PR.`

Edits to existing lanes on approval: Lane 8's BUILD TASK 1 is absorbed by PR #50/#52 (mark
done on merge; keep the standing standards work); Lane 6 unblocks at slice 0 and closes with
1.3; Lane 1 absorbs slice 5; Lane 4 absorbs 6.1-6.2; Lane 5 absorbs 6.5; Lane 3 absorbs 6.3,
6.4, 6.6, 6.7, 6.8; Lane 9 stays open through the mission's end (slice 3 + addendum v2).

---

## 10. What happens to this draft next

1. Research agents land -> fill every `[CITE: pending]` slot or strike the item (nothing
   ASSUMED ships).
2. Critique round 1: red team (where does it break, what lands on David, what violates canon).
3. Critique round 2: gsr-health vs actual repo state.
4. Critique round 3: gsr-editorial for phone-readability.
5. Rubric 7/7, then the one-screen summary + section 7 decisions go to Daniel.
