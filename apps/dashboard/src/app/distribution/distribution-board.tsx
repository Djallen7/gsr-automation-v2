'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  STATUS_META,
  STATUS_VALUES,
  type DistStatus,
  type EpisodeDist,
  type PlatformCell,
} from './platforms'
import { setDistributionStatus } from './actions'

const TONE_PILL: Record<EpisodeDist['tone'], string> = {
  past: 'bg-muted text-muted-foreground',
  soon: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  future: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  none: 'bg-muted text-muted-foreground',
}

interface OpenState {
  episodeId: string
  episodeCode: string
  cell: PlatformCell
}

export function DistributionBoard({ episodes }: { episodes: EpisodeDist[] }) {
  const [open, setOpen] = useState<OpenState | null>(null)
  const [status, setStatus] = useState<DistStatus>('pending')
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function openCell(episode: EpisodeDist, cell: PlatformCell) {
    setError(null)
    setStatus(cell.status)
    setUrl(cell.url ?? '')
    setOpen({ episodeId: episode.id, episodeCode: episode.code, cell })
  }

  function save() {
    if (!open) return
    setError(null)
    startTransition(async () => {
      try {
        await setDistributionStatus({
          episodeId: open.episodeId,
          platform: open.cell.id,
          status,
          platformUrl: url,
        })
        setOpen(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save')
      }
    })
  }

  if (episodes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-sm text-muted-foreground">No episodes to distribute yet.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {episodes.map((ep) => (
          <div key={ep.id} className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium">
                  {ep.code}
                  {ep.title && (
                    <span className="text-muted-foreground font-normal"> · {ep.title}</span>
                  )}
                </div>
                {ep.guest && (
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">{ep.guest}</div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-muted-foreground">{ep.dateLabel}</div>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${TONE_PILL[ep.tone]}`}
                >
                  {ep.countdownLabel}
                </span>
              </div>
            </div>

            {/* Live-progress: one segment per applicable platform, filled = live */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex flex-1 gap-0.5" aria-hidden="true">
                {ep.platforms
                  .filter((p) => p.status !== 'not_applicable')
                  .map((p) => (
                    <div
                      key={p.id}
                      className={`h-1.5 flex-1 rounded-full ${
                        p.status === 'live' ? 'bg-green-500' : 'bg-muted'
                      }`}
                    />
                  ))}
              </div>
              <span className="text-[11px] tabular-nums text-muted-foreground shrink-0">
                {ep.liveCount}/{ep.applicable} live
              </span>
            </div>

            {/* Per-platform status chips. Color + word both encode status. */}
            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-5">
              {ep.platforms.map((cell) => {
                const meta = STATUS_META[cell.status]
                return (
                  <button
                    key={cell.id}
                    type="button"
                    onClick={() => openCell(ep, cell)}
                    title={`${cell.label}: ${meta.label}. ${cell.blurb}`}
                    className={`rounded-md border px-2 py-1.5 text-left transition-colors hover:border-foreground/30 ${meta.chip}`}
                  >
                    <div className="truncate text-[11px] font-medium text-foreground">
                      {cell.label}
                    </div>
                    <div className={`text-[10px] font-medium ${meta.text}`}>{meta.label}</div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {open?.cell.label}
              <span className="text-muted-foreground font-normal"> · {open?.episodeCode}</span>
            </DialogTitle>
          </DialogHeader>

          {open && (
            <div className="grid gap-4">
              <p className="text-xs text-muted-foreground">{open.cell.blurb}</p>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Status</label>
                <Select value={status} onValueChange={(v) => setStatus(v as DistStatus)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_VALUES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_META[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Link (optional)
                </label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <DialogFooter showCloseButton>
                <Button onClick={save} disabled={isPending}>
                  {isPending ? 'Saving…' : 'Save'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
