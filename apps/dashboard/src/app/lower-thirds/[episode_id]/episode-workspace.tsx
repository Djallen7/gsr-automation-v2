'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { GraphicCard } from '../graphic-card'
import { SEGMENTS } from '@/lib/segments'

interface GraphicRow {
  id: string
  segment: string
  beat_number: number | null
  initial_text: string
  status: string
  current_image_url: string
  font_family: string | null
  font_size_pt: number | null
  font_color: string | null
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

type ExtractStage =
  | { name: 'idle' }
  | { name: 'extracting' }
  | { name: 'preview'; payload: ImportPayload; graphics: ExtractedGraphic[]; rejected: RejectedItem[] }
  | { name: 'importing' }
  | { name: 'done'; count: number }
  | { name: 'error'; message: string }

function SegmentSlot({
  episodeId,
  episodeLabel,
  segment,
  segmentLabel,
  initialScript,
  initialGraphics,
}: {
  episodeId: string
  episodeLabel: string
  segment: string
  segmentLabel: string
  initialScript: string | null
  initialGraphics: GraphicRow[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [scriptText, setScriptText] = useState(initialScript ?? '')
  const [scriptSaved, setScriptSaved] = useState(initialScript !== null)
  const [expanded, setExpanded] = useState(initialScript !== null || initialGraphics.length > 0)
  const [savingScript, setSavingScript] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [extractStage, setExtractStage] = useState<ExtractStage>({ name: 'idle' })

  async function handleSaveScript() {
    if (!scriptText.trim()) return
    setSavingScript(true)
    setSaveError(null)
    try {
      const res = await fetch('/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ episode_id: episodeId, segment, script_text: scriptText }),
      })
      const body = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(body.error ?? 'Save failed.')
      setScriptSaved(true)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed.')
    } finally {
      setSavingScript(false)
    }
  }

  function handleExtract() {
    setExtractStage({ name: 'extracting' })
    startTransition(async () => {
      try {
        const res = await fetch('/api/extract-lower-thirds', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ episode_id: episodeId, segment, script_text: scriptText }),
        })
        const body = (await res.json()) as { payload?: ImportPayload; error?: string }
        if (!res.ok || !body.payload) {
          setExtractStage({ name: 'error', message: body.error ?? 'Extraction failed.' })
          return
        }
        const graphics = body.payload.graphics.map((g) => ({
          beat_number: g.beat_number as number,
          l3_type: g.l3_type ?? 'other',
          primary: String(g.primary ?? ''),
          var_1: g.var_1 ?? null,
          var_2: g.var_2 ?? null,
        }))
        setExtractStage({ name: 'preview', payload: body.payload, graphics, rejected: body.payload.rejected })
      } catch (err) {
        setExtractStage({ name: 'error', message: err instanceof Error ? err.message : 'Network error.' })
      }
    })
  }

  function handleImport() {
    if (extractStage.name !== 'preview') return
    const payload = extractStage.payload
    setExtractStage({ name: 'importing' })
    startTransition(async () => {
      try {
        const res = await fetch('/api/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, dry_run: false }),
        })
        const body = (await res.json()) as { error?: string; graphics?: { new: number } }
        if (!res.ok) {
          setExtractStage({ name: 'error', message: body.error ?? 'Import failed.' })
          return
        }
        setExtractStage({ name: 'done', count: body.graphics?.new ?? 0 })
        router.refresh()
      } catch (err) {
        setExtractStage({ name: 'error', message: err instanceof Error ? err.message : 'Network error.' })
      }
    })
  }

  const hasScript = scriptText.trim().length > 0
  const pendingCount = initialGraphics.filter((g) => g.status === 'pending_review').length
  const approvedCount = initialGraphics.filter((g) => g.status === 'approved').length

  return (
    <div className="rounded-md border">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="flex-1 text-sm font-medium">{segmentLabel}</span>
        <div className="flex gap-1.5">
          {scriptSaved && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              script
            </span>
          )}
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
              {pendingCount} pending
            </span>
          )}
          {approvedCount > 0 && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/40 dark:text-green-300">
              {approvedCount} approved
            </span>
          )}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="space-y-4 border-t p-4">
          {/* Script area */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">Script</label>
            <Textarea
              value={scriptText}
              onChange={(e) => {
                setScriptText(e.target.value)
                if (scriptSaved) setScriptSaved(false)
              }}
              rows={10}
              placeholder="Paste script text here…"
              className="mt-1 font-mono text-xs"
              disabled={savingScript || extractStage.name === 'extracting' || extractStage.name === 'importing'}
            />
            {scriptText && (
              <p className="mt-0.5 text-xs text-muted-foreground">{scriptText.length.toLocaleString()} chars</p>
            )}
          </div>

          {saveError && <p className="text-xs text-destructive">{saveError}</p>}

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveScript}
              disabled={savingScript || !hasScript || scriptSaved}
            >
              {savingScript ? 'Saving…' : scriptSaved ? 'Saved ✓' : 'Save script'}
            </Button>

            {(extractStage.name === 'idle' || extractStage.name === 'error') && scriptSaved && (
              <Button size="sm" onClick={handleExtract} disabled={isPending}>
                Extract lower-thirds
              </Button>
            )}
            {extractStage.name === 'extracting' && (
              <Button size="sm" disabled>
                <span className="animate-pulse">Extracting with Claude…</span>
              </Button>
            )}
          </div>

          {extractStage.name === 'error' && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {extractStage.message}
            </p>
          )}

          {extractStage.name === 'preview' && (
            <div className="rounded-md border bg-muted/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium">
                  {extractStage.graphics.length} lower-third{extractStage.graphics.length !== 1 ? 's' : ''} extracted
                  {extractStage.rejected.length > 0 ? `, ${extractStage.rejected.length} rejected` : ''}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setExtractStage({ name: 'idle' })}>
                    Re-extract
                  </Button>
                  <Button size="sm" onClick={handleImport} disabled={isPending}>
                    {isPending ? 'Importing…' : `Import ${extractStage.graphics.length}`}
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
                    {extractStage.graphics.map((g) => (
                      <tr key={g.beat_number}>
                        <td className="py-1.5 pr-3 tabular-nums text-muted-foreground">{g.beat_number}</td>
                        <td className="py-1.5 pr-3 text-muted-foreground">{g.l3_type}</td>
                        <td className="py-1.5 pr-3 font-mono">{g.primary}</td>
                        <td className={`py-1.5 tabular-nums font-medium ${
                          g.primary.length > 65 ? 'text-destructive' : g.primary.length < 55 ? 'text-amber-500' : 'text-green-600'
                        }`}>
                          {g.primary.length}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {extractStage.rejected.length > 0 && (
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer font-medium text-muted-foreground">
                    {extractStage.rejected.length} rejected by Claude
                  </summary>
                  <ul className="ml-3 mt-1 list-disc space-y-0.5">
                    {extractStage.rejected.map((r, i) => (
                      <li key={i}>
                        <span className="text-muted-foreground">{r.reason}: </span>
                        <span className="font-mono">{r.raw_text}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}

          {extractStage.name === 'importing' && (
            <p className="animate-pulse text-sm text-muted-foreground">Pushing to Supabase…</p>
          )}

          {extractStage.name === 'done' && (
            <p className="text-sm font-medium text-green-700">
              ✓ {extractStage.count} lower-third{extractStage.count !== 1 ? 's' : ''} imported
            </p>
          )}

          {/* Pending lower thirds for review */}
          {initialGraphics.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Lower-thirds</p>
              {initialGraphics.map((g) => (
                <GraphicCard
                  key={g.id}
                  id={g.id}
                  segment={g.segment}
                  beatNumber={g.beat_number}
                  initialText={g.initial_text}
                  status={g.status}
                  currentImageUrl={g.current_image_url}
                  episodeLabel={episodeLabel}
                  fontFamily={g.font_family}
                  fontSizePt={g.font_size_pt}
                  fontColor={g.font_color}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function EpisodeWorkspace({
  episode,
  scripts,
  graphics,
}: {
  episode: { id: string; season: number; episode_number: number; title: string | null }
  scripts: { segment: string; script_text: string }[]
  graphics: GraphicRow[]
}) {
  const episodeLabel = `S${String(episode.season).padStart(2, '0')} Ep${String(episode.episode_number).padStart(3, '0')}`
  const scriptsBySegment = new Map(scripts.map((s) => [s.segment, s.script_text]))

  const graphicsBySegment = new Map<string, GraphicRow[]>()
  for (const g of graphics) {
    const arr = graphicsBySegment.get(g.segment) ?? []
    arr.push(g)
    graphicsBySegment.set(g.segment, arr)
  }

  return (
    <div className="space-y-2">
      {SEGMENTS.map((seg) => (
        <SegmentSlot
          key={seg.value}
          episodeId={episode.id}
          episodeLabel={episodeLabel}
          segment={seg.value}
          segmentLabel={seg.label}
          initialScript={scriptsBySegment.get(seg.value) ?? null}
          initialGraphics={graphicsBySegment.get(seg.value) ?? []}
        />
      ))}
    </div>
  )
}
