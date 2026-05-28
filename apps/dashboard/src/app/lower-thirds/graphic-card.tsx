'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
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
import { isTextOnly } from '@/lib/text-only-sentinel'
import { adoptVariation, approveGraphic, rejectGraphic } from './actions'

interface GraphicCardProps {
  id: string
  segment: string
  beatNumber: number | null
  initialText: string
  status: string
  currentImageUrl: string
  episodeLabel: string
  fontFamily: string | null
  fontSizePt: number | null
  fontColor: string | null
}

export function GraphicCard({
  id,
  segment,
  beatNumber,
  initialText,
  status,
  currentImageUrl,
  episodeLabel,
  fontFamily,
  fontSizePt,
  fontColor,
}: GraphicCardProps) {
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

  const isPendingReview = localStatus === 'pending_review'

  const textOnly = isTextOnly(currentImageUrl)

  const cardBorder =
    localStatus === 'approved'
      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
      : localStatus === 'rejected'
        ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
        : ''

  return (
    <article className={`flex flex-col gap-3 rounded-md border p-3 transition-colors ${cardBorder}`}>
      <div className="flex gap-3">
        {textOnly ? (
          <div
            aria-label="Text-only graphic"
            className="flex h-20 w-36 shrink-0 items-center justify-center rounded border bg-muted text-xs uppercase tracking-wide text-muted-foreground"
          >
            text-only
          </div>
        ) : (
          <Image
            src={currentImageUrl}
            alt={`Lower-third for ${episodeLabel}, ${segment} beat ${beatNumber ?? '?'}`}
            width={144}
            height={80}
            className="h-20 w-36 shrink-0 rounded border bg-muted object-cover"
          />
        )}
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
          <p className={`text-xs tabular-nums ${initialText.length > 65 ? 'text-destructive font-semibold' : initialText.length < 55 ? 'text-amber-500 font-semibold' : 'text-muted-foreground'}`}>
            {initialText.length}/65 chars{initialText.length > 65 ? ' — over limit' : initialText.length < 55 ? ' — too short' : ''}
          </p>
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
            disabled={isPending || regenerating}
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
                    v.text.length > 65 ? 'text-destructive font-semibold' : v.text.length < 55 ? 'text-amber-500' : 'text-muted-foreground'
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
