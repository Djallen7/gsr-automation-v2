<!-- ARCHIVE: GSR Automation Reference -->
<!-- DOMAIN: systems -->
<!-- KEYWORDS: tools, apps, integrations, Notion, Drive, Rundown Creator, Supabase, Vercel, ProPresenter, ATEM, QNAP, Headroom, Basecamp, Slack, 1Password, StreamHoster, Fireside, Signiant, RLN, DuckDB, Timesketch, mac_apt, Homebrew, GitHub -->
<!-- SOURCES: FINDINGS.md, CLAUDE.md -->
<!-- UPDATED: 2026-05-28 -->

# GSR System Map

Reference for all tools, platforms, and integrations active in the GSR Automation project.
Read alongside `CLAUDE.md` for operational rules and off-limits systems.

---

## Active Production Tools

### Content & Planning
| Tool | Role | Notes |
|------|------|-------|
| **Rundown Creator** (rundowncreator.com) | Show rundown / script | 1,750 browser visits; primary scripting tool |
| **Google Drive** | File storage | Episode docs, interview schedules, graphics tracking; desktop app installed 2026-04-27 |
| **Notion** | Workspace / wiki | 65K files, 6.8GB local cache; moving AWAY per ADR-0012; do not extend pre-pivot scripts |
| **Basecamp** (basecamp.com) | Team project management | 575 visits |
| **Slack** | Team comms | Reinstalled 2026-04-15 |

### Email
| Tool | Role | Notes |
|------|------|-------|
| **Roundcube** (cprapid.com:2096) | Primary work email | dallen@davidrives.com; 4,077 visits — most-used email interface |
| **Gmail** (mail.google.com) | Secondary / personal | 1,394 visits; danielallen.tn@gmail.com |

### Development & Deployment
| Tool | Role | Notes |
|------|------|-------|
| **GitHub** | Source control | Repo: djallen7/gsr-automation-v2; 1,658 visits |
| **Supabase** | Database + auth + Edge Functions | Project ID: `lafkbxypmciopebentxp`; Postgres + RLS; 13 migrations applied as of 2026-05-28 |
| **Vercel** | Dashboard hosting | Deploys `apps/dashboard` (Next.js 16) |
| **Node.js** | Runtime | Installed 2026-04-21 |
| **Homebrew** | Package manager | Cask installs; standard Mac tooling |

### AI / Claude
| Tool | Role | Notes |
|------|------|-------|
| **claude.ai** | Planning / writing | 1,667 visits |
| **platform.claude.com** | Claude Code platform | 602 visits |
| **Claude API** | App integration | Called from server actions / API routes only — never from client; model: claude-opus-4-7 |

### Credentials
| Tool | Role | Notes |
|------|------|-------|
| **1Password** | Credential manager | Always use `op item get "[item]" --fields password --reveal`; never paste credentials in chat |

---

## Distribution & Delivery

| Platform | Role | Notes |
|----------|------|-------|
| **Signiant Media Shuttle** | Delivery to Real Life Network (RLN) | RLN = same as RightNow Media |
| **StreamHoster** | FTP delivery | Roku, Apple TV, iOS app, LG TV |
| **Fireside.fm** | Podcast hosting | Auto-feeds Spotify + Apple Podcasts |
| **YouTube / Rumble / Dropbox** | Additional distribution | See segment/distribution docs |

---

## Data & Analytics Tools (Local)

| Tool | Role | Notes |
|------|------|-------|
| **DuckDB 1.5.3** | Local analytics | `inventory.duckdb`; 27 tables, 9 views |
| **Timesketch** | Forensic timeline UI | Docker, local http://localhost; login: daniel |
| **mac_apt v1.29.3** | Mac forensic tool | 49 plugins, 12GB output |
| **Headroom** | Note-taking / recording app | 73K files, 1.7GB — high file count; purpose inferred |

---

## Off-Limits Systems (Non-Negotiable)

These systems must never be touched by automation. See `CLAUDE.md` "Off-limits" section.

| System | Identifier | Rule |
|--------|-----------|------|
| **ProPresenter** (production) | GSN-PropRes / Tailscale 100.98.215.7 | David Rives operates this live; automation = OFF LIMITS |
| **ATEM** | Production switcher | OFF LIMITS |
| **Bitfocus Companion** | Broadcast control | OFF LIMITS |
| **QNAP NAS** | /Volumes/GSR (read-only SMB) | Write access deliberately excluded; admin doesn't exist |
| **Notion** (new automation) | — | Wiki-only after ADR-0012; do not extend pre-pivot `scripts/notion_*.py` |

---

## Installed But Light Use / Personal

| App | Notes |
|-----|-------|
| **Canva** | Design; reinstalled 2026-04-15 |
| **Keynote / Pages / Numbers** | Apple productivity; reinstalled 2026-04-15 |
| **TestFlight** | App testing; reinstalled 2026-04-15 |
| **SiteSucker** | Web archiving tool |
| **Magnet** | Window manager |
| **Dev App** | Local dev reference |
| **Sleeper** | Fantasy football — not work |

---

## Machine Timeline

| Date | Event |
|------|-------|
| 2024-11-28 | Mac first set up (50 items) |
| 2026-04-15 | Batch reinstall — TestFlight, SiteSucker, Magnet, Numbers, Dev App, Pages, Keynote, Slack, Canva, Usage for Claude |
| 2026-04-21 | Node.js installed |
| 2026-04-27 | Google Drive desktop app installed |
| 2026-05-19 | Security incident / cloud-first rebuild |
