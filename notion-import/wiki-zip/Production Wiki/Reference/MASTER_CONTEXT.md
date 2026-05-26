# Master Context — Daniel Allen / GSR Production
**Generated:** 2026-05-20 from full Claude data export
**Source:** memories.json + project_memories across all sessions
**Purpose:** Single reference for any future Claude session to orient fully without re-explanation

---

## 1. WHO DANIEL IS

- **Full name:** Daniel Allen — goes by **Mae**
- **Role:** TV Producer, David Rives Ministries / Genesis Science Network
- **Location:** Smyrna, TN (ministry based in Dickson, TN)
- **Work email:** dallen@davidrives.com
- **Personal email:** danielallen.tn@gmail.com
- **Profile:** Young, risk-averse, non-developer. Prefers GUI tools, SaaS, or AI-assisted approaches. Welcomes direct guidance when he asks for it. Values concise, scannable output. Dislikes hedged options or explanatory framing around deliverables — deliver work product directly.

---

## 2. SHOWS & CONTENT

| Show | Format | Role | Notes |
|------|--------|------|-------|
| **Genesis Science Report (GSR)** | Weekly ~58 min TV, Season 3 | Lead producer, all pre-production | Primary focus |
| **The Heavens Declare (THD)** | Segment within GSR + standalone | Writing | 12 sample scripts exist |
| **Wonders Without Number** | TV show | Graphics operator, run-through support | |
| **Changing the Narrative** | TV show | Graphics operator, run-through support | |
| **Unwrapped** | TV show | Graphics operator, run-through support | |
| **Creation in the 21st Century** | Weekly 30 min on TBN | Support role | Hosted by David Rives |
| **Genesis Science Network (GSN)** | 24/7 linear channel | Operations, station outreach | HLS → SDI receiver boxes |
| **GSR Audio Podcast** | Companion podcast to TV show | Management | |

**GSR Distribution platforms:** YouTube (post-air only), Rumble, Dropbox, Fireside.fm, Signiant Media Shuttle, StreamHoster
**GSR Pre-air platforms:** Roku, Fire TV, Apple TV, iOS app, Rumble, genesissciencenetwork.com
**GSN Carriage:** WGGS-TV (Greenville, SC), WGGN-TV (Sandusky, OH)
**GSN Content library:** 270 hours long-form (28:30 and 1-hr blocks) + hundreds of short-form fillers *(do NOT use "nearly 1,000 hours" — that figure is wrong)*

---

## 3. JOB DUTIES

### Pre-Production (GSR)
- Writing all host copy for teleprompter delivery by David Rives: show intros, opening monologues, segment teases, interview host intros, pre-record segues, Ministry Reports, closing remarks
- Guest identification, matching science stories to expert guests
- Guest outreach, booking, and confirmation emails
- Guest interview angle briefs and research
- Lower third graphics writing (ALL CAPS broadcast style)
- YouTube title creation
- Rundown assembly and management (Rundown Creator)
- Graphics Tracking (Google Sheets)

### Post-Production
- Platform uploads to 6 destinations weekly
- Metadata generation per platform
- Coordinating Miryam on distribution workflow

### Marketing / Promotion
- GSR marketing and social promotion
- Managing GSR companion audio podcast

### Network Operations (GSN)
- Managing 24/7 linear channel operations
- Station outreach for subchannel carriage (73-station prospect list)
- Station relationship management
- HLS stream and SDI receiver box coordination

### Technical / Admin
- Google Drive folder management
- GSN iOS app launch coordination (developer: Jackson Harris)
- Streamhoster and API management
- Claude/AI workflow integration and tooling

---

## 4. PEOPLE & TEAM

| Name | Role | Contact |
|------|------|---------|
| **David Rives** | Host, Ministry President | — |
| **Miryam** | Co-worker, co-maintainer on automation | Works on Macs |
| **Jacob** | Footage transfer, editing, Heavens Declare | — |
| **Murray** | Teleprompter | — |
| **Robert** | Kids Corner scripts | — |
| **Gabe** | Video editing, GSMs, Kids Corners, production day | — |
| **Isaac** | Opening Monologue graphics (standard assignee) | — |
| **Hannah Webster** | Age of Design account, Google Drive collaborator | — |
| **Jackson Harris** | GSN iOS app developer | — |
| **Daniel** (newsroom) | Viewer Voices / newsroom correspondent | Distinct from Daniel Allen |
| **Gabriel / Morgan / Miryam** | Correspondent rotation | Confirm per episode |
| **TD** | Technical director, calls graphics live | End consumer of rundown data |
| **Rob Crowther** | Media & Comms Director, Discovery Institute | rob@discovery.org |
| **Tom Winkler** | Lead Stewardship Officer, Discovery Institute | twinkler@discovery.org |
| **Dr. Stephen Meyer** | Discovery Institute guest | Post-air YouTube coord |
| **Dr. Andrew Fabich** | Microbiologist, returning guest | Truett McConnell / Logos Research; 423-305-2247 |
| **Dr. Joe Deweese** | Biochemist, returning guest | jdeweese@fhu.edu, Freed-Hardeman Univ |
| **Tommy Lohman** | Recurring guest | tommy@creationtruth.org |
| **Tim Mahoney** | Papyrus Anastasi I project | Mahoney Media, Edina, MN |
| **Jane Bjork** | Marketing collaborator | Thinking Man Films |

---

## 5. INFRASTRUCTURE & TOOLS

### Hardware
| Device | IP / ID | Role |
|--------|---------|------|
| MacBook Pro | Tailscale 100.117.112.127 | Daniel's dev / admin machine |
| DRM-EditBay3 Mac Mini | Tailscale 100.112.34.128 | Editor machine, subnet router |
| DRM-QNAP3 | LAN 10.2.2.3 | Planned automation host — currently access-blocked |
| DRM-QNAP5 | LAN 10.2.2.5 | Secondary storage |
| GSN-PropRes | Tailscale 100.98.215.7 | ProPresenter machine |

**QNAP credentials (both units):** admin1 / QnAp7627 — saved in 1Password vault `GSR Automation`
**QNAP status as of 2026-05-19:** Auto-blocked this Mac's IP after failed SSH attempts. Admin access currently uncertain. Physical access required to resolve.

### Software & Services
| Tool | Purpose | Notes |
|------|---------|-------|
| ProPresenter 7 | Live production graphics | Lower thirds, CGs |
| Rundown Creator | Show rundown management | Via MCP; known API bugs — use numeric column IDs |
| Google Sheets | Graphics Tracking | fileId: `1GmdVDOP4h0k6FmOdZLMJNroz7_x4xDcErBYmdGU0890` |
| Google Drive | Shared folder | ID: `18RZ8UNF2nN67G6as-Uj5o5O3BbNFChoR` — had suspension issue |
| Google Calendar | Filming schedule | PROD \| GSR Interviews label |
| Gmail (Composio) | Guest communications | |
| Tailscale | Remote network access | Tailnet: danielallen.tn@gmail.com |
| 1Password Teams | Credentials | dallen@davidrives.com; vault: GSR Automation |
| GitHub (Djallen7) | Version control | gsr-automation (private), gsrguestportal, nextjs-ai-chatbot, RRK, skills |
| Streamhoster | On-demand content | API key managed |
| Fireside.fm | Podcast hosting | Upload target |
| Signiant Media Shuttle | Distribution | Google Form submission |
| Dropbox | File distribution | Upload target |
| UptimeRobot | Monitoring | Free tier; 1 monitor live |
| n8n | Workflow automation | Planned; not yet deployed |
| OBS + obs-localvocal | Live ASR (near-term) | Best available path for ASR→ProPresenter |
| Claude Desktop / Claude Code | AI workflow | Primary AI tool |
| Word / Excel / Markdown | Documents | Core working formats |

### Automation Stack (planned)
- Chokidar (file watcher), better-sqlite3, faster-whisper, Vercel AI SDK + Claude API, youtubeuploader, dropbox-sdk-js, Next.js + shadcn, n8n, ntfy
- Infrastructure choice: QNAP3 (original plan, now blocked) vs. Mac Mini vs. dedicated machine vs. cloud (n8n.cloud + Dropbox/Drive sync)

---

## 6. AUTOMATION GOALS

### Active — GSR Post-Production Pipeline (gsr-automation-v2 repo)

**Architecture as of 2026-05-20 (ADR-0011):**
- QNAP = read-only file source via SMB. No admin access. No software installed on NAS.
- Sync client on Edit Bay Mac Mini watches SMB share, pushes finished episodes to Dropbox/Google Drive
- n8n.cloud orchestrates the pipeline (no self-hosted server)
- Notion = database (replaces SQLite — team visibility, no maintenance)

**Pipeline:**
1. Finished episode saved to QNAP SMB share by editor
2. Sync client on Mac Mini detects it, uploads to cloud (Dropbox or Google Drive)
3. n8n.cloud detects new file, triggers pipeline
4. Transcription (faster-whisper or cloud equivalent)
5. AI metadata generation (Claude API) in GSR style
6. Notion database entry created/updated
7. Dashboard approval gate — human must approve before any upload
8. n8n.cloud uploads to all 6 platforms
9. Status updated in Notion, notifications sent
- Phase 1: YouTube + Dropbox automated; 4 platforms manual-with-assist
- Phase 2: Rumble, Signiant (Playwright)
- Phase 3: Fireside.fm, StreamHoster (FTPS)
- Phase 4: Replicate for other shows

### Active — Writing Automation (Voice DNA System)
- Four Claude Skills: gsr-voice, gsr-structure, gsr-antislop, gsr-episode-writer
- Sample pools: 12 THD scripts, 8 GSR opening monologues
- Short-form layer (tosses, interview intros) to be built via co-creation — cannot be extracted from long-form

### Active — Graphics & Rundown Automation
- Auto-populate Graphics Tracker from rundown data
- Auto-populate Rundown Creator rows
- Production Hub HTML page with isolated prompt files per recurring task
- Show scope selector (per-show without manual editing)

### Aspirational — ProPresenter Integration
- Dynamic lower-third generation from Claude Desktop during live-to-tape
- Live ASR → ProPresenter lower-thirds pipeline (obs-localvocal is current best path; no packaged bridge exists yet)

### Aspirational — GSN Station Outreach
- Cold outreach mail merge and sequencing
- Lightweight CRM for station relationships
- Per-station pitch document generation
- 73-station prospect spreadsheet (GSN_Subchannel_Outreach_Prospects.xlsx)

### Aspirational — GitHub Tool Discovery
- RESOURCES.md living document, batch-tagged, never deleted
- Status flags: 🟢 active, 🟡 maybe later, ⚪ reference only, 📦 archived

---

## 7. PAIN POINTS & MANUAL WORK

- **6-platform weekly upload** — most time-consuming recurring task
- **Manual metadata per platform** — title, description, tags written fresh each week
- **ProPresenter lower-third prep** — fully manual; no live automation path exists yet
- **Rundown Creator API bugs** — `rc_update_row` silently fails with string keys; stale cache on read-after-write
- **QNAP access** — credentials recovered but access now blocked due to SSH incident
- **Google Drive folder** — had suspension incident with personal Gmail transfer; may still be unresolved
- **Claude project file uploads** — 8 of 10 task files unconfirmed in one project; manual verification required
- **iOS app launch timing** — pre-recorded Ministry Report segments announced app as live before actual launch
- **Playwright fragility** — browser automation breaks on UI changes; screenshot-on-failure required

---

## 8. DECISIONS & HARD RULES

### Production Rules (locked, canonical)
- No em dashes anywhere — copy, descriptions, emails, docs
- "But first" restricted to Show Intro pivot only — banned everywhere else
- No participial bridge / "-ing comma" in spoken copy
- No standalone show intro options — Daniel does not need multiple options
- No graphics or chyron support — all copy must be complete and self-contained on the ear
- Viewer Voices tosses: rotate the 4 fixed options, do not write new ones
- Ministry Report intro: use rotation pool (Section 8 of Playbook)
- Pre-air emails reference broadcast platforms; YouTube in post-air only
- Opening Monologue first graphic type: **"Title Graphic"** (NOT "Intro Graphic")
- Safe clear range for Graphics Tracker: C3:G300 only — never C2:G300
- GSN library: **270 hours long-form + hundreds short-form** — never "nearly 1,000 hours"
- Email sign-off: "Best," for guest correspondence

### Automation Decisions (ADRs)
- Dashboard = tracking system that sometimes does automated uploads (not automation with manual fallback)
- Defer Rumble, Fireside, Signiant, StreamHoster to Phase 2+
- Single master metadata per episode in Phase 1; platform variants in Phase 3
- AI metadata generation manually triggered — never automatic
- Tailscale for access; no custom auth layer
- Phase exit criteria must be met before starting next phase

### Infrastructure Decisions (open as of 2026-05-19)
- Original plan: QNAP3 as automation host — now uncertain due to access incident
- Alternatives being evaluated: Mac Mini (performance tradeoff), dedicated small computer (cleanest), cloud path (n8n.cloud + Dropbox/Drive sync)
- ADR-0010 (file-watcher source of truth) still deferred

---

## 9. CONFLICTS & CONTRADICTIONS

| Topic | Conflict | Resolution |
|-------|----------|------------|
| Opening Monologue graphic type | One project memory says "Intro Graphic"; another (019e1e68, more recent) says "Title Graphic" | **Use "Title Graphic"** — more recent session is authoritative |
| GSN content library size | Some contexts say "nearly 1,000 hours" | **Correct figure: 270 hours long-form + hundreds short-form** |
| Automation infrastructure | Original plan = QNAP3; today's incident may change this | **Open — decision needed tomorrow morning** |
| Google Drive folder | Suspension incident mentioned; unclear if resolved | **Verify status before assuming folder is accessible** |

---

## 10. OPEN QUESTIONS

- [ ] QNAP access path going forward — QNAP vs Mac Mini vs dedicated machine vs cloud
- [ ] Google Drive folder — is the suspension resolved? Is the GSR folder accessible?
- [ ] GSN iOS app — actual launch date vs. pre-recorded Ministry Report announcements
- [ ] ADR-0010 — file-watcher source-of-truth (which NAS is canonical)
- [ ] Tim Mahoney interview angle brief — incomplete
- [ ] 8 Claude task files (GSR_Task_01 through GSR_Task_08) — unconfirmed in project, need re-upload
- [ ] Short-form Voice DNA layer — not yet built; co-creation approach agreed but not started
- [ ] QNAP password rotation — QnAp7627 now appears in multiple session transcripts; should be rotated
- [ ] Miryam's 1Password invite — bus-factor risk; not yet invited
- [ ] ADRs 0004–0008 — unwritten (not blocking, but documented gap)

---

## GSR RUN OF SHOW (Season 3 fixed structure)

| Code | Segment |
|------|---------|
| B2 | Show Intro |
| B3 | Opening Monologue |
| B11 | Interview 1 Tease |
| C2 | Interview 1 (Host Intro + live interview) |
| C8 | Segue to THD (Heavens Declare) |
| D2 | Pitch to Kids Corner / Q&A |
| E2 | Ministry Report |
| E4 | Segue to Viewer Voices |
| E6 | Segue to Featured Resource |
| E8 | Segue to Genesis Science Minute |
| E10 | Interview 2 Tease |
| F2 | Interview 2 (Host Intro + live interview) |
| F8 | Closing Remarks |

Pre-recorded segments: THD, Kids Corner, Q&A, Viewer Voices, Featured Resource, Genesis Science Minute

---

*This file should be updated at the end of any significant session. It is the master reference — not a summary.*
