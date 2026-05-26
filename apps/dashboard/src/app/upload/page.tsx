import { createClient } from '@/lib/supabase/server'
import { UploadForm } from './upload-form'

export default async function UploadPage() {
  const supabase = await createClient()
  const { data: episodes } = await supabase
    .from('episodes')
    .select('id, season, episode_number, title')
    .order('season', { ascending: false })
    .order('episode_number', { ascending: false })

  return (
    <main className="mx-auto max-w-3xl p-8">
      <UploadForm episodes={episodes ?? []} />
    </main>
  )
}
