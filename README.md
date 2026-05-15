# Genesis Science Report Production Automation

Automation system for the Genesis Science Report TV show and adjacent ministry shows. Handles file detection, AI metadata generation, approval workflows, and multi-platform distribution.

**Status:** Phase 1 of 4 (Core Foundation — see `docs/PROJECT_PLAN.md`)

## Documentation

- [Project Plan](docs/PROJECT_PLAN.md) — Phased build plan with success rates and exit criteria
- [Failure Modes & Defensive Practices](docs/FAILURE_MODES.md) — 12 documented risks + countermeasures
- [Open Source Stack](docs/OPEN_SOURCE_STACK.md) — Building blocks evaluation for each component
- [GSR Metadata Pattern](docs/GSR_METADATA_PATTERN.md) — YouTube channel analysis, cadence, and metadata rules
- [Architecture Decisions](docs/decisions/) — ADRs documenting major project decisions
- [Runbooks](docs/runbooks/) — Step-by-step guides for handling operational issues

## Project Structure

- `apps/` — Application code (dashboard, services)
- `docs/` — All documentation
- `scripts/` — Helper scripts (backup, deploy, etc.)
- `workflows/n8n/` — Exported n8n workflow JSON files

## Contributors

- Daniel Allen — Project lead
- Miriam — Co-maintainer

## License

Internal/proprietary. Not for public distribution.
