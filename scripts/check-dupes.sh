#!/bin/bash
# Duplicate and stale file detection

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$REPO_ROOT/apps/dashboard/src"

echo "=== Duplicate / stale file check ==="

FAILURES=0

# 1. Backup / temp files that shouldn't be in the repo
STALE=$(find "$REPO_ROOT" \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/.next/*" \
  \( -name "*.bak" -o -name "*.old" -o -name "*_backup.*" \
     -o -name "*.tmp" -o -name "*~" -o -name "* copy.*" \
     -o -name "*_copy.*" -o -name "*-copy.*" \) \
  2>/dev/null || true)

if [ -n "$STALE" ]; then
  echo "STALE FILES:"
  echo "$STALE"
  FAILURES=$((FAILURES + 1))
fi

# 2. Both page.tsx AND page.ts in the same directory
while IFS= read -r tsx_file; do
  dir=$(dirname "$tsx_file")
  ts_file="$dir/page.ts"
  if [ -f "$ts_file" ]; then
    echo "CONFLICT: $dir has both page.ts and page.tsx"
    FAILURES=$((FAILURES + 1))
  fi
done < <(find "$SRC/app" -name "page.tsx" 2>/dev/null)

# 3. Both route.tsx AND route.ts in same directory
while IFS= read -r tsx_file; do
  dir=$(dirname "$tsx_file")
  ts_file="$dir/route.ts"
  if [ -f "$ts_file" ]; then
    echo "CONFLICT: $dir has both route.ts and route.tsx"
    FAILURES=$((FAILURES + 1))
  fi
done < <(find "$SRC/app" -name "route.tsx" 2>/dev/null)

# 4. Duplicate component names (same filename in multiple locations — warn only)
DUPE_COMPONENTS=$(find "$SRC" -name "*.tsx" -not -name "page.tsx" -not -name "layout.tsx" \
  -not -path "*/node_modules/*" 2>/dev/null \
  | xargs -I{} basename {} \
  | sort | uniq -d)

if [ -n "$DUPE_COMPONENTS" ]; then
  echo "WARN: Duplicate component filenames (may be intentional):"
  while IFS= read -r name; do
    echo "  $name:"
    find "$SRC" -name "$name" -not -path "*/node_modules/*" 2>/dev/null | sed 's/^/    /'
  done <<< "$DUPE_COMPONENTS"
fi

if [ "$FAILURES" -eq 0 ]; then
  echo "No stale or conflicting files found."
fi

exit $FAILURES
