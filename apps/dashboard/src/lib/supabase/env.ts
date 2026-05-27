// Single source of truth for the Supabase client env vars.
// Throws once with a clear message instead of three `!` non-null
// assertions scattered across the browser/server/middleware clients.

interface SupabaseClientEnv {
  url: string
  publishableKey: string
}

export function getSupabaseClientEnv(): SupabaseClientEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !publishableKey) {
    throw new Error(
      'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example).',
    )
  }
  return { url, publishableKey }
}
