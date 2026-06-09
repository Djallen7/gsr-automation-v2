# Easy-Builds Chain (from the 2026-06-08 review)

Daniel asked for a chain of tasks through the **easy** builds from the 90-item review. "Easy" here = reference / skill / template / safe-cleanup deliverables that need no input from Daniel and do not touch the live DB or production infra. Dashboard UI features and schema migrations are deliberately NOT in this chain; they wait for the UI-foundation decision and the course rebuild so they are not built twice.

Source of decisions: `export-archaeology-backlog.json` (daniel_decision == "build") and `2026-06-08-review-decisions.md`.

Status key: DONE · NOW (in progress this session) · QUEUED (I can do next, no input) · NEEDS-YOU (blocked on a quick input from Daniel) · COVERED (already exists).

| # | Build item | Status | Notes |
|---|---|---|---|
| 1 | Guest Corrections / Do-Not-Book / routing reference | DONE | `GUEST-CORRECTIONS.md`, linked from canon. |
| 2 | Pin README to Next.js 16.2.6 | DONE | Version drift otherwise already resolved. |
| 3 | Guest topic-brief HTML template (guests-topic-brief) | DONE | `guest-topic-brief-template.html`, GSR blue, fillable, print/PDF friendly, clickable sources. |
| 4 | Intro-writing rules reference (intake-intro-writing-skill) | QUEUED | Append to the existing voice doc (`GSR_VOICE_PROFILE.md`) rather than a new file, to avoid duplication. Core rule: establish the phenomenon, then name/explain the term, then reveal the hook, then the guest; never use a term without explaining it first. |
| 5 | creationsuperstore.com product lookup (meta-superstore-lookup) | QUEUED | Spec a small lookup (guest/topic -> matching products) so on-air plugs are never fabricated. Prototype as a skill/spec; real fetch later. |
| 6 | GSN "1,000 hours" -> "270 + short-form" purge (sec-gsn-1000-hours-purge) | CHECK | In-repo, the only matches are in archaeology RECORDS (correctly documenting the conflict); the live stale instances are in your pitch / David-signed docs, which are your side. No repo edit needed unless a real claim is found. |
| 7 | Pre-air email "no YouTube" rule (dist-pre-air-no-youtube) | COVERED + NEEDS-YOU | Already enforced in `EMAIL_TEMPLATES.md` (Template 5 keeps the static YouTube link out; Template 6 is the post-air link). The "merge updated platform info" half edits guest-facing copy, so confirm the exact current consumer platform wording (Roku / Apple TV / iOS app / LG / genesissciencenetwork.com) before I touch it. |
| 8 | Booking frameworks to canon (guests-frameworks-to-canon) | NEEDS-YOU | Named + scaffolded in `GUEST-CORRECTIONS.md` section 5 (40/40/15/5 mix, Five-Point Stakes, four hook types, Barentine Test, accessibility tiers). Paste the full definitions from the interview-research project and I promote the stable ones into canon. |
| 9 | Git basics for Daniel (ops-git-training) | COVERED | Course m0 (Orientation + GitHub) + `GIT_CHEATSHEET.md` cover it. Optional: a tiny "you review PRs, Claude types the commands" primer if you want it. |
| 10 | Author ADRs 0004-0008 (conflict-phantom-adrs) | NEEDS-YOU | Those numbers never existed (per SYSTEM-EVOLUTION). Confirm the 3 real decisions (master-metadata, Dropbox-no-metadata, AI-metadata-needs-approval) and I author fresh records, correctly numbered. |

## Not in this chain (await UI foundation / course rebuild / a working session)
lt-three-column-view, ui-daniel-homepage, social-clips-social-ui, meta-title-timecode-pipeline, pp-prepop-from-tracker, trans-diarization, intake-voice-dna-skills, intake-voice-dna-supabase, ops-season3-backfill-agents, graphics-ai-gen-rules (graphics session), conflict-graphics-table-name (migration plan), dist-rumble-api (email, your side).

## How to resume this chain
Read this file, pick the next QUEUED item, build it as a doc/skill/template only (no live DB, no production infra, honor the David Rule), commit, and flip its status here. NEEDS-YOU items unblock as Daniel provides the noted input.
