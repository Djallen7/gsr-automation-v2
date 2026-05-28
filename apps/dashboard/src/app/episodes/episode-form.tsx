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
import { upsertEpisode, type EpisodeFormData } from './actions'

export interface EpisodeRow {
  id: string
  title: string | null
  season: number | null
  episode_number: number | null
  production_status: string
  shoot_date: string | null
  air_date: string | null
  rc_rundown_id: string | null
  youtube_url: string | null
  rumble_url: string | null
  notes: string | null
}

const STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned' },
  { value: 'in_prep', label: 'In Prep' },
  { value: 'shot', label: 'Shot' },
  { value: 'in_post', label: 'In Post' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'aired', label: 'Aired' },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

interface EpisodeFormProps {
  episode?: EpisodeRow
}

export function EpisodeForm({ episode }: EpisodeFormProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)

    const data: EpisodeFormData = {
      title: (fd.get('title') as string) ?? '',
      season: (fd.get('season') as string) ?? '',
      episode_number: (fd.get('episode_number') as string) ?? '',
      production_status: (fd.get('production_status') as string) ?? 'planned',
      shoot_date: (fd.get('shoot_date') as string) ?? '',
      air_date: (fd.get('air_date') as string) ?? '',
      rc_rundown_id: (fd.get('rc_rundown_id') as string) ?? '',
      youtube_url: (fd.get('youtube_url') as string) ?? '',
      rumble_url: (fd.get('rumble_url') as string) ?? '',
      notes: (fd.get('notes') as string) ?? '',
    }

    startTransition(async () => {
      try {
        await upsertEpisode(episode?.id ?? null, data)
        setOpen(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save episode')
      }
    })
  }

  return (
    <>
      <Button
        variant={episode ? 'ghost' : 'default'}
        size="sm"
        onClick={() => setOpen(true)}
      >
        {episode ? 'Edit' : '+ Add episode'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{episode ? 'Edit episode' : 'Add episode'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <Field label="Title">
              <Input
                name="title"
                defaultValue={episode?.title ?? ''}
                placeholder="Episode title"
              />
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Season">
                <Input
                  name="season"
                  type="number"
                  min="1"
                  defaultValue={episode?.season ?? ''}
                  placeholder="3"
                />
              </Field>
              <Field label="Episode #">
                <Input
                  name="episode_number"
                  type="number"
                  min="1"
                  defaultValue={episode?.episode_number ?? ''}
                  placeholder="1"
                />
              </Field>
            </div>

            <Field label="Production status">
              <Select name="production_status" defaultValue={episode?.production_status ?? 'planned'}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Shoot date">
                <Input
                  name="shoot_date"
                  type="date"
                  defaultValue={episode?.shoot_date ?? ''}
                />
              </Field>
              <Field label="Air date">
                <Input
                  name="air_date"
                  type="date"
                  defaultValue={episode?.air_date ?? ''}
                />
              </Field>
            </div>

            <Field label="RC Rundown ID">
              <Input
                name="rc_rundown_id"
                defaultValue={episode?.rc_rundown_id ?? ''}
                placeholder="79"
              />
            </Field>

            <Field label="YouTube URL">
              <Input
                name="youtube_url"
                defaultValue={episode?.youtube_url ?? ''}
                placeholder="https://youtube.com/watch?v=..."
              />
            </Field>

            <Field label="Rumble URL">
              <Input
                name="rumble_url"
                defaultValue={episode?.rumble_url ?? ''}
                placeholder="https://rumble.com/..."
              />
            </Field>

            <Field label="Notes">
              <Input name="notes" defaultValue={episode?.notes ?? ''} />
            </Field>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : episode ? 'Save changes' : 'Add episode'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
