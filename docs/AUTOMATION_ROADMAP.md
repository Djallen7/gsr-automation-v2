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
**`guests` table** with expertise, is_yec, communication_notes + **`episode_guests`** table with booking_status and filming history is now live in Supabase. Dashboard UI still needed (see Phase 1A below).

### 2. ~~Lower thirds character-count checker~~ ✓ DONE (2026-05-28)
~~Auto-flag any L3 line that exceeds 65 characters before the full package is delivered.~~
**Implemented in `apps/dashboard/src/app/lower-thirds/graphic-card.tsx`** — amber warning at <55 chars (too short), red error at >65 chars (over limit). Full 55–65 character range enforced in the review UI.

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

### Phase 1A — Guest email workflow UI
**What:** Dashboard page showing `v_episode_workflow` — computed email due dates for zoom link, pre-air, post-shoot, and YouTube emails per guest per episode. Mark sent via button → writes timestamp to `episode_guests`.  
**Schema:** Ready. `episode_guests` has all 6 email timestamp columns. `v_episode_workflow` has computed due dates + sent booleans.  
**Blockers:** None. Awaiting Feature 1 Stage 7 completion.

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

## What to build next (after Feature 1 clears Stage 7)

| Priority | Item | Why now |
|---|---|---|
| 1 | Phase 1A — Guest email workflow UI | Schema done, high daily value for Daniel |
| 2 | Episode hub UI (guests, distributions, transcripts) | All schema done; one dashboard view per table |
| 3 | Content clips + social posts UI | Schema done; completes the social media workflow |
| 4 | Timecode + title pipeline | Highest-volume repeated manual task (YouTube category) |
| 5 | Monthly package compiler | Useful but Drive reliability is a dependency |
