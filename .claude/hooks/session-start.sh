#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web (remote sessions).
# Local dev machines manage their own node_modules.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

REPO_ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
DASHBOARD="$REPO_ROOT/apps/dashboard"

echo "=== Session start: installing dashboard dependencies ==="

if [ ! -d "$DASHBOARD" ]; then
  echo "ERROR: $DASHBOARD not found" >&2
  exit 1
fi

cd "$DASHBOARD"

# npm install is preferred over npm ci here: the container state is cached
# after the hook completes, so a cached node_modules is faster on resume.
npm install --prefer-offline --no-audit --no-fund

echo "=== Dependencies ready ==="

# Sanity-check: confirm TypeScript and ESLint binaries are reachable.
echo "tsc: $(npx tsc --version)"
echo "eslint: $(npx eslint --version)"

# ── Copy repo agents to ~/.claude/agents/ ─────────────────────────────────
# Agents in .claude/agents/ are version-controlled; copy to home so Claude
# can invoke them by name during this session.
AGENTS_SRC="$REPO_ROOT/.claude/agents"
AGENTS_DST="$HOME/.claude/agents"

if [ -d "$AGENTS_SRC" ] && [ "$(ls -A "$AGENTS_SRC" 2>/dev/null)" ]; then
  mkdir -p "$AGENTS_DST"
  cp -f "$AGENTS_SRC"/*.md "$AGENTS_DST/" 2>/dev/null || true
  echo "=== Agents installed: $(ls "$AGENTS_DST"/*.md 2>/dev/null | wc -l | tr -d ' ') agent(s) ready ==="
fi

# ── Quick health snapshot ──────────────────────────────────────────────────
echo ""
echo "=== Quick health snapshot ==="

# TypeScript check (fast — just type errors, not build)
TS_RESULT="clean"
if ! (cd "$DASHBOARD" && npx tsc --noEmit 2>/dev/null); then
  TS_RESULT="ERRORS FOUND"
fi
echo "TypeScript:  $TS_RESULT"

# Route consistency
ROUTE_RESULT="consistent"
if ! bash "$REPO_ROOT/scripts/check-routes.sh" > /dev/null 2>&1; then
  ROUTE_RESULT="INCONSISTENT — run: bash scripts/check-routes.sh"
fi
echo "Routes:      $ROUTE_RESULT"

# Open health-check issues (check if gh is available)
if command -v gh &>/dev/null; then
  OPEN_ISSUES=$(gh issue list --repo Djallen7/gsr-automation-v2 \
    --label health-check-failure --state open --json number,title \
    --jq 'length' 2>/dev/null || echo "0")
  if [ "$OPEN_ISSUES" -gt 0 ]; then
    echo "Health issues: $OPEN_ISSUES open — run: gh issue list --label health-check-failure"
  else
    echo "Health issues: none open"
  fi
fi

echo ""
