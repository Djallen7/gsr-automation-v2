'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { adoptVariation, approveGraphic, rejectGraphic } from './actions'

interface GraphicCardProps {
  id: string
  segment: string
  beatNumber: number | null
  initialText: string
  status: string
  currentImageUrl: string
  episodeLabel: string
}

export function GraphicCard({
  id,
  segment,
  beatNumber,
  initialText,
  status,
  currentImageUrl,
  episodeLabel,
}: GraphicCardProps) {
  const [isPending, startTransition] = useTransition()
  const [regenerating, setRegenerating] = useState(false)
  const [regenError, setRegenError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [proposedText, setProposedText] = useState('')
  const [proposedVariationNumber, setProposedVariationNumber] = useState<number | null>(null)

  function handleApprove() {
    startTransition(async () => {
      try {
        await approveGraphic(id)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Approve failed.')
      }
    })
  }

  function handleReject() {
    startTransition(async () => {
      try {
        await rejectGraphic(id)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Reject failed.')
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
        | { text: string; variationNumber: number }
        | { error: string }
      if (!res.ok) {
        const message = 'error' in payload ? payload.error : 'Regenerate failed.'
        throw new Error(message)
      }
      if (!('text' in payload)) throw new Error('Unexpected response.')
      setProposedText(payload.text)
      setProposedVariationNumber(payload.variationNumber)
      setDialogOpen(true)
    } catch (err) {
      setRegenError(err instanceof Error ? err.message : 'Regenerate failed.')
    } finally {
      setRegenerating(false)
    }
  }

  function handleAdopt() {
    startTransition(async () => {
      try {
        await adoptVariation(id, proposedText)
        setDialogOpen(false)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Adopt failed.')
      }
    })
  }

  const isPendingReview = status === 'pending_review'

  return (
    <article className="flex flex-col gap-3 rounded-md border p-3">
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImageUrl}
          alt={`Lower-third for ${episodeLabel}, ${segment} beat ${beatNumber ?? '?'}`}
          className="h-20 w-36 shrink-0 rounded border bg-muted object-cover"
        />
        <div className="flex flex-1 flex-col gap-1 text-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded bg-muted px-2 py-0.5 uppercase tracking-wide">
              {status}
            </span>
            <span className="text-muted-foreground">{episodeLabel}</span>
            <span className="text-muted-foreground">
              {segment} · beat {beatNumber ?? '—'}
            </span>
          </div>
          <p className="font-medium">{initialText}</p>
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
            <DialogTitle>Regenerated text</DialogTitle>
            <DialogDescription>
              Variation {proposedVariationNumber ?? '?'} — saved in history regardless of your choice.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">Original</span>
              <p className="rounded border bg-muted p-2 text-sm">{initialText}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">New</span>
              <p className="rounded border bg-muted p-2 text-sm">{proposedText}</p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isPending}
            >
              Keep original
            </Button>
            <Button onClick={handleAdopt} disabled={isPending}>
              {isPending ? 'Saving…' : 'Use new'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  )
}
