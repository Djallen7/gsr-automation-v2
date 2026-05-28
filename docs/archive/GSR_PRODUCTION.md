<!-- ARCHIVE: GSR Automation Reference -->
<!-- DOMAIN: production -->
<!-- KEYWORDS: Genesis Science Report, GSR, CTN, WWN, Star Spangled Adventures, David Rives, Miryam, team, show structure, segments, Drive, interview schedule, graphics tracking, sponsorship, RLN, StreamHoster, Fireside, distribution -->
<!-- SOURCES: FINDINGS.md, archaeology_data.json, SUPABASE_SCHEMA_DESIGN.md, OpenAI export snippets -->
<!-- UPDATED: 2026-05-28 -->

# GSR Production Reference

Context about the Genesis Science Report show, team, and production workflow.
This file is for Claude sessions that need to understand what the software actually serves.

---

## Show Overview

| Field | Value |
|-------|-------|
| **Show** | Genesis Science Report (GSR) |
| **Season** | Season 3 (active) |
| **Genre** | Christian creation-science TV |
| **Length** | ~58 minutes, weekly |
| **Talent** | David Rives (on-screen host and ministry director) |
| **Sponsorship** | ~$100–150/episode |
| **GSR email** | dallen@davidrives.com |

---

## Team

| Person | Role |
|--------|------|
| **Daniel Allen** | Producer / project owner; non-developer; uses Claude Code for all building |
| **Miryam** | Co-producer |
| **David Rives** | On-screen talent and ministry director — do not break anything affecting him |
| **Isaac, Jacob, Gabe, Murray, Robert** | Crew (~7–8 people on shoot days) |

**The David Rule:** Before any action, ask: if this goes wrong, does it fall on David to fix it? If yes — redesign the approach until the answer is no.

---

## Related Shows (same ministry)

| Show | Length | Notes |
|------|--------|-------|
| **CTN** — Changing the Narrative | 28.5 min | Long-form podcast with David Rives |
| **WWN** — Wonders Without Number | 29 min | Sold via CreationSuperstore |
| **Star Spangled Adventures** | — | Animated series also in production |

---

## Distribution Platforms

| Platform | Method | Notes |
|----------|--------|-------|
| **Real Life Network (RLN)** | Signiant Media Shuttle | RLN = same as RightNow Media |
| **StreamHoster** | FTP | Roku, Apple TV, iOS app, LG TV |
| **Fireside.fm** | Podcast hosting | Auto-feeds Spotify + Apple Podcasts |
| **YouTube** | Upload | |
| **Rumble** | Upload | |
| **Dropbox** | File share | |
| **Genesis Science Network** | Internal | |

Supabase enum for distribution: `youtube`, `rumble`, `dropbox`, `fireside_podcast`, `real_life_network`, `streamhoster`, `genesis_science_network`

---

## Show Segments

These segment types are defined in the Supabase schema and used for lower-thirds / graphics tracking:

- `opening_monologue`
- `interview_1`
- `interview_2`
- `kids_corner`
- `genesis_science_qa`
- `ministry_report`
- `viewer_voices`
- `featured_resource`
- `heavens_declare`
- `genesis_science_minute`
- `show_intro`
- `other`

---

## Google Drive: Key Documents

Drive folder pattern: `05_May (Ep 21-25)/[subfolder]` — monthly folders with episode range in the name.

| Document | Activity | Notes |
|----------|----------|-------|
| MONTHLY INTERVIEW SCHEDULE | 74 active days, 402 events | Longest-running doc; most-edited overall |
| Interview Article Assignments | 36 days, 473 events | |
| 2026 MONTHLY INTERVIEW SCHEDULE | 30 days, 147 events | |
| GSR Graphics Tracking: [Month] | 24–27 active days each | Monthly sheets |
| GSR Episode Titles/Timecodes | 24 days, 140 events | |
| GSR Guest Contact List | 20 days, 135 events | |
| GSR S02 Ep047-051.docx (and similar) | 18–20 days each | Episode-specific docs |

### Drive Activity Pattern (full year, 64,037 events)

| Event type | Count | Share |
|------------|-------|-------|
| permission_change | 32,684 | 51% |
| upload | 14,691 | 23% |
| edit | 12,100 | 19% |
| create_new | 1,455 | 2% |
| delete | 182 | <1% |

Key insight: Drive is rarely cleaned up (182 deletes vs. 14K uploads). Collaboration is bulk-share heavy — a core 6-person cluster appears together in ~26K permission events.

Drive also contains ~5K files with `email/rfc822` MIME type — likely Apps Script email export backups.

---

## Drive Cleanup Needed

These issues were identified in forensic analysis. No automated cleanup has been run.

1. **node_modules/ accidentally synced** — April 2026; ~35K events, ~21K permission changes. Locate and remove from Drive.
2. **Duplicate templates** — 10+ copies of `[Template] GSR Graphics S00 Ep000.docx` and `[Template] GSR Lower Thirds S00 Ep000.docx`.
3. **Bogus 1980-01-01 modifiedTime** — upload artifacts; files with this date are likely orphaned or corrupted uploads.

---

## Graphics & Asset Tracking (App Feature 1)

The active Supabase + Next.js dashboard (`apps/dashboard`) is built around Episode Graphics & Asset Tracker:

- `/import` — bulk text-only ingest via JSON paste (phase-out of PNG upload)
- `/lower-thirds` — review grid (approve / reject / regenerate via Claude API)
- `/approved` — approved queue with ProPresenter copy button

ProPresenter on production machine (GSN-PropRes, Tailscale 100.98.215.7) is OFF LIMITS to automation. The copy button is manual — crew copies text, operator pastes into ProPresenter on a test machine only until David approves broader rollout.
