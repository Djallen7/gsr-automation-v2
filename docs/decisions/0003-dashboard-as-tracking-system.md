# ADR-0003: Dashboard is a tracking system that sometimes does automated uploads

Date: 2026-05-15
Status: Accepted

## Context

There are two ways to think about the dashboard:
1. "Automation system with manual fallback" — automation is primary, manual is exception
2. "Tracking system with optional automation per platform" — tracking is primary, automation is one feature

Option 1 makes manual workflows feel like failure modes. Option 2 makes manual workflows first-class citizens.

## Decision

We adopt Option 2. Every platform has identical database schema. Only the `uploaded_by` field differs ("automation" vs "Miriam"). Switching a platform between manual and automated is a configuration change, not a redesign.

## Consequences

- Dashboard UI works identically for all platforms regardless of automation state
- Adding automation to a manual platform later is straightforward
- If automation breaks, platform falls back to manual mode without dashboard changes
- This is the graceful degradation pattern that survives real-world platform changes
