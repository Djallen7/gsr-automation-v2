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
import { upsertGuest, type GuestFormData } from './actions'

export interface GuestRow {
  id: string
  title: string | null
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  job_title: string | null
  organization: string | null
  expertise: string | null
  credentials_display: string | null
  is_yec: boolean | null
  is_deceased: boolean
  do_not_contact: boolean
  sensitive_flag: boolean
  sensitive_notes: string | null
  re_approach_after: string | null
  re_approach_notes: string | null
  communication_notes: string | null
  notes: string | null
  website: string | null
  source: string | null
}

interface GuestFormProps {
  guest?: GuestRow
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  )
}

function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string
  name: string
  defaultChecked: boolean
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-border"
      />
      {label}
    </label>
  )
}

export function GuestForm({ guest }: GuestFormProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)

    const isYecRaw = fd.get('is_yec') as string
    const is_yec = isYecRaw === 'true' ? true : isYecRaw === 'false' ? false : null

    const data: GuestFormData = {
      title: (fd.get('title') as string) ?? '',
      first_name: (fd.get('first_name') as string) ?? '',
      last_name: (fd.get('last_name') as string) ?? '',
      email: (fd.get('email') as string) ?? '',
      phone: (fd.get('phone') as string) ?? '',
      job_title: (fd.get('job_title') as string) ?? '',
      organization: (fd.get('organization') as string) ?? '',
      expertise: (fd.get('expertise') as string) ?? '',
      credentials_display: (fd.get('credentials_display') as string) ?? '',
      is_yec,
      is_deceased: fd.get('is_deceased') === 'on',
      do_not_contact: fd.get('do_not_contact') === 'on',
      sensitive_flag: fd.get('sensitive_flag') === 'on',
      sensitive_notes: (fd.get('sensitive_notes') as string) ?? '',
      re_approach_after: (fd.get('re_approach_after') as string) ?? '',
      re_approach_notes: (fd.get('re_approach_notes') as string) ?? '',
      communication_notes: (fd.get('communication_notes') as string) ?? '',
      notes: (fd.get('notes') as string) ?? '',
      website: (fd.get('website') as string) ?? '',
      source: (fd.get('source') as string) ?? '',
    }

    startTransition(async () => {
      try {
        await upsertGuest(guest?.id ?? null, data)
        setOpen(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save guest')
      }
    })
  }

  return (
    <>
      <Button
        variant={guest ? 'ghost' : 'default'}
        size="sm"
        onClick={() => setOpen(true)}
      >
        {guest ? 'Edit' : '+ Add guest'}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{guest ? 'Edit guest' : 'Add guest'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Name */}
            <div className="grid grid-cols-3 gap-2">
              <Field label="Title">
                <Input name="title" defaultValue={guest?.title ?? ''} placeholder="Dr." />
              </Field>
              <Field label="First name *">
                <Input
                  name="first_name"
                  required
                  defaultValue={guest?.first_name ?? ''}
                  placeholder="Jane"
                />
              </Field>
              <Field label="Last name *">
                <Input
                  name="last_name"
                  required
                  defaultValue={guest?.last_name ?? ''}
                  placeholder="Smith"
                />
              </Field>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-2">
              <Field label="Email">
                <Input
                  name="email"
                  type="email"
                  defaultValue={guest?.email ?? ''}
                  placeholder="jane@example.com"
                />
              </Field>
              <Field label="Phone">
                <Input
                  name="phone"
                  defaultValue={guest?.phone ?? ''}
                  placeholder="555-555-5555"
                />
              </Field>
            </div>

            {/* Professional */}
            <div className="grid grid-cols-2 gap-2">
              <Field label="Job title">
                <Input
                  name="job_title"
                  defaultValue={guest?.job_title ?? ''}
                  placeholder="Research Scientist"
                />
              </Field>
              <Field label="Organization">
                <Input
                  name="organization"
                  defaultValue={guest?.organization ?? ''}
                  placeholder="Institute of Science"
                />
              </Field>
            </div>

            <Field label="Expertise">
              <Input
                name="expertise"
                defaultValue={guest?.expertise ?? ''}
                placeholder="Paleontology, Geology"
              />
            </Field>

            <Field label="Credentials (display)">
              <Input
                name="credentials_display"
                defaultValue={guest?.credentials_display ?? ''}
                placeholder="Ph.D., M.S."
              />
            </Field>

            <Field label="Website">
              <Input
                name="website"
                defaultValue={guest?.website ?? ''}
                placeholder="https://example.com"
              />
            </Field>

            {/* YEC stance */}
            <Field label="YEC stance">
              <Select
                name="is_yec"
                defaultValue={
                  guest?.is_yec === null || guest?.is_yec === undefined
                    ? 'unknown'
                    : String(guest.is_yec)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Unknown" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unknown">Unknown</SelectItem>
                  <SelectItem value="true">YEC</SelectItem>
                  <SelectItem value="false">Not YEC</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* Safety flags */}
            <div className="flex flex-wrap gap-4 rounded-lg border border-border p-3">
              <CheckboxField
                label="Do not contact"
                name="do_not_contact"
                defaultChecked={guest?.do_not_contact ?? false}
              />
              <CheckboxField
                label="Sensitive"
                name="sensitive_flag"
                defaultChecked={guest?.sensitive_flag ?? false}
              />
              <CheckboxField
                label="Deceased"
                name="is_deceased"
                defaultChecked={guest?.is_deceased ?? false}
              />
            </div>

            {/* Notes */}
            <Field label="Communication notes">
              <Input
                name="communication_notes"
                defaultValue={guest?.communication_notes ?? ''}
                placeholder="Prefers email"
              />
            </Field>

            <Field label="Sensitive notes">
              <Input
                name="sensitive_notes"
                defaultValue={guest?.sensitive_notes ?? ''}
              />
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Re-approach after">
                <Input
                  name="re_approach_after"
                  type="date"
                  defaultValue={guest?.re_approach_after ?? ''}
                />
              </Field>
              <Field label="Re-approach notes">
                <Input
                  name="re_approach_notes"
                  defaultValue={guest?.re_approach_notes ?? ''}
                />
              </Field>
            </div>

            <Field label="General notes">
              <Input name="notes" defaultValue={guest?.notes ?? ''} />
            </Field>

            <Field label="Source">
              <Input
                name="source"
                defaultValue={guest?.source ?? ''}
                placeholder="Referral, conference, etc."
              />
            </Field>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Saving…' : guest ? 'Save changes' : 'Add guest'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
