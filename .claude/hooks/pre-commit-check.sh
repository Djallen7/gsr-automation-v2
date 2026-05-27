#!/bin/bash
set -euo pipefail

# PreToolUse hook for Bash — blocks git commits when TypeScript has errors.
# Exits 0 immediately for every non-commit command so there is no latency impact.

REPO_ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
DASHBOARD="$REPO_ROOT/apps/dashboard"

# Parse the bash command from hook stdin JSON
TOOL_INPUT=$(cat 2>/dev/null || echo '{}')
COMMAND=$(python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('command', ''))
except:
    print('')
" <<< "$TOOL_INPUT" 2>/dev/null || echo "")

# Only run on git commit calls
if [[ "$COMMAND" != *"git commit"* ]]; then
  exit 0
fi

# Skip if dashboard node_modules aren't installed yet
if [ ! -d "$DASHBOARD/node_modules" ]; then
  echo "WARN: node_modules not found — skipping TypeScript check"
  exit 0
fi

# Skip if no dashboard source files are staged
if ! git -C "$REPO_ROOT" diff --cached --name-only 2>/dev/null | grep -q "^apps/dashboard/src/"; then
  exit 0
fi

echo "=== Pre-commit: TypeScript check ==="
cd "$DASHBOARD"

if ! npx tsc --noEmit 2>&1; then
  echo ""
  echo "ERROR: TypeScript errors found. Fix them before committing."
  exit 2
fi

echo "=== TypeScript: clean ==="
