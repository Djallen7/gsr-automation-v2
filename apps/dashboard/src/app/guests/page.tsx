import { createClient } from '@/lib/supabase/server'
import { GuestForm, type GuestRow } from './guest-form'

export default async function GuestsPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('guests')
    .select(
      `id, title, first_name, last_name, email, phone,
       job_title, organization, expertise, credentials_display,
       is_yec, is_deceased, do_not_contact, sensitive_flag, sensitive_notes,
       re_approach_after, re_approach_notes, communication_notes,
       notes, website, source`,
    )
    .order('last_name', { ascending: true })
    .order('first_name', { ascending: true })

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-8 py-8">
        <p className="text-sm text-destructive">Failed to load guests: {error.message}</p>
      </main>
    )
  }

  const guests = (data ?? []) as GuestRow[]

  return (
    <main className="mx-auto max-w-5xl px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Guests</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {guests.length} guest{guests.length !== 1 ? 's' : ''}
          </p>
        </div>
        <GuestForm />
      </div>

      {guests.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">No guests yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30">
              <tr>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Organization</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Expertise</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">YEC</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-2.5 text-right font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {guests.map((g) => (
                <tr
                  key={g.id}
                  className={
                    g.do_not_contact || g.is_deceased
                      ? 'opacity-50 bg-muted/20'
                      : 'hover:bg-muted/20 transition-colors'
                  }
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {[g.title, g.first_name, g.last_name].filter(Boolean).join(' ')}
                      </span>
                      {g.do_not_contact && (
                        <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">
                          DNC
                        </span>
                      )}
                      {g.sensitive_flag && (
                        <span className="rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                          sensitive
                        </span>
                      )}
                      {g.is_deceased && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          deceased
                        </span>
                      )}
                    </div>
                    {g.credentials_display && (
                      <span className="text-xs text-muted-foreground">{g.credentials_display}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    <div>{g.organization ?? '—'}</div>
                    {g.job_title && (
                      <div className="text-xs text-muted-foreground/70">{g.job_title}</div>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground max-w-[200px] truncate">
                    {g.expertise ?? '—'}
                  </td>
                  <td className="px-4 py-2.5">
                    {g.is_yec === true && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        YEC
                      </span>
                    )}
                    {g.is_yec === false && (
                      <span className="text-xs text-muted-foreground">No</span>
                    )}
                    {g.is_yec === null && (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {g.email ? (
                      <a
                        href={`mailto:${g.email}`}
                        className="hover:text-foreground transition-colors"
                      >
                        {g.email}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <GuestForm guest={g} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
