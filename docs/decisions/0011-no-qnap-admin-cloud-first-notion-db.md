# ADR-0011: No QNAP Admin Access — Cloud-First Architecture with Notion Database

**Date:** 2026-05-20
**Status:** **Superseded by ADR-0012 (2026-05-23) for the database choice (Notion -> Supabase).** The cloud-first, no-local-server, QNAP-read-only, and security-framework principles carry forward; Notion-as-database does not.
**Supersedes:** ADR-0009 (two-NAS topology), ADR-0010 (file-watcher source of truth)

---

## Context

On 2026-05-19, a security incident occurred during a Claude Code session in which QNAP admin credentials were exposed in chat and transmitted to Anthropic's servers. IT rotated all QNAP credentials and passwords across 40+ connected devices. As a result:

- Daniel no longer has QNAP admin credentials and will not be given them
- All automation software previously planned to run on QNAP3 (n8n, Docker, SQLite, file-watcher) cannot be deployed there
- The only permitted QNAP interaction is reading finished episode files via existing SMB share mounts

Additionally, David (ministry president) has outlined a security framework requiring:
- Isolated, controlled connections only
- No blanket server folder access
- Test on non-critical hardware before production
- Nothing that could cascade to production broadcast hardware (ProPresenter, ATEM, Bitfocus Companion)

## Decision

**Architecture shifts to a cloud-first approach:**

1. **Database:** Notion replaces SQLite. Episode tracking, status, and metadata live in a Notion database accessible to the whole team without any local server.

2. **File detection:** A sync client (Dropbox or Google Drive) running on the Edit Bay Mac Mini watches the QNAP SMB share (read-only) and syncs finished episodes to the cloud. This is the trigger for all automation — not a file watcher on the NAS.

3. **Orchestration:** n8n.cloud replaces a self-hosted n8n instance on QNAP. No local server required.

4. **QNAP role:** Read-only file source only. SMB mounts on the Mac Mini provide access. No software installed on the QNAP. No admin access required.

5. **Automation host:** The Edit Bay Mac Mini (DRM-EditBay3) handles the sync client only — lightweight background task. All heavy processing (transcription, AI, uploads) runs in the cloud or on n8n.cloud.

## Consequences

- Eliminates the need for QNAP admin access entirely
- Eliminates local server infrastructure (no Docker, no self-hosted n8n, no SQLite)
- Notion introduces a recurring cost but provides team visibility and no maintenance overhead
- n8n.cloud introduces a recurring cost but eliminates server management
- File sync adds latency (minutes, not seconds) before automation triggers — acceptable given episode cadence
- The architecture is simpler, safer, and fully aligns with David's security requirements
- ADR-0009 and ADR-0010 are superseded — QNAP is no longer the automation host

## Open Questions

- Which sync client: Dropbox (already a distribution target) or Google Drive?
- Notion database schema — to be designed in Phase 1 Week 2
- n8n.cloud tier — free tier may be sufficient for Phase 1 volume
