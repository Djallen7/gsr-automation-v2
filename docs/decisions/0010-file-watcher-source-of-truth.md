# ADR-0010: File-watcher source-of-truth strategy

Date: 2026-05-15
Status: **Superseded by ADR-0011 (moot).** File watchers are off-limits; the question was never resolved and no longer applies. Historical record only.
Related: ADR-0001, ADR-0009

## Question

The Chokidar file watcher runs on `DRM-QNAP3` per ADR-0009, but master video files currently land on **both** `DRM-QNAP3` and `DRM-QNAP5`. Which path(s) does the watcher monitor?

## Options

- **A — Single canonical dropbox on QNAP3.** Editors drop new masters into one path on QNAP3 only. QNAP5 is treated as archive storage, not a source. Simple; requires changing editor habits.
- **B — Cross-NAS mount.** QNAP3 mounts QNAP5 shares (SMB/NFS) so the watcher sees both. No workflow change; but cross-NAS notifications often fall back to polling, and the mount is a documented failure mode (see `FAILURE_MODES.md` #3).

## Why deferred

Choosing requires (a) finishing the infrastructure inventory once we have QNAP admin access, and (b) a conversation with the editor and Miryam about which option fits their workflow. Recording this ADR now so the question is not lost.

## Trigger to resolve

Start of Phase 1 Week 2 (database + file watcher). The watcher implementation must not begin until this ADR is marked Accepted.
