'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type ImportResponse =
  | {
      dry_run: true
      episodes: { total: number; new: number; updated: number }
      graphics: { total: number; new: number; conflicts: number }
      conflicts: string[]
    }
  | {
      success: true
      episodes: { total: number; new: number; updated: number }
      graphics: { total: number; new: number }
    }
  | { error: string; details?: string[]; conflicts?: string[] }
  | { warning: string; inserted_graphics: number }

export function ImportForm() {
  const [jsonText, setJsonText] = useState('')
  const [dryRun, setDryRun] = useState(true)
  const [result, setResult] = useState<ImportResponse | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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
      </div>
      <p className="text-xs text-muted-foreground">Redirecting to /lower-thirds…</p>
    </div>
  )
}
