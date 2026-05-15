# ADR-0009: Two-NAS topology — QNAP3 as primary automation host

Date: 2026-05-15
Status: Accepted
Supplements: ADR-0001

## Context

ADR-0001 was written under the assumption that the system runs on a single NAS at 10.2.2.3. During Week 1 Tailscale setup we discovered there are **two QNAP NAS units** on the LAN:

- `DRM-QNAP3` at 10.2.2.3
- `DRM-QNAP5` at 10.2.2.5

Both are QNAP units running QTS. ADR-0001 needs to be supplemented (not superseded) to say which NAS hosts which workload. Without this clarification, future work (Tailscale install, Container Station, n8n, file-watcher path config, runbooks) has no canonical home.

A secondary question — *where the master video files actually live* — also surfaced, but is treated separately in ADR-0010 because it is not yet decided.

## Decision

1. **`DRM-QNAP3` (10.2.2.3) is the primary automation host.** All Docker services from ADR-0001 run here: n8n, Next.js dashboard, SQLite (better-sqlite3), Chokidar file watcher, BullMQ/Redis, faster-whisper transcription, ntfy, Playwright (Phase 2+).
2. **`DRM-QNAP5` (10.2.2.5) is a storage peer, not an automation host.** No automation services are deployed there in any Phase. It may hold master video files that the file watcher needs to see (see ADR-0010 for how the watcher gets to them).
3. **Both NAS units join the Tailscale tailnet** so they are reachable remotely and from each other over a stable address space, regardless of LAN changes.
4. **Both NAS units' admin credentials live in 1Password** before any further infrastructure work happens. No credential is shared by chat, email, sticky note, or unencrypted file.

## Consequences

- Single host for automation keeps the architecture from ADR-0001 intact — we do not introduce distributed-service complexity in Phase 1.
- If QNAP3 fails, the entire automation stack is down. This is acceptable for Phase 1 because the system's job (uploads) is not real-time critical; manual fallback per ADR-0003 handles outages. Multi-NAS HA is explicitly out of scope through Phase 4.
- The file watcher on QNAP3 must be able to read whatever directories on QNAP5 contain master files. The mechanism (SMB mount, NFS mount, rsync staging, Tailscale-only access, etc.) is deferred to ADR-0010.
- Tailscale must be installed on **both** NAS units, not just QNAP3, so remote diagnostics on QNAP5 are possible without LAN access.
- If we later decide to move services off QNAP3 (e.g., to a dedicated mini-PC), that is a new ADR — do not silently migrate.

## Open Questions

- Specs of each unit (model, RAM, free storage) — see `docs/INFRASTRUCTURE_INVENTORY.md`. May influence whether QNAP3 can comfortably run Container Station + n8n + faster-whisper.
- If QNAP3 turns out to be undersized, the choice of automation host may be re-opened. That would be ADR-0011.
