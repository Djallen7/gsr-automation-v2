#!/bin/bash
set -euo pipefail

# PreToolUse hook for Bash — blocks git commits when TypeScript has errors.
# Exits 0 immediately for every non-commit command so there is no latency impact.

REPO_ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
DASHBOARD="$REPO_ROOT/apps/dashboard"

# Parse the bash command from hook stdin JSON
COMMAND=$(python3 -c "
import json, sys
try:
    data = sys.stdin.read()
    d = json.loads(data) if data.strip() else {}
    print(d.get('tool_input', {}).get('command', ''))
except Exception:
    print('')
" 2>/dev/null || echo "")

# Only run on actual git commit commands (at start or after shell separator)
if ! echo "$COMMAND" | grep -qE '(^|[;&])[[:space:]]*git[[:space:]]+commit'; then
  exit 0
fi

# Secret guard: never let a real secret be exposed with a NEXT_PUBLIC_ prefix
# (NEXT_PUBLIC_* is inlined into the client bundle). Scans staged additions.
SECRET_HITS=$(git -C "$REPO_ROOT" diff --cached -U0 2>/dev/null \
  | grep -E '^\+' \
  | grep -iE 'NEXT_PUBLIC_[A-Z0-9_]*(KEY|SECRET|TOKEN|PASSWORD)' \
  | grep -ivE 'PUBLISHABLE_KEY|ANON_KEY' || true)
if [ -n "$SECRET_HITS" ]; then
  echo "ERROR: a secret-looking value is being committed with a NEXT_PUBLIC_ prefix"
  echo "       (NEXT_PUBLIC_* ships to the browser). Offending staged line(s):"
  echo "$SECRET_HITS"
  echo "Rename it to a server-only var (no NEXT_PUBLIC_ prefix) before committing."
  exit 2
fi

# Skip if dashboard node_modules aren't installed yet
if [ ! -d "$DASHBOARD/node_modules" ]; then
  echo "WARN: node_modules not found — skipping TypeScript check"
  exit 0
fi

# Skip if no dashboard source files are staged
if ! git -C "$REPO_ROOT" diff --cached --name-only 2>/dev/null | grep -q "^apps/dashboard/"; then
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
