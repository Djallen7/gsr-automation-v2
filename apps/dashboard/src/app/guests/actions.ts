'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface GuestFormData {
  title: string
  first_name: string
  last_name: string
  email: string
  phone: string
  job_title: string
  organization: string
  expertise: string
  credentials_display: string
  is_yec: boolean | null
  is_deceased: boolean
  do_not_contact: boolean
  sensitive_flag: boolean
  sensitive_notes: string
  re_approach_after: string
  re_approach_notes: string
  communication_notes: string
  notes: string
  website: string
  source: string
}

export async function upsertGuest(id: string | null, data: GuestFormData) {
  const supabase = await createClient()

  const payload = {
    title: data.title || null,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email || null,
    phone: data.phone || null,
    job_title: data.job_title || null,
    organization: data.organization || null,
    expertise: data.expertise || null,
    credentials_display: data.credentials_display || null,
    is_yec: data.is_yec,
    is_deceased: data.is_deceased,
    do_not_contact: data.do_not_contact,
    sensitive_flag: data.sensitive_flag,
    sensitive_notes: data.sensitive_notes || null,
    re_approach_after: data.re_approach_after || null,
    re_approach_notes: data.re_approach_notes || null,
    communication_notes: data.communication_notes || null,
    notes: data.notes || null,
    website: data.website || null,
    source: data.source || null,
  }

  if (id) {
    const { error } = await supabase.from('guests').update(payload).eq('id', id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('guests').insert(payload)
    if (error) throw new Error(error.message)
  }

  revalidatePath('/guests')
}
