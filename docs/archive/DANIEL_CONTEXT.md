<!-- ARCHIVE: GSR Automation Reference -->
<!-- DOMAIN: context -->
<!-- KEYWORDS: Daniel Allen, Daniew, collaborator, communication, schedule, team, Miryam, David Rives, GSR, ministry, non-developer, danielallen.tn@gmail.com, dallen@davidrives.com, Smyrna, ProPresenter MCP, Hannah Webster, Age of Design -->
<!-- SOURCES: FINDINGS.md, CLAUDE.md, personal-claude.md -->
<!-- UPDATED: 2026-05-28 -->

# Daniel Allen — Context Reference

## Identity

| Field | Value |
|---|---|
| Name | Daniel Allen (goes by **Daniew**) |
| Personal email | danielallen.tn@gmail.com |
| Work email | dallen@davidrives.com |
| Location | Smyrna, TN |
| Role | Project owner, non-developer |
| Employer | David Rives Ministries |
| Show | Genesis Science Report (GSR) — Christian creation-science TV, ~58 min, weekly, Season 3 |
| Mac provisioned | 2024-11-28 (~5.5 months old as of 2026-05-28) |

## Role & Working Style

- **Non-developer.** Uses Claude Code as his sole coding mechanism. Cannot debug TypeScript, SQL, or shell scripts unassisted.
- Relies on Claude Code for all feature building, migrations, and debugging.
- Prefers dense, factual output. Does not need concepts over-explained.
- Works in long sessions — often 12–23 hours of computer-touching per day during intense build periods.
- Late-night worker. Active band 14:00–01:00; regularly works into 1–3 AM.
- Peak productivity hour: 20:00 (8 PM).

## Key Collaborators

| Person | Role | Constraint |
|---|---|---|
| David Rives | On-screen talent, ministry director | "The David rule": if something going wrong falls on him to fix, redesign the approach. Never affect his production machine. |
| Miryam | Core producer alongside Daniel | ~7–8 crew on shoot days |

## Communication

- **iMessage is the dominant incoming file channel:** 1,826 messages vs 108 Chrome downloads — files arrive via Messages first, then Chrome, AirDrop, Safari, Homebrew.
- Primary webmail: cprapid.com/roundcube (4,077 visits).
- Google services used heavily: Drive, Docs, Photos, Gmail.

## App & Tool Footprint

| App | Files | Disk |
|---|---|---|
| Headroom | 73,817 | 1,733 MB |
| Notion | 65,375 | 6,778 MB |
| Claude (CLI) | 32,069 | 14,366 MB |
| Google Chrome + sync | 8,981 | 5,934 MB |
| Adobe | 1,774 | 59 MB (barely used — 14 active days) |

- **Notion** is the primary workspace by disk and file count.
- **Claude CLI** holds 14 GB of session history — the largest single disk consumer.
- Adobe tools exist but are largely inactive.

## Top Browsing Domains (all-time)

| Domain | Visits |
|---|---|
| google.com | 7,563 |
| cprapid.com / roundcube webmail | 4,077 |
| sleeper.com | 3,453 |
| docs.google.com | 2,628 |
| accounts.google.com | 2,132 |
| rundowncreator.com | 1,750 |
| claude.ai | 1,667 |
| github.com | 1,658 |
| keeptradecut.com | 1,564 |
| drive.google.com | 1,468 |
| mail.google.com | 1,394 |
| photos.google.com | 1,333 |
| notion.so | 1,113 |
| platform.claude.com | 602 |
| basecamp.com | 575 |

## Non-Work Pattern

- **Fantasy football** is the only clearly visible non-work pattern: Sleeper.com (3,453 visits), keeptradecut.com (1,564 visits).

## Device History

- 15+ iCloud-registered devices: MacBook Pro, iPhone (+2, +3 models), iPhone 13, iPad.
- Earliest iCloud file: 1999-10-01.

## Security Incident

- **May 19, 2026:** Security incident — cloud-first rebuild, contaminated local filesystem timestamps.
- All timestamp-based forensics from before May 19 must be treated as approximate; file dates on the local Mac are not reliable for pre-incident analysis.

## ProPresenter MCP Project

Daniel is building a ProPresenter MCP integration to push lower-third graphics from a laptop during live tapings of GSR.

- **Repo:** `~/propresenter-mcp/`
- **Connection:** Tailscale to the studio Mac
- **Status:** Active development; NOT yet approved for production use (David rule applies)
- **Constraint:** All work on test machine only; never connect to production ProPresenter machine (GSN-PropRes, Tailscale 100.98.215.7) via any automated process until explicitly approved by David

## GSR Shared Drive — Collaborators

Confirmed folder access beyond Daniel:
- **Hannah Webster**
- **Age of Design** account

## Episode Authorship Note

Daniel authored GSR Ep016 with guests Dr. Frank Sherwin (exoplanet HD 137010 b) and Dr. Stephen Meyer (DNA/information theory/intelligent design).

## Hard Constraints (from CLAUDE.md)

- Never SSH into a production machine without explicit confirmation.
- Never expose credentials in chat — always retrieve via 1Password CLI.
- ProPresenter production machine (GSN-PropRes, Tailscale 100.98.215.7) is off-limits.
- ATEM, Bitfocus Companion, QNAP write access — all off-limits.
- Notion workspace is read-only / wiki-only after ADR-0012 (Supabase pivot, 2026-05-23).
