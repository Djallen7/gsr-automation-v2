# GSR Production Automation — Project Plan

**Repository purpose:** Central source of truth for the Genesis Science Report (and adjacent shows) post-production automation system. All planning docs, architecture decisions, code, runbooks, and operational documentation live here.

**Last updated:** 2026-05-15
**Owner:** [Your name]
**Co-maintainer:** Miriam

---

## Repository Structure

```
gsr-automation/
├── README.md                       # Project overview, quickstart for Miriam
├── docs/
│   ├── PROJECT_PLAN.md             # This file — phased build plan
│   ├── ARCHITECTURE.md             # System design, component diagram
│   ├── FAILURE_MODES.md            # 12 documented risks + countermeasures
│   ├── OPEN_SOURCE_STACK.md        # Building blocks evaluation
│   ├── DEFENSIVE_PRACTICES.md      # Defensive countermeasures guide
│   ├── GSR_METADATA_PATTERN.md     # YouTube channel analysis + cadence
│   ├── decisions/                  # Architecture Decision Records (ADRs)
│   │   ├── 0001-use-n8n-orchestrator.md
│   │   ├── 0002-defer-fireside-rumble.md
│   │   ├── 0003-dashboard-as-tracking-system.md
│   │   └── ...
│   └── runbooks/                   # "When X breaks, do Y"
│       ├── youtube-upload-failed.md
│       ├── nas-disconnected.md
│       └── ...
├── apps/
│   ├── dashboard/                  # Next.js dashboard (forked from Kiranism template)
│   ├── file-watcher/               # Chokidar service
│   ├── transcription/              # faster-whisper Docker service
│   └── browser-automation/         # Playwright service (Phase 2+)
├── workflows/
│   └── n8n/                        # Exported n8n workflow JSON files
├── scripts/
│   ├── backup.sh                   # Database backup
│   └── deploy.sh                   # Deployment helper
├── .github/
│   ├── ISSUE_TEMPLATE/             # Templates for plan changes, bugs, features
│   └── workflows/                  # GitHub Actions (CI/CD)
└── .env.example                    # Environment variable template
```

**Why this structure works:**
- One place for everything — no more scattered docs in Downloads
- Code and docs live together — they evolve together
- ADRs in `docs/decisions/` track WHY we made every major choice
- Runbooks in `docs/runbooks/` are the "when X breaks" guides — critical for Miriam
- All n8n workflows exported to Git daily (backup + change history)

---

## How to Track Plan Changes

**For small adjustments:** Edit the relevant doc directly, commit with a clear message like `[plan] Defer multi-variant metadata to Phase 3`. Git history becomes the change log automatically.

**For significant decisions:** Create a new ADR in `docs/decisions/`. Format:
```markdown
# ADR-0004: [Decision Title]
Date: 2026-MM-DD
Status: Accepted | Superseded | Deprecated

## Context
What problem are we solving? What did we learn?

## Decision
What did we decide?

## Consequences
What does this change about the project?
```

**For tracking active changes:** Use **GitHub Issues** with labels:
- `plan-change` — modifications to this plan
- `phase-1`, `phase-2`, `phase-3`, `phase-4` — which phase a change affects
- `blocker` — something stopping progress
- `decision-needed` — requires you to decide before proceeding

**For visual progress:** Use **GitHub Projects** (the built-in kanban). Columns: Backlog → This Phase → In Progress → Testing → Done.

---

## Architectural Principle for Phase 1

**The dashboard is a tracking system that sometimes does automated uploads — not an automation system with manual fallback.**

This means every platform in the database has identical schema:
```
episodes (
  id, title, season, episode_number, file_path,
  master_metadata_json, transcript_path, created_at,
  status, approved_at, approved_by
)

platform_uploads (
  id, episode_id, platform_name, status,
  upload_url, uploaded_at, uploaded_by,  -- "automation" OR "Miriam"
  platform_metadata_json
)
```

Switching a platform between manual and automated is a configuration change, not a redesign. **This is the single most important design decision for Phase 1.**

---

# Phase 1: Core Foundation

**Goal:** Working system that handles 80% of weekly upload effort, with all six platforms tracked in dashboard. Two automated (YouTube, Dropbox), four manual-with-assist (Rumble, Fireside, Signiant, StreamHoster).

**Timetable:** 6–8 weeks (40–60 hours of focused work, 6–9 hrs/week)

**Success probability:** **70–80%**
*Why this high:* Open-source building blocks handle the boring parts. Deferring Rumble/Fireside/Signiant/StreamHoster eliminates the four most fragile components. Scope is bounded.

## What gets built in Phase 1

### Week 1: Repository, infrastructure, documentation skeleton
- [ ] Create GitHub repo with structure above
- [ ] Migrate all previous research deliverables into `docs/`
- [ ] Install n8n on NAS via Docker
- [ ] Set up Tailscale access for dashboard
- [ ] Configure 1Password vault for credentials
- [ ] Install UptimeRobot monitoring
- [ ] Write first ADR documenting Phase 1 scope

### Week 2: Database + file watcher
- [ ] Initialize SQLite database (better-sqlite3) with schema above
- [ ] Build Chokidar file watcher service in Docker
- [ ] File watcher writes new episode rows to database on detection
- [ ] Test: drop test video on NAS → row appears in database
- [ ] Document in `runbooks/file-watcher.md`

### Week 3: Dashboard skeleton (all platforms visible)
- [ ] Fork `Kiranism/next-shadcn-dashboard-starter`
- [ ] Strip Clerk auth (Tailscale handles access)
- [ ] Build episode list view + episode detail view
- [ ] Show all 6 platforms per episode (status, upload_url, uploaded_by)
- [ ] Connect dashboard to SQLite via n8n webhook endpoints
- [ ] Polling every 30 seconds for status updates

### Week 4: Transcription + AI metadata (manual trigger)
- [ ] Deploy faster-whisper Docker container with Flask wrapper
- [ ] Dashboard button: "Generate transcript" → calls Whisper service
- [ ] Integrate Vercel AI SDK in n8n workflow
- [ ] Dashboard button: "Generate metadata" → calls Claude API
- [ ] AI returns ONE master metadata package per episode (single description, applies to all platforms)
- [ ] Hardcode GSR pattern (sponsor rule, anchor tags, title format from GSR_METADATA_PATTERN.md)
- [ ] Cost tracking on every AI call

### Week 5: YouTube automation
- [ ] Install youtubeuploader binary on NAS
- [ ] Complete OAuth setup for David Rives Ministries channel
- [ ] Build n8n workflow: approval → metadata → upload → record URL → update status
- [ ] Test with private upload first
- [ ] Document in `runbooks/youtube-upload.md`

### Week 6: Dropbox automation
- [ ] Install Dropbox SDK in n8n environment
- [ ] OAuth setup for Dropbox app
- [ ] Build n8n workflow: approval → upload (no metadata) → record file path → update status
- [ ] Test with large files (chunked upload)
- [ ] Document in `runbooks/dropbox-upload.md`

### Week 7: Manual platform workflows
- [ ] Dashboard "Copy metadata" buttons for Rumble, Fireside, Signiant, StreamHoster
- [ ] Dashboard "Open upload page" buttons (open platform in new tab)
- [ ] Dashboard "Mark as uploaded" buttons (update status, prompt for URL)
- [ ] Test full workflow with Miriam: approve in dashboard → automated YT + Dropbox → manual copy/paste for other 4

### Week 8: Testing, documentation, knowledge transfer
- [ ] Process 3–5 real episodes through full pipeline
- [ ] Write all runbooks (one per failure mode)
- [ ] Record Loom walkthroughs (deployment, recovery, daily ops)
- [ ] Pair sessions with Miriam (observe → assist progression)
- [ ] Phase 1 retrospective: what worked, what didn't, what to fix before Phase 2

## What's explicitly OUT of Phase 1

- ❌ Rumble upload automation (manual with assist)
- ❌ Fireside.fm upload automation (manual with assist)
- ❌ Signiant Google Form auto-fill (manual with assist)
- ❌ StreamHoster FTP automation (manual with assist)
- ❌ Multi-variant metadata (single master description for now)
- ❌ Real-time WebSocket updates (polling is fine)
- ❌ User authentication (Tailscale handles access)
- ❌ Email/Slack success notifications (failures only)
- ❌ Mobile responsive design (desktop only)
- ❌ Multi-show support (GSR only; replicate pattern later)
- ❌ Backup automation (manual archival continues)
- ❌ Sophisticated approval routing (single approve button)

## Phase 1 Exit Criteria — must hit ALL before Phase 2

1. ✅ 10 consecutive episodes processed without manual code intervention
2. ✅ Miriam can complete full workflow independently for an episode
3. ✅ Average maintenance time < 1 hour/week for 4 consecutive weeks
4. ✅ Error rate < 5% on automated uploads
5. ✅ All runbooks tested by following them from cold start
6. ✅ Dashboard polled, database backed up, monitoring alerting on failures
7. ✅ All Phase 1 code in repo with Miriam having commit access

**If you can't hit ALL six, do NOT start Phase 2.** Stay in Phase 1 maintenance mode until stable.

---

# Phase 2: Selective Platform Automation

**Goal:** Automate the two highest-value remaining platforms (Signiant Google Form, Rumble) where the maintenance burden is justified by manual effort saved.

**Timetable:** 4–6 weeks (24–40 hours of focused work)

**Success probability:** **55–65%**
*Why lower than Phase 1:* Adding Playwright introduces UI-change fragility. Each platform automated adds permanent maintenance overhead. Rumble API still requires approval (or browser fallback).

**Prerequisite:** All six Phase 1 exit criteria met for 30+ days.

## What gets built in Phase 2

### Signiant Google Form auto-fill (2–3 weeks)
- [ ] Deploy Playwright service in Docker
- [ ] Build n8n workflow: receive episode metadata → Playwright fills Google Form → submits → captures confirmation
- [ ] Dashboard updated: Signiant platform shows "automation" instead of "Miriam" when enabled
- [ ] Form field mapping documented (in case Google Form changes)
- [ ] Fallback: if Playwright fails, dashboard reverts to manual workflow seamlessly
- [ ] Runbook: `runbooks/signiant-form-fill.md`

### Rumble automation (2–3 weeks)
**Decision point at start of Phase 2:** Did bd@rumble.com approve API access?

**If yes (API approved):**
- [ ] Build n8n workflow using Rumble API
- [ ] Test with private uploads
- [ ] Document in `runbooks/rumble-api-upload.md`

**If no (still no API):**
- [ ] Build Playwright-based Rumble upload automation
- [ ] Accept higher maintenance burden (likely monthly UI fixes)
- [ ] Document in `runbooks/rumble-playwright-upload.md`
- [ ] **Reconsider whether automation is worth it** — manual takes 3 minutes, automation might cost 2 hours/month in maintenance

## Phase 2 Exit Criteria

1. ✅ Signiant form-fill stable for 30+ days with < 5% failure rate
2. ✅ Rumble automation (whichever path) stable for 30+ days
3. ✅ Total maintenance burden still < 2 hours/week
4. ✅ No regression in Phase 1 functionality

---

# Phase 3: Long-Tail Automation

**Goal:** Automate Fireside.fm and StreamHoster — the two most fragile remaining platforms.

**Timetable:** 4–6 weeks

**Success probability:** **45–55%**
*Why lowest:* Fireside has no API at all; relies entirely on Playwright. FTP automation has many edge cases. These are the platforms most likely to break and stay broken.

**Honest recommendation:** Seriously consider whether you need to do Phase 3. If Phases 1 and 2 are stable and Miriam is comfortable with manual workflows for Fireside/StreamHoster, **Phase 3 may not be worth the maintenance burden it adds**.

## What gets built in Phase 3 (if proceeding)

### Fireside.fm Playwright automation (2–3 weeks)
- [ ] Build Playwright workflow for Fireside upload
- [ ] Session management (persist login cookies)
- [ ] Screenshot capture on failure for debugging
- [ ] Fallback to manual on any error
- [ ] Runbook: `runbooks/fireside-playwright-upload.md`

### StreamHoster FTP automation (2 weeks)
- [ ] basic-ftp library in n8n
- [ ] FTPS configuration (never plain FTP)
- [ ] Connection pooling, retry logic
- [ ] Checksum verification post-upload
- [ ] Runbook: `runbooks/streamhoster-ftp-upload.md`

### Multi-variant metadata generation (1 week)
- [ ] Extend AI metadata workflow to generate platform-specific variants
- [ ] Dashboard shows different description per platform
- [ ] Editable per-platform before upload

## Phase 3 Exit Criteria

1. ✅ All four deferred platforms either automated stably OR consciously kept manual
2. ✅ Total system maintenance < 3 hours/week
3. ✅ Bus factor of 2 (you AND Miriam can do everything)

---

# Phase 4: Polish & Replication (Optional)

**Goal:** Refine system, replicate pattern for other shows (CTN podcast, Unwrapped, etc.).

**Timetable:** Open-ended

**Success probability:** **70–85%** (lower risk additions to proven system)

## Candidates for Phase 4

- Add CTN podcast and other shows (replicate GSR pattern)
- Real-time WebSocket dashboard updates (replace polling)
- Mobile responsive dashboard
- Advanced analytics (upload performance over time)
- Auto-archival of completed episodes to cold storage
- Backup automation
- User authentication (if you ever need multi-user access beyond Tailscale)

---

## Timetable Summary

| Phase | Duration | Hours | Success | Critical Risk |
|-------|----------|-------|---------|---------------|
| Phase 1 | 6–8 weeks | 40–60 | 70–80% | Scope creep, abandoning Phase 1 before stable |
| Phase 2 | 4–6 weeks | 24–40 | 55–65% | Playwright fragility, Rumble API denial |
| Phase 3 | 4–6 weeks | 24–40 | 45–55% | Fireside UI changes, FTP edge cases |
| Phase 4 | Open-ended | Variable | 70–85% | None — only proceed if Phases 1–3 stable |

**Total realistic timeline to complete Phases 1–3:** 4–6 months at 6–9 hours/week, assuming no major disruptions.

**Most likely actual outcome based on similar projects:** Phase 1 completes and runs successfully. Phase 2 partially completes (one of Signiant/Rumble works well, the other stays manual). Phase 3 gets started but is abandoned because manual workflow for Fireside/StreamHoster is acceptable. **This is success, not failure.**

---

## Open-Source Stack — Phase-by-Phase

### Phase 1 components (all 9 needed)

| Component | Project | License | Phase 1 role |
|-----------|---------|---------|--------------|
| File watching | **Chokidar** (paulmillr/chokidar) | MIT | Library import in n8n |
| Job queue | **BullMQ** (taskforcesh/bullmq) | MIT | Redis-backed queue |
| Database | **better-sqlite3** (WiseLibs) | MIT | Status tracking |
| Transcription | **faster-whisper** (SYSTRAN) | MIT | Docker service |
| AI metadata | **Vercel AI SDK** (vercel/ai) | Apache 2.0 | Library import |
| YouTube upload | **youtubeuploader** (porjo) | Apache 2.0 | CLI binary |
| Dropbox upload | **dropbox-sdk-js** (Dropbox) | MIT | Library import |
| Dashboard | **next-shadcn-dashboard-starter** (Kiranism) | MIT | Fork as skeleton |
| Notifications | **ntfy** (binwiederhier/ntfy) | Apache 2.0 | HTTP POST from n8n |

**Deliberately NOT in Phase 1:**
- Playwright (added Phase 2 for Signiant)
- basic-ftp (added Phase 3 for StreamHoster)
- Apprise/Gotify (ntfy is sufficient for now)

### Phase 2 additions
- **Playwright** (microsoft/playwright, Apache 2.0) — Signiant Google Form auto-fill, Rumble fallback

### Phase 3 additions
- **basic-ftp** (patrickjuchli/basic-ftp, MIT) — StreamHoster
- **Playwright** workflow extended for Fireside.fm

---

## Key Decisions Locked In (ADRs to write Week 1)

1. **ADR-0001:** Use n8n as orchestrator (not custom code), Next.js dashboard, SQLite database, Docker services on NAS
2. **ADR-0002:** Defer Rumble, Fireside, Signiant, StreamHoster automation to later phases
3. **ADR-0003:** Dashboard is a tracking system with optional automation per platform (not automation with manual fallback)
4. **ADR-0004:** Single master metadata description in Phase 1; platform-specific variants in Phase 3
5. **ADR-0005:** Dropbox uploads do not require metadata generation
6. **ADR-0006:** Tailscale for dashboard access; no custom auth
7. **ADR-0007:** AI metadata generation is manually triggered, never automatic
8. **ADR-0008:** Phase exit criteria must be met before starting next phase

---

## Risk Watch List

These get tracked as GitHub Issues with `risk` label, reviewed weekly:

| Risk | Mitigation | Trigger to act |
|------|------------|----------------|
| Scope creep | Phase exit criteria | Adding work not in current phase |
| AI cost spike | Hard $100/mo cap, kill switch | $50 in any single month |
| YouTube quota exceeded | Stagger uploads, request quota increase | First quota error |
| NAS failure | 3-2-1-1-0 backups | Any backup failure |
| Knowledge gap (Miriam) | Pair sessions, Loom videos | Miriam can't do task independently |
| OAuth token expiry | Refresh token logic, monitoring | Any auth failure |
| Platform UI change (Phase 2+) | Screenshot-on-failure, fallback to manual | Playwright workflow fails |
| Maintenance burden growth | Weekly time tracking | >3 hrs/week sustained |

---

## Health Checkpoints

**Weekly (Friday, 30 min):**
- Review GitHub Issues
- Check maintenance time spent this week
- Verify backups ran successfully
- Review any failed uploads

**Monthly (last Friday, 90 min):**
- Phase progress review
- Update this PROJECT_PLAN.md if scope changed (commit changes)
- Pair session with Miriam — what's confusing, what's working
- Review monitoring/cost reports

**End-of-Phase (when exit criteria met):**
- Full retrospective documented as ADR
- Update success probability for next phase based on actuals
- Confirm GO/NO-GO for next phase

---

## How to Start

**This week:**
1. Create the GitHub repo using structure above
2. Migrate existing docs into `docs/` folder
3. Write ADR-0001 through ADR-0008
4. Email bd@rumble.com about API access (start the clock now, 2–4 week response)
5. Create first GitHub Issues for Week 1 work
6. Set up GitHub Project board

**Once repo is set up, every future decision goes into this system.** No more files in Downloads.
