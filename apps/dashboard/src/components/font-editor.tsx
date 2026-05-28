'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { setFont, type FontOverrides } from '@/app/lower-thirds/actions'

interface Props {
  graphicId: string
  initial: FontOverrides
  // Placeholders shown when a value is null. Operator can leave fields blank
  // to inherit the project default at export time.
  placeholders?: {
    family?: string
    size?: string
    color?: string
  }
}

const DEFAULT_FONT = {
  family: 'Collaborate Medium',
  size: 55,
  color: '#FFFFFF',
}

const DEFAULT_PLACEHOLDERS = {
  family: DEFAULT_FONT.family,
  size: String(DEFAULT_FONT.size),
  color: DEFAULT_FONT.color,
}

export function FontEditor({ graphicId, initial, placeholders }: Props) {
  const [open, setOpen] = useState(false)
  const [family, setFamily] = useState(initial.font_family ?? '')
  const [size, setSize] = useState(
    initial.font_size_pt === null ? '' : String(initial.font_size_pt),
  )
  const [color, setColor] = useState(initial.font_color ?? '')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const ph = { ...DEFAULT_PLACEHOLDERS, ...(placeholders ?? {}) }

  const summary =
    [
      initial.font_family,
      initial.font_size_pt !== null ? `${initial.font_size_pt}pt` : null,
      initial.font_color,
    ]
      .filter(Boolean)
      .join(' · ') || `${DEFAULT_FONT.family} ${DEFAULT_FONT.size}pt`

  function save() {
    setError(null)
    let parsedSize: number | null = null
    if (size.trim() !== '') {
      const n = Number(size)
      if (!Number.isInteger(n) || n <= 0) {
        setError('Size must be a positive integer.')
        return
      }
      parsedSize = n
    }
    startTransition(async () => {
      try {
        await setFont(graphicId, {
          font_family: family.trim() === '' ? null : family.trim(),
          font_size_pt: parsedSize,
          font_color: color.trim() === '' ? null : color.trim(),
        })
        setOpen(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Save failed.')
      }
    })
  }

  function reset() {
    setError(null)
    startTransition(async () => {
      try {
        await setFont(graphicId, {
          font_family: null,
          font_size_pt: null,
          font_color: null,
        })
        setFamily('')
        setSize('')
        setColor('')
        setOpen(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Reset failed.')
      }
    })
  }

  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-muted-foreground hover:text-foreground"
        aria-expanded={open}
      >
        Font: <span className="font-mono">{summary}</span> {open ? '▴' : '▾'}
      </button>

      {open && (
        <div className="mt-2 grid gap-2 rounded border bg-background p-3">
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <label htmlFor={`${graphicId}-family`} className="text-muted-foreground">
              Family
            </label>
            <Input
              id={`${graphicId}-family`}
              value={family}
              onChange={(e) => setFamily(e.target.value)}
              placeholder={ph.family}
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <label htmlFor={`${graphicId}-size`} className="text-muted-foreground">
              Size (pt)
            </label>
            <Input
              id={`${graphicId}-size`}
              type="number"
              min={1}
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder={ph.size}
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-2">
            <label htmlFor={`${graphicId}-color`} className="text-muted-foreground">
              Color
            </label>
            <Input
              id={`${graphicId}-color`}
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder={ph.color}
              disabled={isPending}
            />
          </div>

          {error && <p className="text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={reset}
              disabled={isPending}
            >
              Reset to default
            </Button>
            <Button type="button" size="sm" onClick={save} disabled={isPending}>
              {isPending ? 'Saving…' : 'Save font'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
