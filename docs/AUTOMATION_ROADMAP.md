# Automation Roadmap

*Cross-reference of archaeology-surfaced candidates against the existing project plan. Generated 2026-05-27.*

---

## Two separate pipelines

`PROJECT_PLAN.md` covers **distribution automation** — moving finished episode files to YouTube, Dropbox, Rumble, Fireside, etc. That work is still valid but predates ADR-0012 (Supabase pivot); the n8n/SQLite architecture described there has been superseded by the Next.js + Supabase dashboard.

The archaeology surface almost entirely **production automation** — the upstream work that happens before an episode is finished: guest research, script writing, lower thirds, outreach. These two pipelines are largely orthogonal. The overlap is only in the metadata/titles step.

---

## Production automation candidates (new — not in PROJECT_PLAN.md)

Ranked by estimated friction-reduction per hour of build work.

### 1. Guest last-aired tracker
**What it is:** A structured record of every guest's most recent air date + expertise tags + communication style rating.  
**Why it matters:** AI suggested recently-aired guests (Burgess, Tommy Lohman) in dozens of conversations because it has no airing data. Each correction costs 2–3 turns.  
**Build path:** Supabase table (`guests`, `guest_airings`) → query before any guest suggestion. Already adjacent to Feature 1 data model.  
**Effort:** Low. The data model is simple and could ride on the existing Supabase project.

### 2. Lower thirds character-count checker
**What it is:** Auto-flag any L3 line that exceeds 65 characters before the full package is delivered.  
**Why it matters:** L3 overshoot was a recurring difficulty across the lower-thirds category (146 conversations). Overshoots require a full re-pass.  
**Build path:** Could live in the Feature 1 dashboard at the point where AI-generated L3s are reviewed. A simple `text.length > 65` check with a red highlight in the approval UI.  
**Effort:** Trivial — one UI change to Feature 1 (Stage 7+).

### 3. Monthly interview package compiler
**What it is:** At the start of each month, pull guest emails + spreadsheet entries + Apple Notes schedule + article links into one formatted document.  
**Why it matters:** This was described in multiple conversations as a repetitive manual assembly task at the start of every filming cycle.  
**Build path:** Apps Script triggered on a date, reading Drive + the guest tracker.  
**Effort:** Medium. Depends on reliable Drive access (known to be fragile — GSR Shared Folder blocks writes).

### 4. Segment timecode + YouTube title pipeline
**What it is:** Ingest transcript → parse segment cues → generate 30%-shorter titles → write to Drive spreadsheet.  
**Why it matters:** AI repeatedly forgot the 30%-shorter rule in the YouTube titles category (59+ conversations). Automating the pipeline bakes the rule in rather than relying on the AI remembering it per session.  
**Build path:** Python script or n8n workflow triggered on transcript completion.  
**Effort:** Medium. Whisper transcription is already in the original Phase 1 plan; the title generation layer is additive.

### 5. News-story → angle mapper
**What it is:** Given a guest's expertise tags, return recent creation-science-relevant news stories with suggested interview angles.  
**Why it matters:** Guest research is the largest category (298 conversations, 34% of all volume). Even partial automation of the research-to-angle step has high leverage.  
**Build path:** Claude API call with a system prompt containing the angle playbook + web search tool.  
**Effort:** Medium-high. The angle playbook and guest matching nuances need to be baked in.

### 6. creationsuperstore.com product scraper
**What it is:** For each guest, return matching products from the superstore before interview writing begins.  
**Why it matters:** AI fabricated product plugs multiple times (a credibility/on-air risk). Real lookup prevents fabrication.  
**Build path:** Simple scraper or site search → return matching items with prices.  
**Effort:** Low. The site is static enough to scrape.

### 7. Outreach follow-up workflow
**What it is:** Standardized 48-hour follow-up timing from initial pitch through booking confirmation.  
**Why it matters:** Multiple conversations mention managing follow-up timing manually. Standardizing it reduces dropped pitches.  
**Build path:** Apps Script or n8n with a date-tracking sheet.  
**Effort:** Low.

---

## Distribution automation (already in PROJECT_PLAN.md — status update needed)

The original plan's Phase 1 (YouTube + Dropbox automation) and Phase 2 (Signiant, Rumble) are still valid goals but the architecture shifted with ADR-0012. The dashboard that was planned as n8n + SQLite is now the Supabase + Next.js app at `apps/dashboard/`.

**Recommendation:** After Feature 1 ships (Stage 7), fold distribution tracking into the existing dashboard rather than building a separate system. The schema pattern from `PROJECT_PLAN.md` (episodes + platform_uploads tables) maps cleanly to Supabase.

---

## What to build next (after Feature 1 clears Stage 7)

| Priority | Item | Why now |
|---|---|---|
| 1 | Guest last-aired tracker | Prevents the #1 recurring AI error; small Supabase table |
| 2 | L3 character-count checker | One UI change to Feature 1 approval screen |
| 3 | **Lower-thirds prompt style guide** | Requires dedicated session with Drive exports (GPT/Claude history); do not attempt without that data |
| 4 | Timecode + title pipeline | Highest-volume repeated manual task (YouTube category) |
| 5 | Distribution tracking in dashboard | Folds the original PROJECT_PLAN.md goals into current stack |
| 6 | Monthly package compiler | Useful but Drive reliability is a dependency |
