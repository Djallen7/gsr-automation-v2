'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  text: string
  label?: string
}

export function CopyTextButton({ text, label = 'Copy' }: Props) {
  const [copied, setCopied] = useState(false)

  async function onClick() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Older browsers / non-https origins. Fall back to a temporary textarea.
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {
        // Give up silently — user can select & copy manually.
      } finally {
        document.body.removeChild(ta)
      }
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      aria-label={`Copy "${text}"`}
    >
      {copied ? 'Copied ✓' : label}
    </Button>
  )
}
