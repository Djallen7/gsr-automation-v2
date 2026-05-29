#!/bin/bash
# Config sanity: verify production.json and docs are internally consistent

set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG="$REPO_ROOT/config/production.json"

echo "=== Config sanity check ==="

FAILURES=0

if [ ! -f "$CONFIG" ]; then
  echo "SKIP: config/production.json not found"
  exit 0
fi

# 1. Show name must be "Genesis Science Report"
SHOW_NAME=$(python3 -c "
import json
d = json.load(open('$CONFIG'))
print(d.get('show', {}).get('name', ''))
" 2>/dev/null || echo "")
if [ "$SHOW_NAME" = "Genesis Science Report" ]; then
  echo "OK:   show.name = $SHOW_NAME"
else
  echo "FAIL: show.name is '$SHOW_NAME' — expected 'Genesis Science Report'"
  FAILURES=$((FAILURES + 1))
fi

# 2. Air day must be Tuesday
AIR_DAY=$(python3 -c "
import json
d = json.load(open('$CONFIG'))
print(d.get('show', {}).get('air_day', ''))
" 2>/dev/null || echo "")
if [ "$AIR_DAY" = "Tuesday" ]; then
  echo "OK:   show.air_day = $AIR_DAY"
elif [ -n "$AIR_DAY" ]; then
  echo "FAIL: show.air_day is '$AIR_DAY' — GSR airs Tuesday on GSN"
  FAILURES=$((FAILURES + 1))
fi

# 3. No dead notion/n8n sections (removed per ADR-0012)
DEAD=$(python3 -c "
import json
d = json.load(open('$CONFIG'))
dead = [k for k in ('notion', 'n8n') if k in d]
print(' '.join(dead))
" 2>/dev/null || echo "")
if [ -n "$DEAD" ]; then
  echo "FAIL: config/production.json has dead sections: $DEAD (remove per ADR-0012)"
  FAILURES=$((FAILURES + 1))
else
  echo "OK:   No dead notion/n8n sections"
fi

# 4. Wrong phone number — look for the formatted wrong number, not just "7900"
#    PROMPT_LIBRARY.md legitimately says "7900 is wrong" so we only flag the
#    actual number pattern.
WRONG_PHONE=$(grep -r "931-212-7900\|212-7900" \
  "$REPO_ROOT/apps/dashboard/src" \
  "$REPO_ROOT/docs" \
  "$REPO_ROOT/config" \
  --include="*.ts" --include="*.tsx" --include="*.md" --include="*.json" \
  -l 2>/dev/null || true)
if [ -n "$WRONG_PHONE" ]; then
  echo "FAIL: Files contain wrong phone '7900' (should be '7990'):"
  echo "$WRONG_PHONE" | sed 's/^/  /'
  FAILURES=$((FAILURES + 1))
else
  echo "OK:   Phone number 7990 consistent"
fi

if [ "$FAILURES" -eq 0 ]; then
  echo "Config is consistent."
fi

exit $FAILURES
