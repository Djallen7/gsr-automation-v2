#!/bin/bash
# Local health check — runs the three static checks and sends a macOS notification.
# Called by the LaunchAgent twice daily. Safe to run manually any time.

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG="$REPO_ROOT/.claude/health-check.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')

echo "" >> "$LOG"
echo "=== GSR Health Check — $TIMESTAMP ===" >> "$LOG"

FAILURES=0
WARNINGS=()

# ── TypeScript ─────────────────────────────────────────────────────────────
DASHBOARD="$REPO_ROOT/apps/dashboard"
if [ -d "$DASHBOARD/node_modules" ]; then
  if (cd "$DASHBOARD" && npx tsc --noEmit >> "$LOG" 2>&1); then
    echo "OK:   TypeScript clean" >> "$LOG"
  else
    echo "FAIL: TypeScript errors" >> "$LOG"
    FAILURES=$((FAILURES + 1))
    WARNINGS+=("TypeScript errors")
  fi
else
  echo "SKIP: TypeScript (node_modules not installed — open Desktop to install)" >> "$LOG"
fi

# ── Routes ─────────────────────────────────────────────────────────────────
if bash "$REPO_ROOT/scripts/check-routes.sh" >> "$LOG" 2>&1; then
  echo "OK:   Routes consistent" >> "$LOG"
else
  echo "FAIL: Route inconsistency" >> "$LOG"
  FAILURES=$((FAILURES + 1))
  WARNINGS+=("Route inconsistency in BUILD_STATUS")
fi

# ── Config ─────────────────────────────────────────────────────────────────
if bash "$REPO_ROOT/scripts/check-config.sh" >> "$LOG" 2>&1; then
  echo "OK:   Config consistent" >> "$LOG"
else
  echo "FAIL: Config issue" >> "$LOG"
  FAILURES=$((FAILURES + 1))
  WARNINGS+=("Config problem in production.json")
fi

# ── Duplicates ─────────────────────────────────────────────────────────────
if bash "$REPO_ROOT/scripts/check-dupes.sh" >> "$LOG" 2>&1; then
  echo "OK:   No duplicate/stale files" >> "$LOG"
else
  echo "FAIL: Duplicate or stale files found" >> "$LOG"
  FAILURES=$((FAILURES + 1))
  WARNINGS+=("Duplicate or stale files")
fi

# ── macOS notification ─────────────────────────────────────────────────────
if [ "$FAILURES" -eq 0 ]; then
  osascript -e 'display notification "All checks passing ✓" with title "GSR Health Check" subtitle "Repo is clean"' 2>/dev/null || true
  echo "RESULT: PASS" >> "$LOG"
else
  MSG=$(IFS=", "; echo "${WARNINGS[*]}")
  osascript -e "display notification \"$MSG\" with title \"GSR Health Check ⚠️\" subtitle \"$FAILURES issue(s) found — open Claude Code\"" 2>/dev/null || true
  echo "RESULT: $FAILURES FAILURE(S)" >> "$LOG"
fi

# Keep log to last 500 lines
if [ -f "$LOG" ]; then
  tail -n 500 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi

exit 0
