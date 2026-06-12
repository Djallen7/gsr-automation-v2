'use client'

import { useId, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'

const SEGMENTS = [
  'opening_monologue',
  'interview_1',
  'interview_2',
  'kids_corner',
  'genesis_science_qa',
  'ministry_report',
  'viewer_voices',
  'featured_resource',
  'heavens_declare',
  'genesis_science_minute',
  'other',
] as const

type Segment = (typeof SEGMENTS)[number]

interface Episode {
  id: string
  season: number
  episode_number: number
  title: string | null
}

interface UploadFormProps {
  episodes: Episode[]
}

const AUTOFILL_PROMPT = `You are extracting metadata for ONE lower-third graphic from a GSR (Genesis Science Report) script.

INPUT: A chunk of GSR script text containing one lower-third reference, OR a description of the lower-third I want to create.

OUTPUT: Return ONLY valid JSON in the exact schema below. No prose, no markdown fences, no commentary.

SEGMENT ENUM (use exactly one of these):
opening_monologue, interview_1, interview_2, kids_corner,
genesis_science_qa, ministry_report, viewer_voices, featured_resource,
heavens_declare, genesis_science_minute, other

RULES:
- initial_text is the on-screen lower-third copy in ALL CAPS broadcast style.
- Never use em dashes; use a forward slash or hyphen.
- If beat_number is unclear, omit the field (the dashboard assigns the next available for that episode + segment).
- season and episode_number are integers. title and guest_name are strings or null.

SCHEMA:
{
  "season": <int>,
  "episode_number": <int>,
  "title": <string or null>,
  "guest_name": <string or null>,
  "segment": <enum value>,
  "beat_number": <int or null>,
  "initial_text": <string>
}

Now extract the JSON for the lower-third described below:

---
[paste your script chunk or LT description here]
---`

interface AutofillPayload {
  season?: number
  episode_number?: number
  title?: string | null
  guest_name?: string | null
  segment?: string
  beat_number?: number | null
  initial_text?: string
}

export function UploadForm({ episodes }: UploadFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const episodeSelectId = useId()
  const seasonId = useId()
  const episodeNumberId = useId()
  const titleId = useId()
  const guestId = useId()
  const segmentId = useId()
  const beatNumberId = useId()
  const initialTextId = useId()
  const errorId = useId()

  const [mode, setMode] = useState<'existing' | 'new'>(
    episodes.length > 0 ? 'existing' : 'new',
  )
  const [episodeId, setEpisodeId] = useState('')
  const [newSeason, setNewSeason] = useState('')
  const [newEpisodeNumber, setNewEpisodeNumber] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newGuestName, setNewGuestName] = useState('')
  const [segment, setSegment] = useState<Segment | ''>('')
  const [beatNumber, setBeatNumber] = useState('')
  const [initialText, setInitialText] = useState('')
  const [autofillJson, setAutofillJson] = useState('')
  const [autofillMessage, setAutofillMessage] = useState<
    { kind: 'ok' | 'error'; text: string } | null
  >(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function handleAutofill() {
    setAutofillMessage(null)
    const raw = autofillJson.trim()
    if (!raw) {
      setAutofillMessage({ kind: 'error', text: 'Paste a JSON snippet first.' })
      return
    }

    let parsed: AutofillPayload
    try {
      parsed = JSON.parse(raw)
    } catch (err) {
      setAutofillMessage({
        kind: 'error',
        text: `Invalid JSON: ${err instanceof Error ? err.message : String(err)}`,
      })
      return
    }

    const filled: string[] = []

    if (typeof parsed.season === 'number' && typeof parsed.episode_number === 'number') {
      setMode('new')
      setNewSeason(String(parsed.season))
      setNewEpisodeNumber(String(parsed.episode_number))
      filled.push('episode')
    }
    if (typeof parsed.title === 'string') {
      setNewTitle(parsed.title)
      filled.push('title')
    }
    if (typeof parsed.guest_name === 'string') {
      setNewGuestName(parsed.guest_name)
      filled.push('guest')
    }
    if (typeof parsed.segment === 'string' && (SEGMENTS as readonly string[]).includes(parsed.segment)) {
      setSegment(parsed.segment as Segment)
      filled.push('segment')
    }
    if (typeof parsed.beat_number === 'number') {
      setBeatNumber(String(parsed.beat_number))
      filled.push('beat')
    }
    if (typeof parsed.initial_text === 'string') {
      setInitialText(parsed.initial_text)
      filled.push('text')
    }

    if (filled.length === 0) {
      setAutofillMessage({
        kind: 'error',
        text: 'JSON parsed but no recognized fields found. Check the schema.',
      })
      return
    }

    setAutofillMessage({
      kind: 'ok',
      text: `Filled ${filled.join(', ')}.`,
    })
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(AUTOFILL_PROMPT)
      setPromptCopied(true)
      setTimeout(() => setPromptCopied(false), 2000)
    } catch {
      // clipboard API can be blocked in some contexts; user can still select+copy
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('saving')
    setErrorMessage(null)

    try {
      if (!segment) throw new Error('Pick a segment.')
      if (!initialText.trim()) throw new Error('Enter the lower-third text.')

      let resolvedEpisodeId: string
      if (mode === 'existing') {
        if (!episodeId) throw new Error('Pick an episode or create a new one.')
        resolvedEpisodeId = episodeId
      } else {
        const seasonNum = Number(newSeason)
        const epNum = Number(newEpisodeNumber)
        if (!seasonNum || !epNum) {
          throw new Error('Enter both season and episode number for the new episode.')
        }
        const { data: episodeData, error: epError } = await supabase
          .from('episodes')
          .upsert(
            {
              season: seasonNum,
              episode_number: epNum,
              title: newTitle.trim() || null,
              guest_name: newGuestName.trim() || null,
            },
            { onConflict: 'season,episode_number' },
          )
          .select('id')
          .single()
        if (epError) throw epError
        resolvedEpisodeId = episodeData.id
      }

      let computedBeat = Number(beatNumber)
      if (!computedBeat) {
        const { data: maxData } = await supabase
          .from('production_lower_thirds')
          .select('beat_number')
          .eq('episode_id', resolvedEpisodeId)
          .eq('segment', segment)
          .order('beat_number', { ascending: false })
          .limit(1)
        computedBeat = (maxData?.[0]?.beat_number ?? 0) + 1
      }

      const { data: ltData, error: ltError } = await supabase
        .from('production_lower_thirds')
        .insert({
          episode_id: resolvedEpisodeId,
          segment,
          beat_number: computedBeat,
          initial_text: initialText,
          status: 'pending_review',
        })
        .select('id')
        .single()
      if (ltError) throw ltError

      const { error: varError } = await supabase.from('lower_thirds_variations').insert({
        graphic_id: ltData.id,
        variation_number: 1,
        text_content: initialText,
        generated_by: 'human',
        generation_context: null,
      })
      if (varError) throw varError

      router.push('/lower-thirds')
      router.refresh()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add lower-third</CardTitle>
        <CardDescription>Manually add a text lower-third to an episode.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2 rounded-md border border-dashed border-muted-foreground/30 p-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium">
                Paste JSON to autofill (optional)
              </label>
              <button
                type="button"
                className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                onClick={() => setShowPrompt((s) => !s)}
              >
                {showPrompt ? 'Hide Claude prompt' : 'Show Claude prompt'}
              </button>
            </div>
            {showPrompt ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  Copy this prompt into Claude.ai, paste your script chunk where indicated, and the response will be JSON you can paste below.
                </p>
                <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded bg-muted p-2 text-xs">
                  {AUTOFILL_PROMPT}
                </pre>
                <button
                  type="button"
                  className="self-start text-xs text-primary underline-offset-2 hover:underline"
                  onClick={copyPrompt}
                >
                  {promptCopied ? 'Copied' : 'Copy prompt'}
                </button>
              </div>
            ) : null}
            <Textarea
              placeholder='{"season": 3, "episode_number": 12, "segment": "interview_1", "initial_text": "DR. JOHN SMITH / GEOLOGIST", ...}'
              value={autofillJson}
              onChange={(e) => setAutofillJson(e.target.value)}
              rows={3}
              className="font-mono text-xs"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAutofill}
                className="text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                Fill from JSON
              </button>
              {autofillMessage ? (
                <span
                  className={
                    autofillMessage.kind === 'ok'
                      ? 'text-xs text-muted-foreground'
                      : 'text-xs text-destructive'
                  }
                >
                  {autofillMessage.text}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium" id={`${episodeSelectId}-label`}>Episode</span>
            {episodes.length > 0 ? (
              <div className="flex gap-3 text-sm" role="group" aria-label="Episode mode">
                <button
                  type="button"
                  aria-pressed={mode === 'existing'}
                  className={mode === 'existing' ? 'font-semibold' : 'text-muted-foreground'}
                  onClick={() => setMode('existing')}
                >
                  Existing
                </button>
                <span className="text-muted-foreground" aria-hidden="true">/</span>
                <button
                  type="button"
                  aria-pressed={mode === 'new'}
                  className={mode === 'new' ? 'font-semibold' : 'text-muted-foreground'}
                  onClick={() => setMode('new')}
                >
                  New
                </button>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No episodes yet. Create one below.
              </p>
            )}
            {mode === 'existing' && episodes.length > 0 ? (
              <Select value={episodeId} onValueChange={(v) => setEpisodeId(v ?? '')}>
                <SelectTrigger id={episodeSelectId} aria-labelledby={`${episodeSelectId}-label`}>
                  <SelectValue placeholder="Pick an episode" />
                </SelectTrigger>
                <SelectContent>
                  {episodes.map((ep) => (
                    <SelectItem key={ep.id} value={ep.id}>
                      S{ep.season}E{ep.episode_number}
                      {ep.title ? ` — ${ep.title}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Input
                  id={seasonId}
                  aria-label="Season"
                  type="number"
                  min="1"
                  placeholder="Season"
                  value={newSeason}
                  onChange={(e) => setNewSeason(e.target.value)}
                  required={mode === 'new'}
                />
                <Input
                  id={episodeNumberId}
                  aria-label="Episode number"
                  type="number"
                  min="1"
                  placeholder="Episode #"
                  value={newEpisodeNumber}
                  onChange={(e) => setNewEpisodeNumber(e.target.value)}
                  required={mode === 'new'}
                />
                <Input
                  id={titleId}
                  aria-label="Title (optional)"
                  placeholder="Title (optional)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Input
                  id={guestId}
                  aria-label="Guest (optional)"
                  placeholder="Guest (optional)"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={segmentId} className="text-sm font-medium">Segment</label>
            <Select value={segment} onValueChange={(v) => setSegment((v as Segment) ?? '')}>
              <SelectTrigger id={segmentId}>
                <SelectValue placeholder="Pick a segment" />
              </SelectTrigger>
              <SelectContent>
                {SEGMENTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replaceAll('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={beatNumberId} className="text-sm font-medium">Beat number (optional)</label>
            <Input
              id={beatNumberId}
              type="number"
              min="1"
              placeholder="Defaults to next available for this segment"
              value={beatNumber}
              onChange={(e) => setBeatNumber(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={initialTextId} className="text-sm font-medium">Lower-third text</label>
            <Textarea
              id={initialTextId}
              placeholder="DR. JOHN SMITH / GEOLOGIST"
              value={initialText}
              onChange={(e) => setInitialText(e.target.value)}
              rows={2}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={status === 'saving'}
            aria-describedby={status === 'error' && errorMessage ? errorId : undefined}
          >
            {status === 'saving' ? 'Saving…' : 'Add lower-third'}
          </Button>

          {status === 'error' && errorMessage ? (
            <p
              id={errorId}
              role="alert"
              aria-live="polite"
              className="text-sm text-destructive"
            >
              {errorMessage}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  )
}
