# ADR-0006: AI-assisted metadata requires human approval before publish

Date: 2026-06-04 (recorded 2026-06-08)
Status: Accepted

## Context

As metadata generation moves along the maturity dial (Manual -> Prompt-handoff -> Auto), any AI-touched output (a title hook, an AI-assisted description, social copy) could reach a public platform unreviewed. A wrong title or claim going public lands on David.

## Decision

Any AI-generated or AI-assisted metadata must pass an explicit human approval gate before it publishes, using the same dry-run plus typed-YES discipline as the lower-thirds import. `app_config` holds the per-task maturity stage; even at the "Auto" stage, publishing AI-touched metadata to a public platform still requires a human confirm until that specific path is explicitly trusted.

## Consequences

- AI speeds drafting but never publishes unreviewed.
- Protects David on air from a wrong title or claim reaching the public.
- Consistent with the David Rule and the lower-thirds Type-YES gate.
- Templated, non-AI metadata (ADR-0004) is the default; this gate applies specifically to the AI-assisted variable parts.
