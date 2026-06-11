# Infrastructure & security

**Load when:** ProPresenter/ATEM/Companion/QNAP, off-limits gear, SSH/remote access, credentials, the 2026-05-20 incident.
**Authoritative source:** `CLAUDE.md` "Off-limits to automation" + "Security Rules".

## Entries
### standing — Off-limits to automation (non-negotiable)  [status: active]
- **ProPresenter production machine** (GSN-PropRes, Tailscale 100.98.215.7) — test-machine only; never command production via automation until David explicitly approves.
- **ATEM, Bitfocus Companion** — production hardware, hands-off.
- **QNAP** — read-only SMB only; no admin, no writes, no file-watchers.
- **No Tailscale / direct server tools** — permanently off-limits after the **2026-05-20 security incident**; all automation goes through cloud APIs or read-only SMB.
- **Notion** — wiki-only after ADR-0012.
Source: `CLAUDE.md`

### standing — Credentials & SSH  [status: active]
Decision: never paste/expose credentials in chat; retrieve via 1Password CLI by item name. Never SSH into any production machine without Daniel explicitly saying "yes, SSH into [machine]". State blast radius before any command touching a network/shared resource.
Source: `CLAUDE.md`
