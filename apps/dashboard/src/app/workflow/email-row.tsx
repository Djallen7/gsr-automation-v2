'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { markEmailSent, clearEmailSent } from './actions'

type EmailColumn =
  | 'interview_confirmation_sent_at'
  | 'day_before_reminder_sent_at'
  | 'zoom_link_sent_at'
  | 'post_shoot_followup_sent_at'
  | 'pre_air_notification_sent_at'
  | 'post_air_youtube_sent_at'

interface EmailRowProps {
  episodeGuestId: string
  column: EmailColumn
  label: string
  dueDate: string | null
  sentAt: string | null
}

function formatDue(due: string | null): string {
  if (!due) return ''
  const d = new Date(due)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000)
  if (diff === 0) return 'today'
  if (diff === 1) return 'tomorrow'
  if (diff === -1) return 'yesterday'
  if (diff > 0) return `in ${diff}d`
  return `${Math.abs(diff)}d ago`
}

function formatSent(ts: string): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function EmailRow({ episodeGuestId, column, label, dueDate, sentAt }: EmailRowProps) {
  const [localSentAt, setLocalSentAt] = useState<string | null>(sentAt)
  const [isPending, startTransition] = useTransition()

  function handleMark() {
    const now = new Date().toISOString()
    setLocalSentAt(now) // optimistic
    startTransition(async () => {
      try {
        await markEmailSent(episodeGuestId, column)
      } catch {
        setLocalSentAt(sentAt) // revert
      }
    })
  }

  function handleClear() {
    setLocalSentAt(null) // optimistic
    startTransition(async () => {
      try {
        await clearEmailSent(episodeGuestId, column)
      } catch {
        setLocalSentAt(sentAt) // revert
      }
    })
  }

  const isSent = localSentAt !== null
  const due = formatDue(dueDate)
  const isOverdue = dueDate !== null && new Date(dueDate) < new Date() && !isSent

  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`shrink-0 h-2 w-2 rounded-full ${
            isSent
              ? 'bg-green-500'
              : isOverdue
              ? 'bg-amber-400'
              : dueDate
              ? 'bg-muted-foreground/30'
              : 'bg-muted-foreground/15'
          }`}
        />
        <span className="text-sm">{label}</span>
        {dueDate && !isSent && (
          <span
            className={`text-xs ${
              isOverdue ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-muted-foreground'
            }`}
          >
            {due}
          </span>
        )}
        {isSent && (
          <span className="text-xs text-green-600 dark:text-green-400">
            sent {formatSent(localSentAt!)}
          </span>
        )}
      </div>

      {isSent ? (
        <Button
          variant="ghost"
          size="xs"
          disabled={isPending}
          onClick={handleClear}
          className="text-muted-foreground/50 hover:text-muted-foreground shrink-0"
        >
          Undo
        </Button>
      ) : (
        <Button
          variant="outline"
          size="xs"
          disabled={isPending}
          onClick={handleMark}
          className="shrink-0"
        >
          Mark sent
        </Button>
      )}
    </div>
  )
}
