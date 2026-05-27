import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { ReviewGrid } from './review-grid'

export default async function LowerThirdsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const select = `id, segment, beat_number, initial_text, status, current_image_url,
    episode:episodes(season, episode_number, title)`

  const [{ data: pending }, { data: rejected }] = await Promise.all([
    supabase
      .from('graphics')
      .select(select)
      .eq('status', 'pending_review')
      .order('uploaded_at', { ascending: false })
      .limit(100),
    supabase
      .from('graphics')
      .select(select)
      .eq('status', 'rejected')
      .order('uploaded_at', { ascending: false })
      .limit(100),
  ])

  return (
    <main className="mx-auto max-w-5xl p-8">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Lower-thirds review</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as {user?.email ?? 'unknown'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/approved" className={buttonVariants({ variant: 'outline' })}>
            Approved queue
          </Link>
          <Link href="/upload" className={buttonVariants()}>
            Upload
          </Link>
        </div>
      </header>

      <ReviewGrid initialPending={pending ?? []} initialRejected={rejected ?? []} />
    </main>
  )
}
