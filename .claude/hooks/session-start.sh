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
