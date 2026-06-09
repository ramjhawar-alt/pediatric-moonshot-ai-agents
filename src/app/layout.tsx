import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pediatric Moonshot Atlas | BevelCloud',
  description: 'AI-powered diagnostic agents for 617 pediatric conditions across 4 clinical specialties.',
}

const NAV_LINKS = [
  { href: '/cancer',     label: 'Cancer' },
  { href: '/cardiology', label: 'Cardiology' },
  { href: '/nephrology', label: 'Nephrology' },
  { href: '/neurology',  label: 'Neurology' },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {/* Navigation */}
        <header className="sticky top-0 z-40 bg-clinical-navy border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 16 16" fill="white" className="w-3.5 h-3.5">
                  <path d="M8 1.5L14.5 5v6L8 14.5 1.5 11V5L8 1.5z"/>
                </svg>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm tracking-tight">BevelCloud</span>
                <span className="hidden sm:flex h-4 w-px bg-white/20"/>
                <span className="hidden sm:inline text-slate-400 text-xs font-medium">PediatricMoonshot</span>
              </div>
            </Link>

            {/* Specialty nav */}
            <nav className="flex items-center gap-0.5">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 rounded transition-all"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="border-t border-slate-200 bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-slate-400">
              BevelCloud · PediatricMoonshot.org · Version 1.0 · June 2026 · Confidential
            </p>
            <p className="text-xs text-slate-400">
              AI can accelerate diagnosis and treatment for children rurally, locally and globally.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
