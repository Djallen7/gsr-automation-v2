# Easy-Builds Chain (from the 2026-06-08 review)

Daniel asked for a chain of tasks through the **easy** builds from the 90-item review. "Easy" here = reference / skill / template / safe-cleanup deliverables that need no input from Daniel and do not touch the live DB or production infra. Dashboard UI features and schema migrations are deliberately NOT in this chain; they wait for the UI-foundation decision and the course rebuild so they are not built twice.

Source of decisions: `export-archaeology-backlog.json` (daniel_decision == "build") and `2026-06-08-review-decisions.md`.

Status key: DONE · NOW (in progress this session) · QUEUED (I can do next, no input) · NEEDS-YOU (blocked on a quick input from Daniel) · COVERED (already exists).

| # | Build item | Status | Notes |
|---|---|---|---|
| 1 | Guest Corrections / Do-Not-Book / routing reference | DONE | `GUEST-CORRECTIONS.md`, linked from canon. |
| 2 | Pin README to Next.js 16.2.6 | DONE | Version drift otherwise already resolved. |
| 3 | Guest topic-brief HTML template (guests-topic-brief) | DONE | `guest-topic-brief-template.html`, GSR blue, fillable, print/PDF friendly, clickable sources. |
| 4 | Intro-writing rules reference (intake-intro-writing-skill) | DONE (covered) | `GSR_VOICE_PROFILE.md` already covers intro-writing (host intro opens on the topic not the guest, concrete-image-first, every term immediately defined). Added the one missing explicit rule as Part 5 technique #10 "Phenomenon Before Term." No duplicate doc created. |
| 5 | creationsuperstore.com product lookup (meta-superstore-lookup) | QUEUED | Spec a small lookup (guest/topic -> matching products) so on-air plugs are never fabricated. Prototype as a skill/spec; real fetch later. |
| 6 | GSN "1,000 hours" -> "270 + short-form" purge (sec-gsn-1000-hours-purge) | DONE (no-op in repo) | Verified: the only in-repo matches are archaeology records + the correction note itself, no live stale claim. The real instances are in your pitch / David-signed docs (your side). |
| 7 | Pre-air email "no YouTube" rule (dist-pre-air-no-youtube) | COVERED + NEEDS-YOU | Already enforced in `EMAIL_TEMPLATES.md` (Template 5 keeps the static YouTube link out; Template 6 is the post-air link). The "merge updated platform info" half edits guest-facing copy, so confirm the exact current consumer platform wording (Roku / Apple TV / iOS app / LG / genesissciencenetwork.com) before I touch it. |
| 8 | Booking frameworks to canon (guests-frameworks-to-canon) | DONE | Recovered the full text from the export (interview-research project) and wrote it into `GUEST-CORRECTIONS.md` section 5: 40/40/15/5 mix, the full Five-Point Stakes Assessment, the four hook types, accessibility/worldview tags, and the Barentine Test. No input from Daniel was needed after all. |
| 9 | Git basics for Daniel (ops-git-training) | COVERED | Course m0 (Orientation + GitHub) + `GIT_CHEATSHEET.md` cover it. Optional: a tiny "you review PRs, Claude types the commands" primer if you want it. |
| 10 | Author ADRs 0004-0008 (conflict-phantom-adrs) | NEEDS-YOU | Those numbers never existed (per SYSTEM-EVOLUTION). Confirm the 3 real decisions (master-metadata, Dropbox-no-metadata, AI-metadata-needs-approval) and I author fresh records, correctly numbered. |

## Not in this chain (await UI foundation / course rebuild / a working session)
lt-three-column-view, ui-daniel-homepage, social-clips-social-ui, meta-title-timecode-pipeline, pp-prepop-from-tracker, trans-diarization, intake-voice-dna-skills, intake-voice-dna-supabase, ops-season3-backfill-agents, graphics-ai-gen-rules (graphics session), conflict-graphics-table-name (migration plan), dist-rumble-api (email, your side).

## How to resume this chain
Read this file, pick the next QUEUED item, build it as a doc/skill/template only (no live DB, no production infra, honor the David Rule), commit, and flip its status here. NEEDS-YOU items unblock as Daniel provides the noted input.
