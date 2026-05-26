import { createClient } from '@/lib/supabase/server'

export default async function LowerThirdsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-semibold">Lower-thirds review</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Signed in as {user?.email ?? 'unknown'}. The review grid lands in Stage 4.
      </p>
    </main>
  )
}
