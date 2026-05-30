import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ExtractForm } from './extract-form'

export default async function ExtractPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: episodes } = await supabase
    .from('episodes')
    .select(`
      id, season, episode_number, title,
      episode_guests(
        segment,
        guest:guests(title, first_name, last_name, organization, expertise)
      )
    `)
    .order('season', { ascending: true })
    .order('episode_number', { ascending: true })

  return (
    <main className="mx-auto max-w-3xl p-8">
      <ExtractForm episodes={episodes ?? []} />
    </main>
  )
}
