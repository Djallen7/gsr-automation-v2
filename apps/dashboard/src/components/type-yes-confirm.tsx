'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IMPORT_CONFIRM_TOKEN } from '@/lib/import-mode'

// The canon Type-YES gate as a widget. Shows what is about to be written,
// requires the operator to type YES exactly, then fires onConfirm. The
// server enforces the same token, so this gate cannot be bypassed by a
// caller that skips the UI.
export function TypeYesConfirm({
  summary,
  busy,
  onConfirm,
  confirmLabel,
}: {
  summary: string
  busy: boolean
  onConfirm: () => void
  confirmLabel: string
}) {
  const [text, setText] = useState('')
  const armed = text === IMPORT_CONFIRM_TOKEN

  return (
    <div className="rounded-md border border-amber-400/60 bg-amber-50 p-3 dark:bg-amber-950/30">
      <p className="text-sm font-medium">{summary}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        This writes to the live database. Type {IMPORT_CONFIRM_TOKEN} to confirm.
      </p>
      <div className="mt-2 flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={IMPORT_CONFIRM_TOKEN}
          className="w-28 font-mono"
          disabled={busy}
          aria-label={`Type ${IMPORT_CONFIRM_TOKEN} to confirm`}
        />
        <Button size="sm" onClick={onConfirm} disabled={!armed || busy}>
          {busy ? 'Writing…' : confirmLabel}
        </Button>
      </div>
    </div>
  )
}
