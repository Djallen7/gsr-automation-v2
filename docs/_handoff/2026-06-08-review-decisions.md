# GSR Findings Review — Daniel's Decisions (2026-06-08)

Daniel triaged all 90 export-archaeology backlog items + 14 conflicts in the
review artifact. This file is the durable, authoritative record. Per the
Authority rule, these decisions are gospel and supersede any earlier doc; the
now-settled facts are also appended to `GSR-WORKFLOW-CANON.md` (dated).

Decision key: BUILD = put in the plan now · LATER = park for a later phase ·
SKIP = drop / no action · DISCUSS = needs a working session before deciding.

---

## Now-gospel facts settled by this review (also in canon)

- **YouTube category = 28 (Science & Tech).** YouTube allows only ONE category per video, so 28 it is (cannot "add both").
- **Lower-thirds length: 55 minimum, 70 maximum, 60-65 sweet spot.** This RAISES the old 65 ceiling to 70. Topic L3 stays 60-65.
- **Standardize "Intro Graphic" across the entire system; eliminate "Title Graphic."** They mean the same thing. The Graphics Tracker, the DB graphic-type list, PROMPT_LIBRARY, and the course all move to "Intro Graphic."
- **Chyron is not a fixed field order.** Build 3 variations per guest that each highlight whatever credential/affiliation adds the most relevance and credibility for that episode's specific topic. Draw from past examples.
- **"THD" = The Heavens Declare** (the on-air segment). The "That's a Fact" reading is wrong.
- **GSN content figure = 270 hours long-form + hundreds of short-form fillers.** Purge every "1,000 hours" remnant.
- **Season 3 = 48 episodes** (confirmed). **Next.js = 16.2.6** (confirmed; fix ADR-0012 text).
- **"GSR has no graphics" = a legacy monologue-copy rule only** (monologue copy must stand on the ear); not a claim the show lacks graphics.
- **Lower thirds get their own table, separate from the graphics tracker** (`production_graphics`). Plan a clean migration; do not conflate the two systems.
- **Ming Wang, June 15: 9:30 arrival, 10:00 film time.**
- **Monologue = 15 approved lower thirds total.**
- **Voice DNA work is scoped to GSR interview segments only** (specifically improving the interview setup), pulling from the same sources.
- **Title + timecode pipeline outputs to the Supabase DB, not a Google Drive sheet.**
- **Diarization must handle the 2 correspondent segments** (Viewer Voices, Featured Resource) in addition to David + guests.
- **Guest profiles become the source of tone adaptation** (drives outreach voice).
- **Dashboard must include (not forced onto the homepage): email via the Mac Mail app, a production-urgency tracker, and a rolling Apple Notes to-do.**

---

## Conflicts — resolved

| # | Conflict | Decision | Note |
|---|---|---|---|
| C-1 | YouTube category | 28 Science & Tech | YouTube allows one category only; "use both" not possible |
| C-2 | L3 line length | 55 to 70 band | 60-65 sweet spot, down to 55, up to 70 |
| C-3 | Topic L3 length | 60 to 65 | |
| C-4 | First monologue graphic name | Intro Graphic (system-wide) | Eliminate "Title Graphic" everywhere; edit the tracker |
| C-5 | Chyron field order | 3 topic-relevant variations | Highlight the most relevant credential per episode topic |
| C-6 | GSN content figure | 270 hours + short-form | Purge "1,000 hours" |
| C-7 | Next.js version | 16.2.6 | Fix ADR-0012 |
| C-8 | Lower-thirds table | Add a separate lower_thirds table | Keep `graphics` live name; separate the two systems cleanly |
| C-9 | Season 3 count | 48 | |
| C-10 | Phantom ADRs 0004-0008 | Author the missing ADRs | Content is real |
| C-11 | "THD" meaning | The Heavens Declare (segment) | |
| C-12 | Ming Wang June 15 | 9:30 arrival, 10:00 film | Corrects both options |
| C-13 | "GSR has no graphics" | Legacy monologue-copy rule only | |
| C-14 | Run-of-show tease rows | UNDECIDED, circle back | |

---

## Findings — verbatim decisions

(Source: review.html export, 2026-06-08 23:53. Ids match `export-archaeology-backlog.json`.)

### BUILD / KEEP
- **intake-voice-dna-skills** — Voice DNA 4 skills. Note: pull from same sources but used only for GSR interview segments, specifically to improve interview setup.
- **intake-voice-dna-supabase** — Voice DNA as a versioned Supabase table.
- **intake-intro-writing-skill** — Intro-writing rules skill (introduce topic before the term).
- **lt-three-column-view** — Three-Column Comparison L3 view (Primary | Var 1 | Var 2).
- **graphics-ai-gen-rules** — AI graphic-generation rules from the 1,737-graphic archive. Note: Intro graphic not title graphic; also build a similar, trickier rule guide for monologue graphic suggestions.
- **pp-prepop-from-tracker** — ProPresenter pre-population from the Graphics Tracker.
- **trans-diarization** — WhisperX diarization. Note: tweak to include the 2 correspondent segments (Viewer Voices, Featured Resource).
- **meta-title-timecode-pipeline** — Timecode + YouTube title pipeline. Note: output to Supabase DB, not a Drive sheet.
- **meta-superstore-lookup** — creationsuperstore.com product lookup.
- **dist-pre-air-no-youtube** — Pre-air email must not mention YouTube. Note: merge with updated platform info.
- **dist-rumble-api** — Rumble API approval request.
- **ui-daniel-homepage** — Daniel homepage elements. Note: include email (Mac Mail, not Gmail), production-urgency tracker, rolling Apple Notes to-do in the dashboard, but do not force them onto the homepage.
- **ops-git-training** — Git basics training for Daniel.
- **ops-sheets-mcp-gap** — Google Sheets cell-level write MCP gap.
- **ops-season3-backfill-agents** — Season 3 backfill subagent team.
- **guests-frameworks-to-canon** — Guest mix 40/40/15/5 + Five-Point Stakes + hook types + accessibility tiers into canon.
- **guests-blacklist-corrections** — Guest do-not-book / deceased / correction list.
- **guests-topic-brief** — HTML/PDF guest topic brief as a standard deliverable.
- **guests-email-crossref-agents** — Email cross-reference agent team vs GSR-Email-Threads.numbers.
- **social-clips-social-ui** — Content clips UI -> social posts UI.
- **sec-gsn-1000-hours-purge** — Purge the stale "1,000 hours" GSN figure.
- **conflict-graphics-table-name** — Add a separate lower thirds table.
- **conflict-episode-count** — Season 3 = 48.
- **conflict-phantom-adrs** — Author the missing ADRs.

### LATER
- **dist-push-once** — Push-once / upload-everywhere fan-out.
- **dist-cbn-daystar-blocked** — CBN + Daystar (blocked, no delivery specs).
- **dist-ccb-single-location** — CCB Marketing single-location metadata ingestion.
- **dist-vendor-swaps** — Fireside->Transistor, StreamHoster->Cloudflare Stream.
- **ui-three-frontend** — Role-scoped dashboards (Daniel/Miryam/Isaac).
- **guests-comm-styles-v3** — Per-guest tone calibration. Note: build guest profiles to be the source of tone adaptation.
- **social-analytics-loop** — Post-air analytics feedback loop.
- **sep-wonders-center-curriculum** — Wonders Center Curriculum Program (separate project).
- **sep-ctn-wwn-schema** — CTN / WWN schema (separate project).

### SKIP / DROP
- intake-thd-corpus-scan; intake-script-automation-doc; intake-task-trigger-files; intake-nlp-cue-placement; lt-jakob-approve-regenerate; lt-recorded-state; lt-mr-cta-before-verbal; all RC gotchas (rc-errors-http200, rc-numeric-column-ids, rc-isplaintext-false, rc-lastline-forward-cue, rc-frozen-blocks-writes, rc-template-archived-trap, rc-createrundown-bug, rc-insert-blank-then-update, rc-stale-read-cache, rc-list-endpoints-crash, rc-mcp-timeout-rawapi, rc-segues-main-rundown); data-youtube-rss-poller; ops-archaeology-py; guests-applescript-mail-drafts; sec-rotate-rc-token; conflict-l3-char-band; conflict-chyron-field-order; conflict-gsn-hours; sep-gsn-campaign; sep-genesis-apologetics-film; excluded-legal-research.
  - Note: most SKIPs are already-built RC rules (no action needed) or duplicates of conflicts already resolved above.

### DISCUSS (need a working session)
- **lt-bulk-create-package** — Create Episode L3 Package bulk action.
- **lt-kanban-gallery-timeline** — Kanban + Gallery + Timeline L3 views.
- **lt-5-quality-tests** — 5 L3 quality tests before approval.
- **lt-monologue-5beat-arc** — Note: open to it if it leaves room for flexibility/exceptions; monologue = 15 approved lower thirds total.
- **graphics-archive-philosophy-scan** — Note: combine with the graphics-tracking archive (past monologue + interview graphics); needs Daniel's guidance. **Schedule a graphics-decisions session.**
- **graphics-request-template** — AI graphics request template + image-gen feasibility.
- **graphics-mogrt-set** — MOGRT template set.
- **rc-adapter-pattern** — RC single-vendor dependency -> adapter pattern.
- **rc-runtime-58min-button** — Note: needs a detailed segment-timing breakdown; pull details and discuss.
- **pp-thumbnail-verification** — ProPresenter thumbnail trust-verification before tape.
- **pp-live-asr-lower-thirds** — Live ASR -> ProPresenter lower thirds.
- **pp-tailscale-mcp-superseded** — ProPresenter Tailscale MCP (note: Tailscale is off-limits; flag).
- **trans-decision-a** — Buy vs build transcription.
- **meta-kilauea-edit** — Note: "Episode 48" likely refers to a stat in the article about past volcanic activity; confirm and circle back.
- **dist-signiant-form-autofill** — Note: explore alternatives if prefilled forms are not enabled on the RLN form.
- **ui-gfx-cue-pipeline** — 8-phase <gfx>-cue dashboard pipeline.
- **ui-static-html-sprawl** — Fold the standalone HTML tools into the dashboard.
- **data-507-contact-import** — Bulk-import the remaining 332 contacts.
- **data-l3-ordering-fields** — L3 ordering fields (Segment Order, L3 Type Order, Line #).
- **ops-status-md-trigger** — Note: open to it, wants to understand benefits/issues.
- **ops-operator-runbook** — Operator Runbook + Session Recovery tracker.
- **ops-clinerules** — Cline .clinerules.
- **ops-gsr-research-handoff** — gsr-research handoff docs + branch-and-PR default.
- **ops-sessionstart-hook-bug** — Fix the malformed SessionStart hook.
- **social-shortform-opusclip** — Short-form repurposing (OpusClip).

---

## Open / circle-back

- **C-14 run-of-show interview-tease row map** — undecided; revisit.
- **meta-kilauea-edit** — confirm what "Episode 48" refers to.
- **sec-rotate-rc-token** — marked Skip by Daniel; noted (token was exposed in a past chat). Reminder stands if not already rotated.
