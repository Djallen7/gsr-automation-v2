'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SEGMENTS } from '@/lib/segments'
import { buildSegmentTxt, findL3Issues, exportFilename } from '@/lib/propresenter-export'

interface ApprovedGraphic {
  id: string
  segment: string
  beat_number: number | null
  initial_text: string
  approved_text: string | null
  propresenter_added: boolean
}

interface SegmentGroup {
  segment: string
  graphics: ApprovedGraphic[]
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? 'Copied ✓' : label}
    </Button>
  )
}

function DownloadTxtButton({ filename, text, label }: { filename: string; text: string; label: string }) {
  function handleDownload() {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleDownload}>
      {label}
    </Button>
  )
}

export function ReadyOutput({
  season,
  episodeNumber,
  title,
  segments,
}: {
  season: number
  episodeNumber: number
  title: string | null
  segments: SegmentGroup[]
}) {
  const episodeLabel = `S${String(season).padStart(2, '0')} Ep${String(episodeNumber).padStart(3, '0')}`

  return (
    <section>
      <h2 className="text-lg font-semibold">
        {episodeLabel}{title ? ` — ${title}` : ''}
      </h2>

      <div className="mt-3 space-y-4">
        {segments.map(({ segment, graphics }) => {
          const segLabel = SEGMENTS.find((s) => s.value === segment)?.label ?? segment
          const resolved = graphics.map((g) => ({
            segment,
            beat_number: g.beat_number,
            text: g.approved_text ?? g.initial_text,
          }))
          const allText = resolved.map((g) => g.text).join('\n')
          const ppText = buildSegmentTxt(resolved)
          const issues = findL3Issues(resolved)
          const filename = exportFilename(episodeLabel, segment)

          return (
            <div key={segment} className="rounded-md border">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2">
                <span className="text-sm font-medium">
                  {segLabel}
                  {issues.length > 0 && (
                    <span className="ml-2 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-normal text-destructive">
                      {issues.length} need fixing before air
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <CopyButton text={allText} label={`Copy all (${graphics.length})`} />
                  <DownloadTxtButton filename={filename} text={ppText} label="Download for ProPresenter" />
                </div>
              </div>
              <ul className="divide-y">
                {graphics.map((g, i) => {
                  const text = g.approved_text ?? g.initial_text
                  return (
                    <li key={g.id} className="flex items-center gap-3 px-4 py-2">
                      <span className="w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                        {g.beat_number ?? i + 1}
                      </span>
                      <span className="flex-1 font-mono text-sm">{text}</span>
                      <span className={`shrink-0 text-xs tabular-nums ${
                        text.length > 65 ? 'text-destructive font-semibold' : text.length < 55 ? 'text-amber-500' : 'text-muted-foreground'
                      }`}>
                        {text.length}
                      </span>
                      <CopyButton text={text} label="Copy" />
                      {g.propresenter_added && (
                        <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900/40 dark:text-green-300">
                          in ProPres
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
