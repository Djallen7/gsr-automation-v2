# ADR-0002: Defer Rumble, Fireside, Signiant, StreamHoster automation to later phases

Date: 2026-05-15
Status: Accepted

## Context

Of the six upload destinations, four have significant automation challenges:
- **Rumble:** Requires bd@rumble.com approval for API access (2-4 week timeline)
- **Fireside.fm:** No upload API exists at all — requires browser automation
- **Signiant Media Shuttle:** Metadata entered via Google Form, requires browser automation
- **StreamHoster:** FTP-based, ancient protocol with many edge cases

Building automation for these in Phase 1 would extend the timeline by 8+ weeks and introduce four sources of ongoing maintenance burden (UI changes, API approval delays, protocol issues).

## Decision

Phase 1 includes only fully-automated YouTube and Dropbox uploads. The other four platforms are tracked in the dashboard with "Copy metadata" and "Mark as uploaded" buttons for manual workflow. Automation for those platforms is deferred to Phase 2 (Signiant, Rumble) and Phase 3 (Fireside, StreamHoster), with explicit acknowledgment that Phase 3 may never be implemented.

## Consequences

- Phase 1 timeline drops from ~16 weeks to ~8 weeks
- Phase 1 success probability rises from 45-55% to 70-80%
- Manual workflow for 4 platforms takes ~3 min/episode each (~12 min total/week)
- Dashboard architecture must support both manual and automated modes from day one
- We can switch any platform from manual to automated later via configuration change
