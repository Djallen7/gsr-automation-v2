// The import write-gate. A live database write happens ONLY when the request
// carries the explicit confirm token; anything else is a dry-run. This is the
// canon "Type YES" rule enforced server-side (CLAUDE.md, Operational Rules).
// Pure module: no imports, unit-tested by scripts/test-import-gate.mjs.

export const IMPORT_CONFIRM_TOKEN = 'YES'

export type ImportMode =
  | { mode: 'live' }
  | { mode: 'dry_run'; reason: string }

export function resolveImportMode(body: {
  dry_run?: unknown
  confirm?: unknown
}): ImportMode {
  if (body.dry_run === true) {
    return { mode: 'dry_run', reason: 'dry_run requested' }
  }
  if (body.confirm !== IMPORT_CONFIRM_TOKEN) {
    return {
      mode: 'dry_run',
      reason:
        body.confirm === undefined || body.confirm === null
          ? `no confirm token — pass confirm: "${IMPORT_CONFIRM_TOKEN}" to write`
          : `confirm token did not match "${IMPORT_CONFIRM_TOKEN}" exactly — not writing`,
    }
  }
  return { mode: 'live' }
}
