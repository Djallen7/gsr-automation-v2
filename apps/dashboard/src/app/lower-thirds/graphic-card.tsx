'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FontEditor } from '@/components/font-editor'
import { useRouter } from 'next/navigation'
import { adoptVariation, approveGraphic, rejectGraphic } from './actions'

const HARD_LIMIT = 70

// Canon length band (s13): under 55 too short, 60-65 ideal, 66-70 over the
// sweet spot, over 70 hard-blocked (not approvable).
function bandClass(len: number): string {
  if (len > 70) return 'text-red-600 font-semibold'
  if (len > 65) return 'text-amber-500 font-semibold'
  if (len >= 60) return 'text-green-600 dark:text-green-400'
  if (len >= 55) return 'text-muted-foreground'
  return 'text-amber-500 font-semibold'
}

function bandNote(len: number): string {
  if (len > 70) return ' over 70, shorten before approving'
  if (len > 65) return ' over the 60-65 sweet spot'
  if (len >= 60) return ' ideal length'
  if (len >= 55) return ''
  return ' too short'
}

interface GraphicCardProps {
  id: string
  segment: string
  beatNumber: number | null
  initialText: string
  status: string
  episodeLabel: string
  fontFamily: string | null
  fontSizePt: number | null
  fontColor: string | null
  variations?: { variationNumber: number; text: string }[]
}

export function GraphicCard({
  id,
  segment,
  beatNumber,
  initialText,
  status,
  episodeLabel,
  fontFamily,
  fontSizePt,
  fontColor,
  variations = [],
}: GraphicCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [localStatus, setLocalStatus] = useState(status)
  const [regenerating, setRegenerating] = useState(false)
  const [regenError, setRegenError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [proposedVariations, setProposedVariations] = useState<{ text: string; variationNumber: number }[]>([])
  const [selectedIdx, setSelectedIdx] = useState(0)

  function handleApprove() {
    const prev = localStatus
    setLocalStatus('approved')
    startTransition(async () => {
      try {
        await approveGraphic(id)
      } catch (err) {
        setLocalStatus(prev)
        toast.error(err instanceof Error ? err.message : 'Approve failed.')
      }
    })
  }

  function handleReject() {
    const prev = localStatus
    setLocalStatus('rejected')
    startTransition(async () => {
      try {
        await rejectGraphic(id)
      } catch (err) {
        setLocalStatus(prev)
        toast.error(err instanceof Error ? err.message : 'Reject failed.')
      }
    })
  }

  async function handleRegenerate() {
    setRegenError(null)
    setRegenerating(true)
    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ graphicId: id }),
      })
      const payload = (await res.json()) as
        | { variations: { text: string; variationNumber: number }[] }
        | { error: string }
      if (!res.ok) {
        const message = 'error' in payload ? payload.error : 'Regenerate failed.'
        throw new Error(message)
      }
      if (!('variations' in payload) || payload.variations.length === 0) {
        throw new Error('Unexpected response.')
      }
      setProposedVariations(payload.variations)
      setSelectedIdx(0)
      setDialogOpen(true)
    } catch (err) {
      setRegenError(err instanceof Error ? err.message : 'Regenerate failed.')
    } finally {
      setRegenerating(false)
    }
  }

  function handleAdopt() {
    const selected = proposedVariations[selectedIdx]
    if (!selected) return
    startTransition(async () => {
      try {
        await adoptVariation(id, selected.text)
        setDialogOpen(false)
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Adopt failed.')
      }
    })
  }

  // 1.6 comparison: promote a stored variation to be the primary text.
  function handleUseVariation(text: string) {
    startTransition(async () => {
      try {
        await adoptVariation(id, text)
        router.refresh()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Update failed.')
      }
    })
  }

  const isPendingReview = localStatus === 'pending_review'
  const overHardLimit = initialText.length > HARD_LIMIT
  const altVariations = variations.filter(
    (v) => v.variationNumber >= 2 && v.text.trim().length > 0,
  )

  const cardBorder =
    localStatus === 'approved'
      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
      : localStatus === 'rejected'
        ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
        : ''

  return (
    <article className={`flex flex-col gap-3 rounded-md border p-3 transition-colors ${cardBorder}`}>
      <div className="flex gap-3">
        <div className="flex flex-1 flex-col gap-1 text-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`rounded px-2 py-0.5 uppercase tracking-wide ${
                localStatus === 'approved'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : localStatus === 'rejected'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-muted'
              }`}
            >
              {localStatus}
            </span>
            <span className="text-muted-foreground">{episodeLabel}</span>
            <span className="text-muted-foreground">
              {segment} · beat {beatNumber ?? '—'}
            </span>
          </div>
          <p className="font-medium">{initialText}</p>
          <p className={`text-xs tabular-nums ${bandClass(initialText.length)}`}>
            {initialText.length} chars{bandNote(initialText.length)}
          </p>

          {altVariations.length > 0 && (
            <div className="mt-1 grid gap-2 rounded-md border bg-muted/20 p-2 sm:grid-cols-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Primary
                </span>
                <span className="text-sm font-medium leading-snug">{initialText}</span>
                <span className={`text-[11px] tabular-nums ${bandClass(initialText.length)}`}>
                  {initialText.length} chars
                </span>
              </div>
              {altVariations.map((v, i) => (
                <div key={v.variationNumber} className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Variation {i + 1}
                  </span>
                  <span className="text-sm leading-snug">{v.text}</span>
                  <span className={`text-[11px] tabular-nums ${bandClass(v.text.length)}`}>
                    {v.text.length} chars
                  </span>
                  {isPendingReview && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-0.5"
                      disabled={isPending || regenerating}
                      onClick={() => handleUseVariation(v.text)}
                    >
                      Use this
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          <FontEditor
            graphicId={id}
            initial={{
              font_family: fontFamily,
              font_size_pt: fontSizePt,
              font_color: fontColor,
            }}
          />
          {regenError ? (
            <p className="text-xs text-destructive">{regenError}</p>
          ) : null}
        </div>
      </div>
      {isPendingReview ? (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={isPending || regenerating || overHardLimit}
            title={overHardLimit ? 'Over 70 characters. Shorten or regenerate before approving.' : undefined}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReject}
            disabled={isPending || regenerating}
          >
            Reject
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleRegenerate}
            disabled={isPending || regenerating}
          >
            {regenerating ? 'Regenerating…' : 'Regenerate'}
          </Button>
        </div>
      ) : null}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pick a variation</DialogTitle>
            <DialogDescription>
              All {proposedVariations.length} saved to history. Click one to select, then adopt it.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Original</span>
            <p className="rounded border bg-muted p-2 text-sm font-mono">{initialText}</p>
            <span className="text-xs tabular-nums text-muted-foreground">{initialText.length}/65</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Generated variations — click to select</span>
            {proposedVariations.map((v, i) => (
              <button
                key={v.variationNumber}
                type="button"
                onClick={() => setSelectedIdx(i)}
                className={`rounded border p-2 text-left text-sm font-mono transition-colors ${
                  selectedIdx === i
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-muted bg-muted hover:bg-muted/80'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{v.text}</span>
                  <span className={`shrink-0 text-xs tabular-nums ${
                    v.text.length > 65 ? 'text-amber-500 font-semibold' : v.text.length < 55 ? 'text-amber-500' : 'text-muted-foreground'
                  }`}>
                    {v.text.length}/65
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isPending}
            >
              Keep original
            </Button>
            <Button onClick={handleAdopt} disabled={isPending || proposedVariations.length === 0}>
              {isPending ? 'Saving…' : 'Use selected'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  )
}
