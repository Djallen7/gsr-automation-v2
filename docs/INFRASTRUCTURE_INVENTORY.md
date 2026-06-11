# Infrastructure Inventory

> **SUPERSEDED (Era 1/2) — historical reference only.** This inventory was written when QNAP admin access and self-hosted n8n were the plan. Both are now off the table: QNAP admin is off-limits (cause of the 2026-05-20 incident); n8n is superseded by ADR-0012. **Tailscale is NOT banned** — Tailscale is only restricted when writing to a server; read-only access via Tailscale is permitted (Daniel + David, 2026-06-11). The live system is Supabase + Next.js on Vercel. For authoritative infrastructure restrictions see `docs/_handoff/GSR-WORKFLOW-CANON.md` sections 13-14.

**Last updated:** 2026-05-20
**Owner:** Daniel

This file is the source of truth for hardware/network facts the automation depends on. Update it whenever a host is added, removed, or moves IPs. Treat it as living documentation — anything stale here will burn us during incident response.

---

## NAS Units

| Hostname | LAN IP | Vendor | Role | Access Level | Admin creds |
|----------|--------|--------|------|-------------|-------------|
| `DRM-QNAP3` | 10.2.2.3 | QNAP (QTS) | File storage — read-only SMB access for automation | ⚠️ Read-only SMB only. No admin. IT manages. | ❌ Not available — IT controlled |
| `DRM-QNAP5` | 10.2.2.5 | QNAP (QTS) | Secondary file storage — read-only SMB access | ⚠️ Read-only SMB only. No admin. IT manages. | ❌ Not available — IT controlled |

**2026-05-20 security incident:** Admin credentials were exposed in a chat session and have been rotated by IT. The cause was accessing the QNAP admin dashboard (tweaking server settings). Tailscale itself was not the issue (confirmed by David and Daniel, 2026-06-11). The automation system must not access the QNAP admin dashboard or write to the QNAP under any circumstances. Reading finished episode files via SMB (including over Tailscale) is permitted.

---

## Workstations on Tailnet

| Hostname | Tailscale IP | OS | Owner | Role |
|----------|--------------|-----|-------|------|
| `MacBook Pro` | 100.117.112.127 | macOS | Daniel | Development / admin |
| `DRM-EditBay3mm's Mac mini` | 100.112.34.128 | macOS | DRM (editor) | Edit bay; current Tailscale exit endpoint at 45.22.153.242 |

Tailnet owner: `danielallen.tn@gmail.com`.

---

## Identity / Account Map

| System | Account / Owner Email | Notes |
|--------|----------------------|-------|
| Tailscale tailnet | `danielallen.tn@gmail.com` (Daniel personal) | Owns the tailnet used for remote SMB access to QNAP and ProPresenter mapping |
| 1Password Teams | `dallen@davidrives.com` (ministry email) | Vault `GSR Automation` lives here; ministry-owned for bookkeeping/continuity |
| GitHub repo | `Djallen7` | Owns `gsr-automation` repo |

These are intentionally separate. Do not migrate Tailscale to the ministry email or 1Password to the personal email without an ADR — the separation is the bus-factor protection (FAILURE_MODES.md #7).

---

## Monitoring (UptimeRobot)

| Attribute | Value |
|-----------|-------|
| Account email | `dallen@davidrives.com` |
| Tier | Free (50 monitor limit, 5-min minimum interval) |
| API key | Stored in 1Password item `UptimeRobot — account + API key` ✅ |
| Alert contact | `dallen@davidrives.com` (email) — confirmation may still be pending |
| Monitors live | 1: `dial-tone — github repo` (id 803080384) — health check on the repo URL |

**Known limitation:** UptimeRobot free tier monitors public HTTP endpoints only. For cloud-hosted services (Vercel + Supabase), upgrade to UptimeRobot Pro for heartbeat / push monitoring (~$7/mo) or use Healthchecks.io for heartbeats when needed.

---

## 1Password Vault Status

Vault `GSR Automation` is set up on 1Password Teams (owner: `dallen@davidrives.com`). Items seeded as placeholders:

| Phase 1 | Phase 2 | Phase 3 |
|---------|---------|----------|
| ~~QNAP3 admin~~ (obsolete — admin access not needed) | Rumble API (pending bd@rumble.com) | Fireside.fm login |
| ~~QNAP5 admin~~ (obsolete — admin access not needed) | Signiant Media Shuttle login | StreamHoster FTP |
| GitHub PAT | Google Form (Signiant submission) | |
| Tailscale auth key | | |
| YouTube OAuth | | |
| Dropbox API | | |
| Anthropic API | | |
| ntfy | | |
| UptimeRobot | | |

Tagging convention: every item has `gsr-automation`, one of `phase-1`/`phase-2`/`phase-3`, and one platform tag.

---

## Known Unknowns (to fill in once SMB access is confirmed)

- Exact QNAP model number for each unit (TS-xxx / TVS-xxx / HS-xxx)
- QTS firmware version per unit
- SMB share names and paths where master video files land
- VideoEdit server hostname/IP and SMB share path (needed before linking off local testing)
