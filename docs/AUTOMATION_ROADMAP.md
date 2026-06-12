# Automation Roadmap

*Cross-reference of archaeology-surfaced candidates against the existing project plan. Updated 2026-05-28.*

---

## Two separate pipelines

`PROJECT_PLAN.md` covers **distribution automation** — moving finished episode files to YouTube, Dropbox, Rumble, Fireside, etc. That work is still valid but predates ADR-0012 (Supabase pivot); the n8n/SQLite architecture described there has been superseded by the Next.js + Supabase dashboard.

The archaeology surface almost entirely **production automation** — the upstream work that happens before an episode is finished: guest research, script writing, lower thirds, outreach. These two pipelines are largely orthogonal. The overlap is only in the metadata/titles step.

---

## Production automation candidates

Ranked by estimated friction-reduction per hour of build work.

### 1. ~~Guest last-aired tracker~~ ✓ DONE (2026-05-28)
~~A structured record of every guest's most recent air date + expertise tags + communication style rating.~~
**`guests` table** with expertise, is_yec, communication_notes + **`episode_guests`** table with booking_status and filming history is now live in Supabase. Dashboard UI shipped as the `/workflow` page (Phase 1A below, done).

### 2. ~~Lower thirds character-count checker~~ ✓ DONE (2026-05-28)
~~Auto-flag any L3 line that exceeds 65 characters before the full package is delivered.~~
**Implemented in `apps/dashboard/src/app/lower-thirds/graphic-card.tsx`** — amber warning at <55 chars (too short), soft amber over 65 (sweet spot 60-65), hard ceiling 70 (canon s13, PR #52) (over limit). Full 55–65 character range enforced in the review UI.

### 3. Monthly interview package compiler
**What it is:** At the start of each month, pull guest emails + spreadsheet entries + Apple Notes schedule + article links into one formatted document.  
**Why it matters:** Repetitive manual assembly task at the start of every filming cycle.  
**Build path:** Apps Script triggered on a date, reading Drive + the guest tracker.  
**Effort:** Medium. Depends on reliable Drive access (known to be fragile — GSR Shared Folder blocks writes).

### 4. Segment timecode + YouTube title pipeline
**What it is:** Ingest transcript → parse segment cues → generate 30%-shorter titles → write to Drive spreadsheet.  
**Why it matters:** AI repeatedly forgot the 30%-shorter rule in the YouTube titles category (59+ conversations). Automating bakes the rule in.  
**Build path:** Python script or n8n workflow triggered on transcript completion.  
**Effort:** Medium. Whisper transcription is already in the original Phase 1 plan; title generation is additive.

### 5. News-story → angle mapper
**What it is:** Given a guest's expertise tags, return recent creation-science-relevant news stories with suggested interview angles.  
**Why it matters:** Guest research is the largest category (298 conversations, 34% of all volume). Even partial automation of the research-to-angle step has high leverage.  
**Build path:** Claude API call with system prompt containing the angle playbook + web search tool.  
**Effort:** Medium-high. The angle playbook and guest matching nuances need to be baked in.

### 6. creationsuperstore.com product scraper
**What it is:** For each guest, return matching products from the superstore before interview writing begins.  
**Why it matters:** AI fabricated product plugs multiple times (a credibility/on-air risk). Real lookup prevents fabrication.  
**Build path:** Simple scraper or site search → return matching items with prices.  
**Effort:** Low. The site is static enough to scrape.

### 7. Outreach follow-up workflow
**What it is:** Standardized 48-hour follow-up timing from initial pitch through booking confirmation.  
**Why it matters:** Multiple conversations mention managing follow-up timing manually.  
**Build path:** Apps Script or n8n with a date-tracking sheet.  
**Effort:** Low. Schema is ready (`episode_guests` email timestamps + `v_episode_workflow` computed due dates).

---

## Deferred items added 2026-05-28

### Lower thirds styles (in progress — parallel session 2026-05-28)
**What:** Pulling lower third style/template variants from the data archive. Likely adds a style/template field to the `production_lower_thirds` table or `lower_thirds_variations`.  
**Status:** Active work in a separate session. Do not build schema or UI for lower third styles until that session's output is merged — coordinate to avoid conflicts with the `production_lower_thirds` table and `/lower-thirds` review UI.  
**Blockers:** Awaiting output from parallel session.

### Phase 1A — Guest email workflow UI ✓ DONE (shipped as `/workflow`)
**What:** Dashboard page showing `v_episode_workflow` — computed email due dates for zoom link, pre-air, post-shoot, and YouTube emails per guest per episode. Mark sent via button → writes timestamp to `episode_guests`.  
**Schema:** Ready. `episode_guests` has all 6 email timestamp columns. `v_episode_workflow` has computed due dates + sent booleans.  
**Status:** Shipped — the `/workflow` page renders `v_episode_workflow` (live routes list, CLAUDE.md).

### Content clips UI
**What:** Dashboard page for logging soundbites — enter timecode in/out, paste verbatim quote, select segment, tag platform fit. Shows all clips per episode.  
**Schema:** Ready. `content_clips` table is live.  
**Blockers:** None. Awaiting post-Stage 7 roadmap.

### Social posts UI
**What:** Dashboard page for drafting and tracking social posts — write caption, add hashtags, select platform + post type, schedule or mark posted.  
**Schema:** Ready. `social_posts` table is live, FK to `content_clips` and `episodes`.  
**Blockers:** None. Awaiting content clips UI first.

### CTN / WWN schema
**What:** Changing the Narrative (28.5 min long-form podcast) and Wonders Without Number (29 min, sold via CreationSuperstore) have separate production structures from GSR. Need separate schema pass.  
**Decision:** Deferred until GSR episode hub is stable and in active use.

### Phase 2 — Context loss prevention
**What:** Strategy to prevent repeated automation design cycles that never ship (879-session archaeology). Potential: CLAUDE.md rule set (Anti-Churn Rule is in place), session handoff doc, task queue doc.  
**Decision:** Anti-Churn Rule added to CLAUDE.md. Needs operational review after Stage 7.

---

## Distribution automation (already in PROJECT_PLAN.md — status update)

The original plan's Phase 1 (YouTube + Dropbox automation) and Phase 2 (Signiant, Rumble) are still valid goals but the architecture shifted with ADR-0012. The dashboard that was planned as n8n + SQLite is now the Supabase + Next.js app at `apps/dashboard/`.

The `distributions` table is now live. **Recommendation:** After Feature 1 clears Stage 7, build dashboard UI for distribution tracking before separate upload automation — that gives the tracking layer first.

---

## New automation candidates surfaced May 2026

### 8. YouTube RSS Poller (Supabase Edge Function)
**What:** Hourly cron polling `https://www.youtube.com/feeds/videos.xml?channel_id=UCNZS3IEQaAfwofwltbEBwuw`. Parse `S03, EpN` from titles, write real `youtube_url` and `youtube_published_at` to matching episode row.  
**Why:** All 48 S3 episode rows are in the DB now with `webstream_scheduled_publish_at` (the weekly Monday 4PM ET release target). Without the poller, the YouTube actuals (`youtube_url`, `youtube_published_at`) will never flip from the scheduled target to real publish data, so the dashboard will show stale data indefinitely.  
**Build path:** Supabase Edge Function + pg_cron trigger. No external dependencies.  
**Effort:** Low. Schema ready; the `episodes` table already has the target columns.  
**Priority: High.** Build immediately after Stage 7 resolves.

### 9. Run the first real-episode import (Stage 7)
**What:** The `/api/import` route, the extraction prompt, and the schema all align on the `production_lower_thirds` table (renamed from `graphics` 2026-06-09, on main since 2026-06-12). The old "JSON vs lower_thirds column mismatch" was a phantom. Stage 7 is now purely operational: no live episode import has run yet, so `production_lower_thirds` has 0 rows.  
**Why:** Running one episode end to end (extract -> import dry-run -> type YES -> review -> approved) closes Feature 1.  
**Build path:** Use the live `/api/import` (dry-run, then confirm). No schema fix is needed.  
**Effort:** Low.  
**Priority: High — this IS Stage 7 (an operational milestone, not a code blocker).**

### 10. Graphics Tracker → Rundown Creator sync
**What:** After the May Graphics Tracker (Google Sheets) is finalized per show, compare graphic rows against Rundown Creator and float/delete mismatched RC rows automatically.  
**Why:** Currently done manually with Claude assistance every filming cycle. "Rundown and graphics tracker discrepancies" conversation showed the pain — rows float in wrong positions requiring manual audit.  
**Build path:** Google Sheets MCP (read Tracker) + RC MCP (read/write RC rows) + diff logic.  
**Effort:** Medium. Depends on Composio reliability (known issue) or native Sheets MCP.

### 11. Interview tease → RC push codification
**What:** The pattern of generating interview tease copy in Claude and pushing directly to RC rows via MCP is working. It just needs to be a reusable, codified skill so it doesn't require reinvention each cycle.  
**Why:** Used every May filming session. Currently re-explained from scratch each time.  
**Build path:** PROMPT_LIBRARY.md entry + Agent skill definition.  
**Effort:** Low.

### 12. Preproduced segment script → RC auto-population
**What:** QNAP audio folder (read-only SMB) contains segment files with standard naming (e.g., `THD_390_DayYom`, `KC_S02_Ep021_Bobcats`). Match by filename pattern to the correct episode row and populate RC.  
**Why:** Currently manual. Each filming cycle has 6 preproduced segments × 5 shows = 30 rows to populate by hand.  
**Build path:** SMB read + filename regex matcher + RC MCP writer. No Tailscale needed — SMB is already mounted.  
**Effort:** Medium. Filename patterns are known; the hard part is the RC row-type targeting.

---

## Active blockers (as of 2026-05-30)

| Blocker | Impact | Resolution path |
|---|---|---|
| First real-episode import not yet run (production_lower_thirds = 0 rows) | Stage 7 operational milestone | Run /api/import dry-run then confirm; no schema fix needed (the lower_thirds mismatch was a phantom) |
| Composio unreliable | Blocks Google Sheets write automation | Switch to native Google Sheets MCP |
| RC MCP frequent timeouts | Daily friction | Investigate MCP server restart cadence; add retry logic |
| No `youtube_published_at` auto-flip | Episodes show stale data | Build YouTube RSS poller Edge Function |
| ProPresenter blocked | Cannot verify slide delivery | Permanent until David approves test machine path |
| Direct server tools off-limits | No file watchers, no SMB writes | Read-only SMB + cloud API only — constraint is permanent |

---

## What to build next (after Feature 1 clears Stage 7)

| Priority | Item | Why now |
|---|---|---|
| 0 | Lower thirds schema fix (item 9 above) | **Unblocks Stage 7** |
| 1 | YouTube RSS poller Edge Function | Schema done; data goes stale without it |
| 2 | Phase 1A — Guest email workflow UI | Schema done, high daily value for Daniel |
| 3 | Episode hub UI (guests, distributions, transcripts) | All schema done; one dashboard view per table |
| 4 | Content clips + social posts UI | Schema done; completes the social media workflow |
| 5 | Timecode + title pipeline | Highest-volume repeated manual task (YouTube category) |
| 6 | Monthly package compiler | Useful but Drive reliability is a dependency |

---

## Deferred: per-role login + role-scoped dashboards (Daniel, 2026-06-07)

**What it is:** Real login credentials for each team member, so each person signs in and lands on only their own dashboard view: Daniel (owner, everything), Myriam (metadata + post-production + uploads + mark-aired), Isaac (graphics tracker + ProPresenter + edit/export), interns (graphics + ProPresenter/Rundown, no post-production editing).

**Why deferred (explicit precondition):** Do NOT build this until (1) the system is fully designed, (2) functionality has been tested across multiple mock episodes, and (3) the current real system has been completely imported. Building auth/role-gating earlier would lock in views before the workflow is proven.

**Notes:** Role scopes are recorded in `docs/_handoff/GSR-WORKFLOW-CANON.md`. The Liquid Glass design mock in `gsr-blueprint/mock/` already structures the hub per role, so the views exist before the auth does. Jakob/Jeremiah/Gabe may share a generic landing page rather than distinct dashboards.

---

## Follow-up: drop youtube_scheduled_publish_at (contract step, 2026-06-08)

**What it is:** The contract half of the `youtube_scheduled_publish_at` -> `webstream_scheduled_publish_at` expand-contract rename. Migration `20260608161708_add_webstream_scheduled_publish_at` already ADDED and BACKFILLED the new `webstream_scheduled_publish_at` column on `episodes`. The old `youtube_scheduled_publish_at` column is intentionally still present.

**What is left:** Write a later migration `<ts>_drop_youtube_scheduled_publish_at.sql` that does `ALTER TABLE episodes DROP COLUMN IF EXISTS youtube_scheduled_publish_at;`, regenerate types, run advisors.

**HARD PRECONDITION (do not skip):** Run this ONLY AFTER this branch is merged to `main` and the new build is deployed to Vercel. The currently-deployed app and the `v_episode_workflow` view still reference `youtube_scheduled_publish_at`; dropping it before the deploy that stops referencing it would break production. Update `v_episode_workflow` to use the new column in the same later migration, then drop. Priority: low, but do it before the column drifts out of memory.

---

## Deferred: Basecamp two-way sync integration (Daniel, 2026-06-08)

**What it is:** Integrate the existing Basecamp system into the dashboard. Sync rule: every imported element syncs (stays current); two-way editing (write-back) is limited to check-off/complete items (post-production status, to-dos, checklist items), everything else read-only. Locked decisions (Daniel 2026-06-08): WWN deferred to future phases; to-dos sync per person for Daniel/Isaac/Myriam only; calendar imports only `PROD |` events; Isaac gets a GSR editing page mirroring his Basecamp card board. Out of scope: message boards, chats, the generic card table, activity feeds, Prayer Request + Aquarium. Full design: `docs/2026-06-08-basecamp-dashboard-integration.md`. Embed the DATA via the Basecamp API rendered in the dashboard's own UI (Basecamp blocks iframing its pages), so no "go to Basecamp" link is needed on the main flow. Resolve the conflicting episode databases with one owner per fact (recommended: the Basecamp card is the system of record for production stage + tasks, the episode row stores the card id; Supabase owns dashboard-only data). Per-role data inventory + approach: `docs/2026-06-08-basecamp-dashboard-integration.md`. Credentials verified working (`docs/2026-06-08-basecamp-env-diagnosis.md`).

**Open decision (Daniel):** which side owns production stage, Basecamp or the dashboard. Recommend Basecamp. Everything else in the design follows from this.

**Why deferred:** Sequenced with the per-role dashboards above (same preconditions: system designed, tested across mock episodes, real system imported). Display/placement is intentionally undecided. The earlier "Basecamp = read-only monologue ingestion, later feature" scope is superseded; monologue ingestion is now one slice of this broader two-way integration.

**Guardrail:** two-way means the dashboard can write back into a tool the whole team uses live, so every dashboard-to-Basecamp write follows confirm-before-write + the David rule. Reads carry no such risk.

---

## Follow-up: drop youtube_scheduled_publish_at (contract step, 2026-06-08)

**What it is:** The contract half of the `youtube_scheduled_publish_at` -> `webstream_scheduled_publish_at` expand-contract rename. Migration `20260608161708_add_webstream_scheduled_publish_at` already ADDED and BACKFILLED the new `webstream_scheduled_publish_at` column on `episodes`. The old `youtube_scheduled_publish_at` column is intentionally still present.

**What is left:** Write a later migration `<ts>_drop_youtube_scheduled_publish_at.sql` that does `ALTER TABLE episodes DROP COLUMN IF EXISTS youtube_scheduled_publish_at;`, regenerate types, run advisors.

**HARD PRECONDITION (do not skip):** Run this ONLY AFTER this branch is merged to `main` and the new build is deployed to Vercel. The currently-deployed app and the `v_episode_workflow` view still reference `youtube_scheduled_publish_at`; dropping it before the deploy that stops referencing it would break production. Update `v_episode_workflow` to use the new column in the same later migration, then drop. Priority: low, but do it before the column drifts out of memory.
