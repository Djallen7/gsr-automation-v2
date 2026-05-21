# Infrastructure Inventory

**Last updated:** 2026-05-20
**Owner:** Daniel

This file is the source of truth for hardware/network facts the automation depends on. Update it whenever a host is added, removed, or moves IPs. Treat it as living documentation — anything stale here will burn us during incident response.

---

## NAS Units

| Hostname | LAN IP | Vendor | Role | Access Level | Admin creds |
|----------|--------|--------|------|-------------|-------------|
| `DRM-QNAP3` | 10.2.2.3 | QNAP (QTS) | File storage — read-only SMB access for automation | ⚠️ Read-only SMB only. No admin. IT manages. | ❌ Not available — IT controlled |
| `DRM-QNAP5` | 10.2.2.5 | QNAP (QTS) | Secondary file storage — read-only SMB access | ⚠️ Read-only SMB only. No admin. IT manages. | ❌ Not available — IT controlled |

**IMPORTANT — 2026-05-20 security incident:** Admin credentials were exposed in a chat session and have been rotated by IT. Daniel no longer has or needs QNAP admin access. The automation system must not attempt to install software, configure settings, or write to the QNAP directly. The only permitted operation is reading finished episode files via the existing SMB share mounts. All automation software runs on a separate machine.

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
| Tailscale tailnet | `danielallen.tn@gmail.com` (Daniel personal) | Owns the tailnet that the QNAPs will join |
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

**Known limitation:** UptimeRobot free tier monitors public HTTP endpoints only. Self-hosted services on QNAP3 (n8n, dashboard) cannot be polled directly. When those come online (Phase 1 Week 5+), decide between (a) upgrade to UptimeRobot Pro for heartbeat / push monitoring (~$7/mo), (b) add Healthchecks.io for heartbeats only, or (c) self-host Uptime Kuma on QNAP3. Not blocking Week 1.

---

## 1Password Vault Status

Vault `GSR Automation` is set up on 1Password Teams (owner: `dallen@davidrives.com`). 15 credential items seeded as empty placeholders on 2026-05-15:

| Phase 1 | Phase 2 | Phase 3 |
|---------|---------|---------|
| QNAP3 admin (server) | Rumble API (pending bd@rumble.com) | Fireside.fm login |
| QNAP5 admin (server) | Signiant Media Shuttle login | StreamHoster FTP |
| GitHub PAT | Google Form (Signiant submission) | |
| Tailscale auth key | | |
| YouTube OAuth | | |
| Dropbox API | | |
| Anthropic API | | |
| ntfy | | |
| UptimeRobot | | |
| n8n admin | | |

Tagging convention: every item has `gsr-automation`, one of `phase-1`/`phase-2`/`phase-3`, and one platform tag (`nas`, `youtube`, `dropbox`, `rumble`, `fireside`, `signiant`, `streamhoster`, `ai`, `github`, `tailscale`, `monitoring`).

Items contain empty secret fields by design — they exist as labeled slots waiting for real credentials. Filling them is gated on issue #10 (QNAP) and Phase 1 Weeks 4–6 (API integrations).

---

## Open Blockers

- **QNAP admin credentials** for both NAS units are not yet in our possession. Vault slot exists, but is empty. Required before Tailscale, n8n install, or any file-watcher work on the NAS side. Tracked as [issue #10](https://github.com/Djallen7/gsr-automation/issues/10) with `blocker` label.

---

## Known Unknowns (to fill in once creds are available)

- Exact QNAP model number for each unit (TS-xxx / TVS-xxx / HS-xxx)
- QTS firmware version per unit
- Installed RAM and free storage per unit
- Whether Container Station is installed (required for Docker / n8n per ADR-0001)
- SMB share names and paths where master video files land
- Existing snapshot / replication configuration (relevant to backup ADR)
