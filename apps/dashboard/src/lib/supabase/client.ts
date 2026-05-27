import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseClientEnv } from './env'

export function createClient() {
  const { url, publishableKey } = getSupabaseClientEnv()
  return createBrowserClient(url, publishableKey)
}
