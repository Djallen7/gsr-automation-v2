#!/usr/bin/env bash
# Keeps the CRITICAL-FILES.md carry-list honest. Two modes:
#
#   (default)   PRESENCE check — every file listed inside the check:start/end
#               fence must still exist. Catches deletes/renames of critical
#               files. Exits non-zero and lists what is missing.
#
#   --audit     COVERAGE check — every file in a "critical zone" (docs,
#               docs/_handoff, docs/reference, config, .claude/agents,
#               .claude/hooks, agents) must be classified somewhere in the
#               manifest (any tier) or matched by an audit:ignore glob.
#               Catches NEW files that nobody filed into the list. Exits
#               non-zero and lists what is unclassified.
#
# CI runs both, so a merge cannot add, remove, or rename a critical file
# without the carry-list being updated in the same PR. The manifest is the
# single source of truth; this script only reads it.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="$ROOT/docs/_handoff/CRITICAL-FILES.md"
MODE="${1:-presence}"

if [[ ! -f "$MANIFEST" ]]; then
  echo "FAIL: carry-list manifest not found at docs/_handoff/CRITICAL-FILES.md" >&2
  exit 2
fi

# All backtick-quoted paths that begin a bullet, anywhere in the manifest.
# These are the "known/classified" paths (files and trailing-slash dirs).
mapfile -t KNOWN < <(grep -oE '^[[:space:]]*-[[:space:]]+`[^`]+`' "$MANIFEST" \
  | sed -E 's/^[[:space:]]*-[[:space:]]+`([^`]+)`/\1/')

# Globs for files deliberately excluded from the coverage audit.
mapfile -t IGNORE < <(awk '/audit:ignore/{f=1;next}/audit:end/{f=0}f' "$MANIFEST" \
  | grep -oE '`[^`]+`' | tr -d '`')

is_known() {
  local p="$1" k
  for k in "${KNOWN[@]}"; do
    [[ "$p" == "$k" ]] && return 0
    [[ "$k" == */ && "$p" == "$k"* ]] && return 0   # directory entry covers its files
  done
  return 1
}

is_ignored() {
  local p="$1" g
  for g in "${IGNORE[@]}"; do
    # shellcheck disable=SC2053
    [[ "$p" == $g ]] && return 0
  done
  return 1
}

run_presence() {
  local missing=0 checked=0 inblock=0 line path
  while IFS= read -r line; do
    case "$line" in
      *"check:start"*) inblock=1; continue ;;
      *"check:end"*)   inblock=0; continue ;;
    esac
    [[ $inblock -eq 1 ]] || continue
    if [[ "$line" =~ ^[[:space:]]*-[[:space:]]+\`([^\`]+)\` ]]; then
      path="${BASH_REMATCH[1]}"
      checked=$((checked + 1))
      if [[ "$path" == */ ]]; then
        if [[ ! -d "$ROOT/$path" ]] || [[ -z "$(ls -A "$ROOT/$path" 2>/dev/null)" ]]; then
          echo "MISSING (dir empty or gone): $path"; missing=$((missing + 1))
        fi
      elif [[ ! -e "$ROOT/$path" ]]; then
        echo "MISSING: $path"; missing=$((missing + 1))
      fi
    fi
  done < "$MANIFEST"
  echo "---"
  echo "presence: checked $checked listed paths; $missing missing"
  if [[ $missing -gt 0 ]]; then
    echo "CRITICAL-FILES DRIFT: $missing carry-list file(s) gone. Restore them, or update docs/_handoff/CRITICAL-FILES.md in the same commit." >&2
    return 1
  fi
  echo "OK: all carry-list files present."
}

run_audit() {
  local zones=(docs docs/_handoff docs/reference config .claude/agents .claude/hooks agents)
  local unclassified=0 scanned=0 rel f
  for z in "${zones[@]}"; do
    [[ -d "$ROOT/$z" ]] || continue
    while IFS= read -r f; do
      rel="${f#"$ROOT"/}"
      scanned=$((scanned + 1))
      is_ignored "$rel" && continue
      is_known "$rel" && continue
      echo "UNCLASSIFIED: $rel"
      unclassified=$((unclassified + 1))
    done < <(find "$ROOT/$z" -maxdepth 1 -type f)
  done
  echo "---"
  echo "audit: scanned $scanned files in critical zones; $unclassified unclassified"
  if [[ $unclassified -gt 0 ]]; then
    echo "CRITICAL-FILES COVERAGE GAP: $unclassified new file(s) in critical zones are not in the carry-list. Add each to a tier in docs/_handoff/CRITICAL-FILES.md (or to its audit:ignore list) in the same PR." >&2
    return 1
  fi
  echo "OK: every file in the critical zones is classified."
}

case "$MODE" in
  --audit) run_audit ;;
  presence|"") run_presence ;;
  *) echo "usage: check-critical-files.sh [--audit]" >&2; exit 2 ;;
esac
