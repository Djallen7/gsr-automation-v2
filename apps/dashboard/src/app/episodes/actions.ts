'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface EpisodeFormData {
  title: string
  season: string
  episode_number: string
  production_status: string
  shoot_date: string
  air_date: string
  rc_rundown_id: string
  youtube_url: string
  rumble_url: string
  notes: string
}

export async function upsertEpisode(id: string | null, data: EpisodeFormData) {
  const supabase = await createClient()

  const payload = {
    title: data.title || null,
    season: data.season ? parseInt(data.season, 10) : null,
    episode_number: data.episode_number ? parseInt(data.episode_number, 10) : null,
    production_status: data.production_status || 'planned',
    shoot_date: data.shoot_date || null,
    air_date: data.air_date || null,
    rc_rundown_id: data.rc_rundown_id || null,
    youtube_url: data.youtube_url || null,
    rumble_url: data.rumble_url || null,
    notes: data.notes || null,
  }

  if (id) {
    const { error } = await supabase.from('episodes').update(payload).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('episodes').insert(payload)
    if (error) throw new Error(error.message)
  }

  revalidatePath('/episodes')
}
