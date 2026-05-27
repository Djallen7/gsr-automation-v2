import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseClientEnv } from './env'

export async function createClient() {
  const cookieStore = await cookies()
  const { url, publishableKey } = getSupabaseClientEnv()

  return createServerClient(
    url,
    publishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // setAll called from a Server Component is a no-op because Next.js
            // does not allow cookies to be set in Server Components. Middleware
            // handles the refresh, so this catch is intentional.
          }
        },
      },
    },
  )
}
