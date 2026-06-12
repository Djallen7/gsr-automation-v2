'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

interface Episode {
  season: number
  episode_number: number
  title: string | null
}

interface Graphic {
  id: string
  segment: string
  beat_number: number | null
  initial_text: string
  status: string
  episode: Episode | Episode[] | null
}

interface Variation {
  text: string
  variationNumber: number
}

function episodeLabel(ep: Episode | Episode[] | null): string {
  const e = Array.isArray(ep) ? ep[0] : ep
  if (!e) return 'No episode'
  return `S${e.season}E${e.episode_number}${e.title ? ` — ${e.title}` : ''}`
}

function GraphicCard({
  graphic,
  busy,
  regenerating,
  variation,
  onApprove,
  onReject,
  onRegenerate,
}: {
  graphic: Graphic
  busy: boolean
  regenerating: boolean
  variation: Variation | undefined
  onApprove: (id: string, approvedText: string) => void
  onReject: (id: string) => void
  onRegenerate: (id: string) => void
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1 text-sm">
          <span className="font-medium leading-snug">{graphic.initial_text}</span>
          <span className="text-muted-foreground">{episodeLabel(graphic.episode)}</span>
          <span className="text-muted-foreground">
            {graphic.segment.replaceAll('_', ' ')} &middot; beat {graphic.beat_number ?? '—'}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            disabled={busy || regenerating}
            onClick={() => onApprove(graphic.id, graphic.initial_text)}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={busy || regenerating}
            onClick={() => onReject(graphic.id)}
          >
            Reject
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={busy || regenerating}
            onClick={() => onRegenerate(graphic.id)}
          >
            {regenerating ? 'Generating…' : 'Regenerate'}
          </Button>
        </div>

        {variation && (
          <div className="rounded border p-3 text-xs">
            <p className="mb-2 font-semibold uppercase tracking-wide text-muted-foreground">
              AI variation {variation.variationNumber}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Original</p>
                <p className="font-medium leading-snug">{graphic.initial_text}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  disabled={busy}
                  onClick={() => onApprove(graphic.id, graphic.initial_text)}
                >
                  Approve original
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Variation {variation.variationNumber}</p>
                <p className="font-medium leading-snug">{variation.text}</p>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={busy}
                  onClick={() => onApprove(graphic.id, variation.text)}
                >
                  Approve this
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ReviewGrid({
  initialPending,
  initialRejected,
}: {
  initialPending: Graphic[]
  initialRejected: Graphic[]
}) {
  const supabase = createClient()
  const [pending, setPending] = useState<Graphic[]>(initialPending)
  const [rejected, setRejected] = useState<Graphic[]>(initialRejected)
  const [processing, setProcessing] = useState<Set<string>>(new Set())
  const [regenerating, setRegenerating] = useState<Set<string>>(new Set())
  const [variations, setVariations] = useState<Record<string, Variation>>({})
  const [error, setError] = useState<string | null>(null)

  function addProcessing(id: string) {
    setProcessing((prev) => new Set(prev).add(id))
  }

  function removeProcessing(id: string) {
    setProcessing((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  async function handleApprove(id: string, approvedText: string) {
    setError(null)
    addProcessing(id)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error: updateError } = await supabase
      .from('production_lower_thirds')
      .update({
        status: 'approved',
        approved_text: approvedText,
        approved_at: new Date().toISOString(),
        approved_by: user?.id ?? null,
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      removeProcessing(id)
      return
    }

    setPending((prev) => prev.filter((g) => g.id !== id))
    setRejected((prev) => prev.filter((g) => g.id !== id))
    setVariations((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
    removeProcessing(id)
  }

  async function handleReject(id: string) {
    setError(null)
    addProcessing(id)

    const { error: updateError } = await supabase
      .from('production_lower_thirds')
      .update({ status: 'rejected' })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      removeProcessing(id)
      return
    }

    const graphic = pending.find((g) => g.id === id)
    setPending((prev) => prev.filter((g) => g.id !== id))
    if (graphic) {
      setRejected((prev) => [{ ...graphic, status: 'rejected' }, ...prev])
    }
    removeProcessing(id)
  }

  async function handleRegenerate(id: string) {
    setError(null)
    setRegenerating((prev) => new Set(prev).add(id))

    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ graphicId: id }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError((data as { error?: string }).error ?? 'Regeneration failed')
        return
      }

      setVariations((prev) => ({
        ...prev,
        [id]: { text: data.text as string, variationNumber: data.variationNumber as number },
      }))
    } catch {
      setError('Regeneration failed')
    } finally {
      setRegenerating((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-10">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Pending review
          {pending.length > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {pending.length} graphic{pending.length !== 1 ? 's' : ''}
            </span>
          )}
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing pending. Upload a graphic to start reviewing.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((g) => (
              <GraphicCard
                key={g.id}
                graphic={g}
                busy={processing.has(g.id)}
                regenerating={regenerating.has(g.id)}
                variation={variations[g.id]}
                onApprove={handleApprove}
                onReject={handleReject}
                onRegenerate={handleRegenerate}
              />
            ))}
          </div>
        )}
      </section>

      {rejected.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">
            Rejected
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {rejected.length} graphic{rejected.length !== 1 ? 's' : ''}
            </span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rejected.map((g) => (
              <GraphicCard
                key={g.id}
                graphic={g}
                busy={processing.has(g.id)}
                regenerating={regenerating.has(g.id)}
                variation={variations[g.id]}
                onApprove={handleApprove}
                onReject={handleReject}
                onRegenerate={handleRegenerate}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
