'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { PLATFORM_IDS, STATUS_VALUES, type DistStatus } from './platforms'

export interface SetDistributionInput {
  episodeId: string
  platform: string
  status: string
  platformUrl?: string
}

// Tracking + prep only. This writes status to the app's own `distributions`
// table; it never publishes to any platform and never touches production
// hardware. Reversible by design.
export async function setDistributionStatus(input: SetDistributionInput) {
  const { episodeId, platform, status } = input
  const platformUrl = input.platformUrl?.trim() || null

  if (!episodeId) throw new Error('Missing episode')
  if (!PLATFORM_IDS.includes(platform)) throw new Error(`Unknown platform: ${platform}`)
  if (!STATUS_VALUES.includes(status as DistStatus)) throw new Error(`Unknown status: ${status}`)

  const supabase = await createClient()

  // One status row per episode + platform (file_version left null for the
  // episode-level tracker). Find-then-write keeps it deterministic given the
  // UNIQUE (episode_id, platform, file_version) constraint treats nulls as distinct.
  const { data: existing, error: selErr } = await supabase
    .from('distributions')
    .select('id')
    .eq('episode_id', episodeId)
    .eq('platform', platform)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (selErr) throw new Error(selErr.message)

  const patch: {
    status: string
    platform_url: string | null
    went_live_at?: string | null
  } = { status, platform_url: platformUrl }
  if (status === 'live') patch.went_live_at = new Date().toISOString()

  if (existing?.id) {
    const { error } = await supabase.from('distributions').update(patch).eq('id', existing.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase
      .from('distributions')
      .insert({ episode_id: episodeId, platform, ...patch })
    if (error) throw new Error(error.message)
  }

  revalidatePath('/distribution')
}
