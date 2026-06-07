import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pediatric Moonshot Atlas | BevelCloud',
  description: 'Interactive AI diagnostic agents for 617 pediatric conditions across 4 specialties.',
}

const NAV_LINKS = [
  { href: '/cancer',     label: 'Cancer' },
  { href: '/cardiology', label: 'Cardiology' },
  { href: '/nephrology', label: 'Nephrology' },
  { href: '/neurology',  label: 'Neurology' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-slate-900 hover:text-blue-700 transition-colors">
              <span className="text-blue-700 text-lg">⬡</span>
              <span className="text-sm sm:text-base">BevelCloud</span>
              <span className="hidden sm:inline text-slate-300 font-light mx-1">×</span>
              <span className="hidden sm:inline text-xs font-normal text-slate-500">PediatricMoonshot</span>
            </Link>
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-1.5 text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-400">
          <p>BevelCloud · PediatricMoonshot.org · AI can accelerate diagnosis and treatment for children rurally, locally and globally.</p>
        </footer>
      </body>
    </html>
  )
}
