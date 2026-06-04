# ADR-0001: Use n8n as orchestrator, Next.js dashboard, Docker services on NAS

Date: 2026-05-15
Status: **Historical — superseded by ADR-0011 (cloud pivot) and ADR-0012 (Supabase + Next.js).** Only the Next.js dashboard choice survives. n8n, SQLite, Docker-on-NAS, and Tailscale are dead/off-limits (the 2026-05-20 security incident permanently barred Tailscale and local servers).

## Context

We need to choose the foundational architecture for the GSR automation system. The team is non-developer (broadcast TV producer + colleague), so maintainability and visual debugging matter more than performance optimization. The system runs on an existing QNAP NAS with remote access via Tailscale.

> **Update 2026-05-15:** This ADR originally referenced a single NAS at 10.2.2.3. During Week 1 setup we discovered a second QNAP at 10.2.2.5. See ADR-0009 for the two-NAS topology and which NAS hosts which workload. ADR-0001's tech-stack decision is unchanged.

## Decision

- **n8n** (self-hosted, Docker) as the workflow orchestrator
- **Next.js dashboard** forked from Kiranism/next-shadcn-dashboard-starter
- **SQLite** (better-sqlite3) for status tracking database
- **Docker** for service isolation (transcription, browser automation, etc.)
- **Tailscale** for secure remote access; no custom authentication

## Consequences

- Visual workflow editor lowers maintenance barrier for non-developer team
- Service-oriented architecture isolates component failures
- Forking proven dashboard template avoids 100+ hours of UI development
- Tailscale eliminates custom auth complexity
- Trade-off: n8n's fair-code license means we can't resell it as a service (we're not, so this is fine)
