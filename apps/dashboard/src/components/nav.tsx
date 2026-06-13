'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/lower-thirds', label: 'Review' },
  { href: '/import', label: 'Import' },
  { href: '/approved', label: 'Approved' },
  { href: '/toolkit', label: 'Toolkit' },
  { href: '/guests', label: 'Guests' },
  { href: '/workflow', label: 'Workflow' },
  { href: '/episodes', label: 'Episodes' },
  { href: '/distribution', label: 'Distribution' },
  { href: '/upload', label: 'Upload' },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-nav backdrop-blur supports-[backdrop-filter]:bg-nav/90">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-8">
        {/* Wordmark */}
        <Link href="/lower-thirds" className="flex items-center gap-2 shrink-0">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-primary text-[11px] font-bold tracking-widest text-primary-foreground">
            GSR
          </span>
          <span className="hidden text-sm font-semibold tracking-tight sm:block">
            Dashboard
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
