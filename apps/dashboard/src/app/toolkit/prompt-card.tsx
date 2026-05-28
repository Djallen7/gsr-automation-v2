'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Prompt } from './prompts'

interface Props {
  prompt: Prompt
}

export function PromptCard({ prompt }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = prompt.text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } finally {
        document.body.removeChild(ta)
      }
    }
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground">
      <div className="flex items-start justify-between gap-4 p-4">
        <div className="flex items-start gap-3 min-w-0">
          <span className="shrink-0 text-xs font-mono text-muted-foreground pt-0.5 w-6">
            {String(prompt.id).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <h3 className="font-medium leading-snug">{prompt.name}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{prompt.whenToUse}</p>
            {prompt.warning && (
              <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                ⚠ {prompt.warning}
              </p>
            )}
            {prompt.liveData && (
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                ● Guest roster injected from Supabase
              </p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? 'Hide' : 'Show'}
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-3">
          <pre className="overflow-x-auto whitespace-pre-wrap rounded bg-muted px-3 py-3 text-xs leading-relaxed font-mono">
            {prompt.text}
          </pre>
        </div>
      )}
    </div>
  )
}
