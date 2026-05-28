'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  title: string
  description: string
  prompt: string
}

export function PromptCard({ title, description, prompt }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = prompt
      ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* silent */ }
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-sm">{title}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" onClick={copy}>
            {copied ? 'Copied ✓' : 'Copy'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded(e => !e)}
            aria-label={expanded ? 'Collapse' : 'Preview'}
          >
            {expanded ? '▲' : '▼'}
          </Button>
        </div>
      </div>
      {expanded && (
        <pre className="mt-3 text-xs bg-muted rounded p-3 whitespace-pre-wrap font-mono leading-relaxed max-h-72 overflow-y-auto">
          {prompt}
        </pre>
      )}
    </div>
  )
}
