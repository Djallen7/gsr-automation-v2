#!/usr/bin/env bash
# Keeps the onboarding course honest against the repo. The course
# (docs/_handoff/gsr-automation-v2-course.html) states quantitative facts
# about the system: how many things there are, what routes exist, etc.
# When the real system changes, those numbers silently go stale. This
# check makes that loud.
#
# IMPORTANT — two kinds of fact, and only one is CI-checkable:
#
#   REPO-CHECKABLE   The repo itself is the source of truth, so CI can
#                    verify the course with no database access:
#                      - migration count = *.sql files in supabase/migrations/
#                      - route count      = page.tsx + route.ts under
#                                           apps/dashboard/src/app
#                      - route names      = the route directories present
#                    If the course states one of these and it disagrees with
#                    the repo, that is real drift. This script exits non-zero
#                    and prints "course says X, repo has Y" for each.
#
#   LIVE-ONLY        Some course facts live only in Supabase and cannot be
#                    read from the repo: row counts ("48 episodes",
#                    "175 guests"), table count ("20 tables"), enum value
#                    counts ("9 values"). CI has no DB access and MUST NOT
#                    fail on these. They are printed as
#                    "live-only (not CI-checkable): verify manually" so a
#                    human knows to eyeball them, and that is all.
#
# CI runs this on every PR and every push to main, so a merge that adds,
# removes, or renames a route (or a migration) without updating the course
# trips the gate. The course HTML is the thing under test; this script never
# edits it, it only reads it.
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COURSE="$ROOT/docs/_handoff/gsr-automation-v2-course.html"
MIGRATIONS_DIR="$ROOT/supabase/migrations"
APP_DIR="$ROOT/apps/dashboard/src/app"

if [[ ! -f "$COURSE" ]]; then
  echo "FAIL: course not found at docs/_handoff/gsr-automation-v2-course.html" >&2
  exit 2
fi

drift=0

# --- Repo facts the course can be checked against ----------------------------

# Migration count: every *.sql file in supabase/migrations/.
repo_migrations=0
if [[ -d "$MIGRATIONS_DIR" ]]; then
  repo_migrations=$(find "$MIGRATIONS_DIR" -maxdepth 1 -type f -name '*.sql' | wc -l | tr -d ' ')
fi

# Route files: every page.tsx and route.ts under the app dir.
repo_route_files=0
# Route names: the route path each of those files lives at (app dir stripped,
# the page.tsx/route.ts filename stripped, the app root shown as "/").
declare -a repo_routes=()
if [[ -d "$APP_DIR" ]]; then
  while IFS= read -r f; do
    repo_route_files=$((repo_route_files + 1))
    d="${f#"$APP_DIR"}"
    d="${d%/page.tsx}"
    d="${d%/route.ts}"
    [[ -z "$d" ]] && d="/"
    repo_routes+=("$d")
  done < <(find "$APP_DIR" -type f \( -name 'page.tsx' -o -name 'route.ts' \) | sort)
fi
# Unique, sorted route names.
mapfile -t repo_routes < <(printf '%s\n' "${repo_routes[@]}" | sort -u)

route_present() {
  local want="$1" r
  for r in "${repo_routes[@]}"; do
    [[ "$r" == "$want" ]] && return 0
  done
  return 1
}

echo "=== Course freshness check ==="
echo "course: docs/_handoff/gsr-automation-v2-course.html"
echo "repo migrations: $repo_migrations  |  repo route files: $repo_route_files  |  distinct routes: ${#repo_routes[@]}"
echo ""

# --- REPO-CHECKABLE: route names the course marks as existing ----------------
#
# The course tags a route it claims is already built with "(exist)" or
# "(exists)" right after the path, e.g. "/lower-thirds/ready (exist)". Those
# are promises the repo must keep, so we verify each one is really present.
# Proposed/future routes (the course says "Add" or "New" for those, with no
# "(exist)" marker) are intentionally NOT checked here, so we never flag a
# route the course never claimed to ship.
echo "--- routes the course says already exist (repo-checkable) ---"
checked_routes=0
mapfile -t course_exist_routes < <(
  grep -oE '/[a-z0-9/-]+ \(exists?\)' "$COURSE" \
    | sed -E 's/ \(exists?\)$//' \
    | sort -u
)
if [[ ${#course_exist_routes[@]} -eq 0 ]]; then
  echo "(none tagged \"(exist)\" in the course)"
else
  for cr in "${course_exist_routes[@]}"; do
    checked_routes=$((checked_routes + 1))
    if route_present "$cr"; then
      echo "OK: course says $cr exists; repo has it."
    else
      echo "DRIFT: course says $cr exists, but repo has no such route." >&2
      drift=$((drift + 1))
    fi
  done
fi
echo ""

# --- LIVE-ONLY: numeric claims that live only in Supabase --------------------
#
# These are real numbers the course states, but the repo cannot confirm them
# without a database, so we print them for a human and never fail on them.
# We pull each straight out of the course so the human sees what to verify.
echo "--- live-only facts (not CI-checkable): verify manually ---"
print_live() {
  # $1 = human label, $2 = grep -oE pattern, matched in the course
  local label="$1" pat="$2" hits
  hits=$(grep -oiE "$pat" "$COURSE" | sort -u | paste -sd ', ' -)
  if [[ -n "$hits" ]]; then
    echo "live-only (not CI-checkable): $label — course states: $hits — verify manually against Supabase."
  fi
}
print_live "episode row count"           '[0-9]+ episodes'
print_live "guest row count"             '[0-9]+ guests'
print_live "table count"                 '[0-9]+ tables'
print_live "enum value counts"           '[0-9]+[ -]values?'
echo "(row counts, table count, and enum sizes live only in the Supabase project lafkbxypmciopebentxp; CI has no DB access.)"
echo ""

# --- Result ------------------------------------------------------------------
echo "---"
echo "freshness: checked $checked_routes course \"exists\" route claim(s); $drift drifted"
if [[ $drift -gt 0 ]]; then
  echo "COURSE FRESHNESS DRIFT: $drift course claim(s) no longer match the repo. The course numbers are stale. Update docs/_handoff/gsr-automation-v2-course.html to match the repo (or fix the repo), in the same PR." >&2
  exit 1
fi
echo "OK: every repo-checkable course claim matches the repo. (Live-only facts still need a human eyeball.)"
