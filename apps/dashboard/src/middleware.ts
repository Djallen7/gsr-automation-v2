import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // course.html, course-overview.html and review.html are public static review files (no auth)
    '/((?!_next/static|_next/image|favicon.ico|course\\.html|course-overview\\.html|review\\.html|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
