'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const EXTRACTION_PROMPT = `You are extracting GSR (Genesis Science Report) lower-third graphics from script documents stored in Google Drive.

INPUT: A Google Drive folder, one folder per episode, named like "S3 EP12 - John Smith Interview". Inside is a script Google Doc, plus optionally a sub-folder of standalone lower-third docs.

YOUR JOB: Read every script doc and any lower-third doc in the folder. Extract every lower-third (LT) copy line. Group them by segment. Return JSON in the exact schema given at the end.

SEGMENT ENUM (use these exact values, no others):
show_intro, opening_monologue, interview_1, interview_2, kids_corner, genesis_science_qa, ministry_report, viewer_voices, featured_resource, heavens_declare, genesis_science_minute, other

L3_TYPE ENUM — choose the best match for every graphic:
episode_intro_l3   → show title card / episode number (show_intro segment)
monologue_beat     → a key point in the opening monologue
segment_graphics_title → title card for a segment (e.g. "KIDS CORNER")
topic_l3           → a topic header inside a segment (has var_1, var_2)
guest_chyron       → guest name + title/role (e.g. "DR. JOHN SMITH / GEOLOGIST")
discussion_l3      → a discussion or argument point in an interview
generic_safety_net → fallback when nothing else fits
qa_topic_l3        → a question or topic in Genesis Science Q&A
mr_topic_l3        → a point in Ministry Report
mr_cta_l3          → a call-to-action in Ministry Report
correspondent_chyron → correspondent name + role in Heavens Declare
viewer_l3          → a viewer question or quote in Viewer Voices
resource_l3        → a book/resource title in Featured Resource
cta_l3             → a donation or website call-to-action
other              → anything that doesn't fit above

HOW TO IDENTIFY LOWER-THIRDS IN THE SCRIPT:
- Lower-thirds are written in ALL CAPS, broadcast style.
- They appear as standalone lines, sometimes prefixed with "LT:", "LOWER THIRD:", or "GRAPHIC:".
- A name + role pattern is common: "DR. JOHN SMITH / GEOLOGIST" → guest_chyron.
- Segment headers like "INTERVIEW 1", "KIDS CORNER", "MINISTRY REPORT" tell you which segment enum value to use.
- If a segment header is ambiguous, map it to the closest enum value and put the original header text in source_doc.

EXTRACTION RULES:
- Preserve the LT text exactly as written, including capitalization and slashes.
- Never use em dashes, hyphens, or forward slashes. If the source uses one, replace with a colon.
- beat_number is the order of the LT within its segment, starting at 1.
- primary MUST be 1..200 characters. If a line is longer, put it in the top-level "rejected" array (do not emit it in the graphics array).
- If episode metadata is missing, leave the field as null. Do not invent values.
- title and air_date can be inferred from the folder name when not explicit in the doc.

VARIANTS (var_1, var_2):
For l3_type values episode_intro_l3, segment_graphics_title, and topic_l3, include shorter variant versions in var_1 (medium) and var_2 (short). For all other l3_types, omit var_1 and var_2.

OUTPUT: Return ONLY valid JSON matching this exact schema. No prose, no markdown fences, no commentary.

{
  "episodes": [
    {
      "season":         <int 1..99>,
      "episode_number": <int 1..999>,
      "title":          <string or null>,
      "air_date":       <"YYYY-MM-DD" or null>,
      "guest_name":     <string or null>
    }
  ],
  "graphics": [
    {
      "episode_season":  <int>,
      "episode_number":  <int>,
      "segment":         <segment enum value>,
      "l3_type":         <l3_type enum value>,
      "beat_number":     <int 1..999>,
      "primary":         <string 1..200 chars>,
      "var_1":           <string 1..200 chars, or null if not applicable>,
      "var_2":           <string 1..200 chars, or null if not applicable>,
      "source_doc":      <string or null>
    }
  ],
  "rejected": [
    {
      "reason":     <string — why it was rejected>,
      "raw_text":   <the original text>,
      "source_doc": <string or null>
    }
  ]
}`

interface RejectedItem {
  reason: string
  raw_text: string
  source_doc?: string | null
}

interface RejectedReport {
  total: number
  items: RejectedItem[]
}

type ImportResponse =
  | {
      dry_run: true
      episodes: { total: number; new: number; updated: number }
      graphics: { total: number; new: number; conflicts: number }
      conflicts: string[]
      rejected: RejectedReport
    }
  | {
      success: true
      episodes: { total: number; new: number; updated: number }
      graphics: { total: number; new: number }
      rejected: RejectedReport
    }
  | { error: string; details?: string[]; conflicts?: string[] }
  | { warning: string; inserted_graphics: number }

export function ImportForm() {
  const [jsonText, setJsonText] = useState('')
  const [dryRun, setDryRun] = useState(true)
  const [result, setResult] = useState<ImportResponse | null>(null)
  const [isPending, startTransition] = useTransition()
  const [promptCopied, setPromptCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function copyPrompt() {
    await navigator.clipboard.writeText(EXTRACTION_PROMPT)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 1_000_000) {
      setResult({ error: `File too large (${file.size} bytes). Max 1 MB.` })
      return
    }
    const text = await file.text()
    setJsonText(text)
    setResult(null)
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)

    let parsed: unknown
    try {
      parsed = JSON.parse(jsonText)
    } catch {
      setResult({ error: 'Body is not valid JSON. Check brackets, quotes, trailing commas.' })
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...(parsed as object), dry_run: dryRun }),
        })
        const body = (await response.json()) as ImportResponse
        setResult(body)

        // On successful live submit, redirect to /lower-thirds after a moment.
        if (!dryRun && 'success' in body && body.success) {
          setTimeout(() => router.push('/lower-thirds'), 1500)
        }
      } catch (err) {
        setResult({
          error: err instanceof Error ? err.message : 'Submit failed.',
        })
      }
    })
  }

  return (
    <>
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Import lower-thirds from script JSON</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste JSON from the Claude extraction prompt, or upload a .json file. Dry-run is on by default.
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={copyPrompt}>
            {promptCopied ? '✓ Copied!' : 'Copy extraction prompt'}
          </Button>
          <Link href="/lower-thirds" className={buttonVariants({ variant: 'outline' })}>
            Cancel
          </Link>
        </div>
      </header>

      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <div>
          <label className="text-sm font-medium" htmlFor="json-file">
            JSON file
          </label>
          <input
            ref={fileInputRef}
            id="json-file"
            type="file"
            accept="application/json,.json"
            onChange={onFile}
            className="mt-1 block w-full text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="json-text">
            Or paste JSON directly
          </label>
          <Textarea
            id="json-text"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={16}
            placeholder='{"episodes":[...],"graphics":[...]}'
            className="mt-1 font-mono text-xs"
          />
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={dryRun}
            onChange={(e) => setDryRun(e.target.checked)}
            className="h-4 w-4"
          />
          <span>
            <strong>Dry run</strong> — validate & report, do not write to the database
          </span>
        </label>

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending || !jsonText.trim()}>
            {isPending
              ? 'Working…'
              : dryRun
              ? 'Run dry-run validation'
              : 'Submit for real'}
          </Button>
        </div>
      </form>

      {result && (
        <section className="mt-6 rounded-md border bg-muted/30 p-4 text-sm">
          <ResultPanel result={result} />
        </section>
      )}
    </>
  )
}

function ResultPanel({ result }: { result: ImportResponse }) {
  if ('error' in result) {
    return (
      <div className="space-y-2">
        <p className="font-medium text-destructive">Error: {result.error}</p>
        {result.details && result.details.length > 0 && (
          <ul className="ml-4 list-disc space-y-1 text-xs">
            {result.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        )}
        {result.conflicts && result.conflicts.length > 0 && (
          <>
            <p className="mt-2 font-medium">Conflicts:</p>
            <ul className="ml-4 list-disc space-y-1 text-xs">
              {result.conflicts.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    )
  }

  if ('warning' in result) {
    return (
      <div className="space-y-2">
        <p className="font-medium text-yellow-700">Warning</p>
        <p>{result.warning}</p>
        <p className="text-xs text-muted-foreground">
          inserted_graphics: {result.inserted_graphics}
        </p>
      </div>
    )
  }

  if ('dry_run' in result) {
    return (
      <div className="space-y-2">
        <p className="font-medium">Dry-run report</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          <div>Episodes total:</div>
          <div>{result.episodes.total}</div>
          <div>· new:</div>
          <div>{result.episodes.new}</div>
          <div>· updated:</div>
          <div>{result.episodes.updated}</div>
          <div>Graphics total:</div>
          <div>{result.graphics.total}</div>
          <div>· new:</div>
          <div>{result.graphics.new}</div>
          <div>· conflicts:</div>
          <div>{result.graphics.conflicts}</div>
          <div>Rejected by prompt:</div>
          <div>{result.rejected.total}</div>
        </div>
        {result.conflicts.length > 0 && (
          <>
            <p className="mt-2 font-medium">Conflict details:</p>
            <ul className="ml-4 list-disc space-y-1 text-xs">
              {result.conflicts.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              Resolve in source JSON before running without dry-run.
            </p>
          </>
        )}
        {result.rejected.total > 0 && <RejectedList rejected={result.rejected} />}
      </div>
    )
  }

  // success
  return (
    <div className="space-y-2">
      <p className="font-medium text-green-700">Imported ✓</p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
        <div>Episodes total:</div>
        <div>{result.episodes.total}</div>
        <div>· new:</div>
        <div>{result.episodes.new}</div>
        <div>· updated:</div>
        <div>{result.episodes.updated}</div>
        <div>Graphics inserted:</div>
        <div>{result.graphics.new}</div>
        <div>Rejected by prompt:</div>
        <div>{result.rejected.total}</div>
      </div>
      {result.rejected.total > 0 && <RejectedList rejected={result.rejected} />}
      <p className="text-xs text-muted-foreground">Redirecting to /lower-thirds…</p>
    </div>
  )
}

function RejectedList({ rejected }: { rejected: RejectedReport }) {
  return (
    <details className="mt-2 text-xs">
      <summary className="cursor-pointer font-medium">
        {rejected.total} item(s) rejected by extraction prompt — click to view
      </summary>
      <ul className="mt-2 ml-4 list-disc space-y-2">
        {rejected.items.map((item, i) => (
          <li key={i}>
            <span className="text-muted-foreground">{item.reason}: </span>
            <span className="font-mono">{item.raw_text}</span>
            {item.source_doc ? (
              <span className="text-muted-foreground"> ({item.source_doc})</span>
            ) : null}
          </li>
        ))}
      </ul>
    </details>
  )
}
