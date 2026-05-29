#!/bin/bash
# Route consistency: every page route in BUILD_STATUS.html must have a page.tsx

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DASHBOARD="$REPO_ROOT/apps/dashboard/src/app"
BUILD_STATUS="$REPO_ROOT/BUILD_STATUS.html"

echo "=== Route consistency check ==="

if [ ! -f "$BUILD_STATUS" ]; then
  echo "SKIP: BUILD_STATUS.html not found"
  exit 0
fi

FAILURES=0

# Extract page routes: <span class="route-path">/...</span>
# Skip API routes (/api/) and auth callbacks (/auth/)
ROUTES=$(grep -oP '(?<=<span class="route-path">)/[^<]+' "$BUILD_STATUS" \
  | grep -vE '^/api/|^/auth/' \
  | sort -u)

for route in $ROUTES; do
  dir="${route#/}"       # strip leading /
  page_tsx="$DASHBOARD/$dir/page.tsx"
  page_ts="$DASHBOARD/$dir/page.ts"

  if [ -f "$page_tsx" ] || [ -f "$page_ts" ]; then
    echo "OK:      $route"
  else
    echo "MISSING: $route  →  apps/dashboard/src/app/$dir/page.tsx not found"
    FAILURES=$((FAILURES + 1))
  fi
done

if [ "$FAILURES" -gt 0 ]; then
  echo ""
  echo "FAIL: $FAILURES route(s) in BUILD_STATUS.html have no corresponding page file."
  exit 1
fi

echo "All routes consistent."
