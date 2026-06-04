'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const SEGMENTS = [
  { value: 'show_intro', label: 'Show Intro' },
  { value: 'opening_monologue', label: 'Opening Monologue' },
  { value: 'interview_1', label: 'Interview 1' },
  { value: 'interview_2', label: 'Interview 2' },
  { value: 'kids_corner', label: "Kids Corner" },
  { value: 'genesis_science_qa', label: 'Genesis Science Q&A' },
  { value: 'ministry_report', label: 'Ministry Report' },
  { value: 'viewer_voices', label: 'Viewer Voices' },
  { value: 'featured_resource', label: 'Featured Resource' },
  { value: 'heavens_declare', label: 'Heavens Declare' },
  { value: 'genesis_science_minute', label: 'Genesis Science Minute' },
  { value: 'other', label: 'Other' },
] as const

type SegmentValue = (typeof SEGMENTS)[number]['value']

interface GuestRow {
  title: string | null
  first_name: string
  last_name: string
  organization: string | null
  expertise: string | null
}

interface EpisodeGuest {
  segment: string
  guest: GuestRow | GuestRow[] | null
}

interface Episode {
  id: string
  season: number
  episode_number: number
  title: string | null
  episode_guests: EpisodeGuest[] | null
}

interface ExtractedGraphic {
  beat_number: number
  l3_type: string
  primary: string
  var_1: string | null
  var_2: string | null
}

interface RejectedItem {
  reason: string
  raw_text: string
}

interface ImportPayload {
  episodes: Array<{
    season: number
    episode_number: number
    title: string | null
    guest_name: string | null
  }>
  graphics: Array<{
    episode_season: number
    episode_number: number
    segment: string
    l3_type: string | null
    beat_number: unknown
    primary: unknown
    var_1: string | null
    var_2: string | null
    source_doc: string
  }>
  rejected: RejectedItem[]
}

type Stage =
  | { name: 'idle' }
  | { name: 'extracting' }
  | { name: 'preview'; payload: ImportPayload; graphics: ExtractedGraphic[]; rejected: RejectedItem[] }
  | { name: 'importing' }
  | { name: 'done'; count: number }
  | { name: 'error'; message: string }

// A held auto-extraction (from the on-script-save edge function) awaiting human confirmation.
interface PendingExtraction {
  pending: true
  extracted_at: string | null
  count: number
  graphics: ExtractedGraphic[]
  rejected: RejectedItem[]
}

function episodeLabel(ep: Episode): string {
  const num = `S${String(ep.season).padStart(2, '0')} Ep${String(ep.episode_number).padStart(3, '0')}`
  return ep.title ? `${num} — ${ep.title}` : num
}

function guestForSegment(ep: Episode, segment: string): GuestRow | null {
  const rows = ep.episode_guests ?? []
  const slot = rows.find((eg) => eg.segment === segment)
  if (!slot?.guest) return null
  return Array.isArray(slot.guest) ? slot.guest[0] ?? null : slot.guest
}

export function ExtractForm({ episodes }: { episodes: Episode[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [episodeId, setEpisodeId] = useState('')
  const [segment, setSegment] = useState<SegmentValue>('interview_1')
  const [scriptText, setScriptText] = useState('')
  const [stage, setStage] = useState<Stage>({ name: 'idle' })
  const [pending, setPending] = useState<PendingExtraction | null>(null)
  const [pendingBusy, setPendingBusy] = useState(false)

  const selectedEpisode = episodes.find((e) => e.id === episodeId) ?? null
  const guestPreview = selectedEpisode ? guestForSegment(selectedEpisode, segment) : null

  // Surface any held auto-extraction for the selected episode + segment.
  useEffect(() => {
    let ignore = false
    void (async () => {
      if (!episodeId || !segment) {
        if (!ignore) setPending(null)
        return
      }
      try {
        const res = await fetch(`/api/scripts/confirm-extraction?episode_id=${episodeId}&segment=${segment}`)
        const body = await res.json() as PendingExtraction | { pending: false }
        if (!ignore) setPending(res.ok && body.pending ? (body as PendingExtraction) : null)
      } catch {
        if (!ignore) setPending(null)
      }
    })()
    return () => { ignore = true }
  }, [episodeId, segment])

  function resolvePending(action: 'apply' | 'discard') {
    if (!pending) return
    setPendingBusy(true)
    startTransition(async () => {
      try {
        const res = await fetch('/api/scripts/confirm-extraction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ episode_id: episodeId, segment, action }),
        })
        const body = await res.json() as { ok?: boolean; error?: string; count?: number }
        if (!res.ok) {
          setStage({ name: 'error', message: body.error ?? 'Could not update the held extraction.' })
        } else if (action === 'apply') {
          setStage({ name: 'done', count: body.count ?? 0 })
          setTimeout(() => router.push('/lower-thirds'), 1500)
        }
        setPending(null)
      } catch (err) {
        setStage({ name: 'error', message: err instanceof Error ? err.message : 'Network error.' })
      } finally {
        setPendingBusy(false)
      }
    })
  }

  function handleExtract() {
    if (!episodeId || !scriptText.trim()) return
    setStage({ name: 'extracting' })

    startTransition(async () => {
      try {
        const res = await fetch('/api/extract-lower-thirds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ episode_id: episodeId, segment, script_text: scriptText }),
        })
        const body = await res.json() as { payload?: ImportPayload; error?: string }

        if (!res.ok || !body.payload) {
          setStage({ name: 'error', message: body.error ?? 'Extraction failed.' })
          return
        }

        const graphics = body.payload.graphics.map((g) => ({
          beat_number: g.beat_number as number,
          l3_type: g.l3_type ?? 'other',
          primary: String(g.primary ?? ''),
          var_1: g.var_1 ?? null,
          var_2: g.var_2 ?? null,
        }))

        setStage({
          name: 'preview',
          payload: body.payload,
          graphics,
          rejected: body.payload.rejected,
        })
      } catch (err) {
        setStage({ name: 'error', message: err instanceof Error ? err.message : 'Network error.' })
      }
    })
  }

  function handleImport() {
    if (stage.name !== 'preview') return
    const payload = stage.payload
    setStage({ name: 'importing' })

    startTransition(async () => {
      try {
        const res = await fetch('/api/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, dry_run: false }),
        })
        const body = await res.json() as { success?: boolean; error?: string; conflicts?: string[]; graphics?: { new: number } }

        if (!res.ok) {
          setStage({
            name: 'error',
            message: body.error ?? 'Import failed.',
          })
          return
        }

        setStage({ name: 'done', count: body.graphics?.new ?? 0 })
        setTimeout(() => router.push('/lower-thirds'), 1500)
      } catch (err) {
        setStage({ name: 'error', message: err instanceof Error ? err.message : 'Network error.' })
      }
    })
  }

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Extract lower-thirds from script</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste a segment script. Claude extracts and formats the lower-thirds, then they go straight to the review queue.
          </p>
        </div>
        <Link href="/lower-thirds" className={buttonVariants({ variant: 'outline' })}>
          Cancel
        </Link>
      </header>

      <div className="mt-8 grid gap-5">
        {/* Episode selector */}
        <div>
          <label className="text-sm font-medium" htmlFor="episode-select">
            Episode
          </label>
          <select
            id="episode-select"
            value={episodeId}
            onChange={(e) => setEpisodeId(e.target.value)}
            className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">— select episode —</option>
            {episodes.map((ep) => (
              <option key={ep.id} value={ep.id}>
                {episodeLabel(ep)}
              </option>
            ))}
          </select>
        </div>

        {/* Segment selector */}
        <div>
          <label className="text-sm font-medium" htmlFor="segment-select">
            Segment
          </label>
          <select
            id="segment-select"
            value={segment}
            onChange={(e) => setSegment(e.target.value as SegmentValue)}
            className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            {SEGMENTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Guest preview */}
        {guestPreview && (
          <p className="rounded-md border bg-muted px-3 py-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Guest: </span>
            {[guestPreview.title, guestPreview.first_name, guestPreview.last_name].filter(Boolean).join(' ')}
            {guestPreview.organization ? ` | ${guestPreview.organization}` : ''}
            {guestPreview.expertise ? ` | ${guestPreview.expertise}` : ''}
          </p>
        )}

        {/* Held auto-extraction awaiting confirmation */}
        {pending && (
          <section className="rounded-md border border-amber-500/40 bg-amber-500/10 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium">
                Auto-extracted {pending.count} lower-third{pending.count !== 1 ? 's' : ''} from the saved script
                {pending.rejected.length > 0 ? `, ${pending.rejected.length} rejected` : ''}.
                <span className="block text-xs font-normal text-muted-foreground">
                  Nothing is in the review queue yet. Confirm to apply, or discard.
                </span>
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={pendingBusy} onClick={() => resolvePending('discard')}>
                  Discard
                </Button>
                <Button size="sm" disabled={pendingBusy} onClick={() => resolvePending('apply')}>
                  {pendingBusy ? 'Working…' : `Confirm ${pending.count}`}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-1 pr-3 font-medium">Beat</th>
                    <th className="pb-1 pr-3 font-medium">Type</th>
                    <th className="pb-1 pr-3 font-medium">Text</th>
                    <th className="pb-1 font-medium">Chars</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pending.graphics.map((g) => (
                    <tr key={g.beat_number}>
                      <td className="py-1.5 pr-3 tabular-nums text-muted-foreground">{g.beat_number}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{g.l3_type}</td>
                      <td className="py-1.5 pr-3 font-mono">{g.primary}</td>
                      <td className={`py-1.5 tabular-nums font-medium ${
                        g.primary.length > 65
                          ? 'text-destructive'
                          : g.primary.length < 55
                            ? 'text-amber-500'
                            : 'text-green-600'
                      }`}>
                        {g.primary.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Script textarea */}
        <div>
          <label className="text-sm font-medium" htmlFor="script-text">
            Script text
          </label>
          <Textarea
            id="script-text"
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            rows={18}
            placeholder="Paste the segment script here…"
            className="mt-1 font-mono text-xs"
            disabled={stage.name === 'extracting' || stage.name === 'importing'}
          />
          {scriptText && (
            <p className="mt-1 text-xs text-muted-foreground">{scriptText.length.toLocaleString()} characters</p>
          )}
        </div>

        {/* Extract button */}
        {(stage.name === 'idle' || stage.name === 'error') && (
          <Button
            onClick={handleExtract}
            disabled={isPending || !episodeId || !scriptText.trim()}
          >
            Extract lower-thirds
          </Button>
        )}

        {stage.name === 'extracting' && (
          <Button disabled>
            <span className="animate-pulse">Extracting with Claude…</span>
          </Button>
        )}

        {/* Error */}
        {stage.name === 'error' && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {stage.message}
          </p>
        )}

        {/* Preview */}
        {stage.name === 'preview' && (
          <section className="rounded-md border bg-muted/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium">
                {stage.graphics.length} lower-third{stage.graphics.length !== 1 ? 's' : ''} extracted
                {stage.rejected.length > 0 ? `, ${stage.rejected.length} rejected` : ''}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setStage({ name: 'idle' })}>
                  Re-extract
                </Button>
                <Button size="sm" onClick={handleImport} disabled={isPending}>
                  {isPending ? 'Importing…' : `Import ${stage.graphics.length} lower-thirds`}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-1 pr-3 font-medium">Beat</th>
                    <th className="pb-1 pr-3 font-medium">Type</th>
                    <th className="pb-1 pr-3 font-medium">Text</th>
                    <th className="pb-1 font-medium">Chars</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stage.graphics.map((g) => (
                    <tr key={g.beat_number}>
                      <td className="py-1.5 pr-3 tabular-nums text-muted-foreground">{g.beat_number}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{g.l3_type}</td>
                      <td className="py-1.5 pr-3 font-mono">{g.primary}</td>
                      <td className={`py-1.5 tabular-nums font-medium ${
                        g.primary.length > 65
                          ? 'text-destructive'
                          : g.primary.length < 55
                            ? 'text-amber-500'
                            : 'text-green-600'
                      }`}>
                        {g.primary.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {stage.rejected.length > 0 && (
              <details className="mt-3 text-xs">
                <summary className="cursor-pointer font-medium text-muted-foreground">
                  {stage.rejected.length} item{stage.rejected.length !== 1 ? 's' : ''} rejected by Claude
                </summary>
                <ul className="ml-3 mt-2 list-disc space-y-1">
                  {stage.rejected.map((r, i) => (
                    <li key={i}>
                      <span className="text-muted-foreground">{r.reason}: </span>
                      <span className="font-mono">{r.raw_text}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        )}

        {/* Importing */}
        {stage.name === 'importing' && (
          <p className="text-sm text-muted-foreground animate-pulse">Pushing to Supabase…</p>
        )}

        {/* Done */}
        {stage.name === 'done' && (
          <p className="text-sm font-medium text-green-700">
            ✓ {stage.count} lower-third{stage.count !== 1 ? 's' : ''} imported — redirecting to review queue…
          </p>
        )}
      </div>
    </>
  )
}
