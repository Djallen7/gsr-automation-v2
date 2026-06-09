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

# Route snapshot (the BUILD_STATUS.html-policing scripts were retired in the V3 reset;
# count live route files directly instead).
ROUTE_COUNT=$(find "$DASHBOARD/src/app" \( -name 'page.tsx' -o -name 'route.ts' \) 2>/dev/null | wc -l | tr -d ' ')
echo "Routes:      $ROUTE_COUNT page/route files in src/app"

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

# ── Handoff pointers (read first) ────────────────────────────────────────────
echo ""
echo "=== Read first (single source of truth) ==="
for f in \
  "docs/_handoff/HANDOFF.md" \
  "docs/_handoff/2026-06-04-SYSTEM-EVOLUTION.md" \
  "docs/_handoff/VERIFIED-FACTS.md" \
  "docs/_handoff/GSR-WORKFLOW-CANON.md" \
  "docs/_handoff/2026-06-08-basecamp-map.md"; do
  if [ -f "$REPO_ROOT/$f" ]; then echo "  - $f"; fi
done
echo "  Invoke the gsr-architect subagent for GSR work; it boots knowing the system."

# ── Project + git state ──────────────────────────────────────────────────────
echo ""
echo "=== Git state ==="
echo "  branch: $(git -C "$REPO_ROOT" branch --show-current 2>/dev/null || echo '?')"
echo "  recent commits:"
git -C "$REPO_ROOT" log --oneline -5 2>/dev/null | sed 's/^/    /' || true
if git -C "$REPO_ROOT" fetch origin main --quiet 2>/dev/null; then
  AHEAD=$(git -C "$REPO_ROOT" rev-list --count HEAD..origin/main 2>/dev/null || echo "?")
  echo "  origin/main is $AHEAD commit(s) ahead of this branch"
fi
if command -v gh &>/dev/null; then
  OPEN_PRS=$(gh pr list --repo Djallen7/gsr-automation-v2 --state open \
    --json number,title,headRefName \
    --jq '.[] | "    #\(.number) \(.title) [\(.headRefName)]"' 2>/dev/null || true)
  if [ -n "$OPEN_PRS" ]; then echo "  open PRs:"; echo "$OPEN_PRS"; fi
fi

# ── Basecamp access token ────────────────────────────────────────────────────
# Mint a fresh ~14-day token from the stored refresh token (set BASECAMP_*
# env vars). Written mode-600 to a file; never printed. See
# docs/_handoff/2026-06-08-basecamp-map.md.
echo ""
BC_HELPER="$REPO_ROOT/scripts/basecamp_token.py"
BC_TOKEN_FILE="$HOME/.gsr-basecamp-access-token"
if [ -n "${BASECAMP_REFRESH_TOKEN:-}" ] && [ -f "$BC_HELPER" ]; then
  if BC_TOKEN=$(python3 "$BC_HELPER" 2>/dev/null); then
    ( umask 077; printf '%s' "$BC_TOKEN" > "$BC_TOKEN_FILE" )
    echo "Basecamp: fresh token at $BC_TOKEN_FILE (not printed). API base https://3.basecampapi.com/$(printf '%s' "${BASECAMP_ACCOUNT_ID:-}" | tr -d '[:space:]')"
  else
    echo "Basecamp: token refresh failed; diagnose with: python3 scripts/basecamp_token.py --check"
  fi
else
  echo "Basecamp: BASECAMP_REFRESH_TOKEN not set; token not minted."
fi

echo ""
