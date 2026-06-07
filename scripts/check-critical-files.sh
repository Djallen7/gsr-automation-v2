#!/usr/bin/env bash
# Verifies every file named in the CRITICAL-FILES.md carry-list still exists.
# Loud on drift: prints what is missing and exits non-zero.
#
# The manifest is the single source of truth. This script reads the
# backtick-quoted path at the start of each bullet between the
# "check:start" / "check:end" fence markers and confirms each one exists.
# Paths ending in "/" are checked as non-empty directories.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$ROOT/docs/_handoff/CRITICAL-FILES.md"

if [[ ! -f "$MANIFEST" ]]; then
  echo "FAIL: carry-list manifest not found at docs/_handoff/CRITICAL-FILES.md" >&2
  exit 2
fi

missing=0
checked=0
inblock=0

while IFS= read -r line; do
  case "$line" in
    *"check:start"*) inblock=1; continue ;;
    *"check:end"*)   inblock=0; continue ;;
  esac
  [[ $inblock -eq 1 ]] || continue

  # Bullet lines whose first token is a backtick-quoted path: "- `path` — why"
  if [[ "$line" =~ ^[[:space:]]*-[[:space:]]+\`([^\`]+)\` ]]; then
    path="${BASH_REMATCH[1]}"
    checked=$((checked + 1))
    if [[ "$path" == */ ]]; then
      # Directory entry: must exist and be non-empty.
      if [[ ! -d "$ROOT/$path" ]] || [[ -z "$(ls -A "$ROOT/$path" 2>/dev/null)" ]]; then
        echo "MISSING (dir empty or gone): $path"
        missing=$((missing + 1))
      fi
    elif [[ ! -e "$ROOT/$path" ]]; then
      echo "MISSING: $path"
      missing=$((missing + 1))
    fi
  fi
done < "$MANIFEST"

echo "---"
echo "checked $checked critical paths; $missing missing"
if [[ $missing -gt 0 ]]; then
  echo "CRITICAL-FILES DRIFT: $missing carry-list file(s) gone. Restore them, or update docs/_handoff/CRITICAL-FILES.md in the same commit." >&2
  exit 1
fi
echo "OK: all carry-list files present."
