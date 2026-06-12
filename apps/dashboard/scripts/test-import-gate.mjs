// Mock-content tests for the import write-gate (lib/import-mode.ts).
// Run: node --experimental-strip-types scripts/test-import-gate.mjs
import { resolveImportMode, IMPORT_CONFIRM_TOKEN } from '../src/lib/import-mode.ts'
import assert from 'node:assert/strict'

// A realistic fake-script payload, as the extract flow would post it.
const fakeScriptPayload = {
  episodes: [{ season: 99, episode_number: 901, title: 'MOCK Volcanoes of Hawaii', guest_name: 'Test Guest' }],
  graphics: [
    { episode_season: 99, episode_number: 901, segment: 'opening_monologue', l3_type: 'monologue_beat', beat_number: 1, primary: 'Kilauea: 48 eruptions and counting as of June 1' },
    { episode_season: 99, episode_number: 901, segment: 'interview_1', l3_type: 'guest_chyron', beat_number: 1, primary: 'Test Guest | Volcanologist, Example Institute' },
  ],
  rejected: [],
}

const cases = [
  [{}, 'dry_run', 'bare payload (no flags at all) stays a dry-run'],
  [{ dry_run: true }, 'dry_run', 'explicit dry_run: true'],
  [{ dry_run: false }, 'dry_run', 'old-style dry_run: false WITHOUT token must NOT write'],
  [{ confirm: 'YES' }, 'live', 'exact token writes'],
  [{ confirm: 'YES', dry_run: true }, 'dry_run', 'dry_run: true beats the token'],
  [{ confirm: 'yes' }, 'dry_run', 'lowercase token rejected (exact match only)'],
  [{ confirm: ' YES ' }, 'dry_run', 'padded token rejected'],
  [{ confirm: true }, 'dry_run', 'boolean true is not the token'],
  [{ confirm: '' }, 'dry_run', 'empty token rejected'],
  [{ dry_run: 'false' }, 'dry_run', 'string "false" without token stays dry'],
]

let failures = 0
for (const [extra, expected, label] of cases) {
  const body = { ...fakeScriptPayload, ...extra }
  const got = resolveImportMode(body).mode
  if (got === expected) {
    console.log(`ok   ${label}`)
  } else {
    failures++
    console.error(`FAIL ${label}: expected ${expected}, got ${got}`)
  }
}
assert.equal(IMPORT_CONFIRM_TOKEN, 'YES')
assert.equal(failures, 0)
console.log(`\nAll ${cases.length} gate cases passed.`)
