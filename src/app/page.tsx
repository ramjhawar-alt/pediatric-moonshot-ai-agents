import Link from 'next/link'
import GlobalSearch from '@/components/search/GlobalSearch'
import { SPECIALTY_LABELS, SPECIALTY_COLORS, CONDITION_COUNTS } from '@/lib/atlas-utils'
import type { Specialty } from '@/lib/types'

const SPECIALTY_ICONS: Record<Specialty, string> = {
  cancer:     '🔬',
  cardiology: '❤️',
  nephrology: '🫘',
  neurology:  '🧠',
}

const SPECIALTIES: Specialty[] = ['cancer', 'cardiology', 'nephrology', 'neurology']

// Total agents across all specialties
const AGENT_COUNTS: Record<Specialty, number> = {
  cancer:     0,
  cardiology: 6,
  nephrology: 6,
  neurology:  9,
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">
            BevelCloud × PediatricMoonshot.org
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
            AI can accelerate diagnosis and treatment<br className="hidden sm:block" /> for children rurally, locally and globally.
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            617 pediatric conditions across 4 specialties — each with a structured knowledge atlas and precise AI diagnostic agents.
          </p>
          <GlobalSearch />
        </div>
      </section>

      {/* Specialty cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-lg font-semibold text-slate-700 mb-6">Browse by Specialty</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SPECIALTIES.map(specialty => {
            const colors = SPECIALTY_COLORS[specialty]
            const agentCount = AGENT_COUNTS[specialty]
            return (
              <Link
                key={specialty}
                href={`/${specialty}`}
                className={`block p-6 rounded-xl border ${colors.bg} ${colors.border} hover:shadow-md transition-all group`}
              >
                <div className="text-3xl mb-3">{SPECIALTY_ICONS[specialty]}</div>
                <h3 className={`text-xl font-bold ${colors.text} group-hover:underline`}>
                  {SPECIALTY_LABELS[specialty]}
                </h3>
                <p className="text-slate-600 mt-1 text-sm">
                  {CONDITION_COUNTS[specialty]} conditions
                </p>
                {agentCount > 0 && (
                  <p className="text-xs mt-2 text-emerald-700 font-medium">
                    ✦ {agentCount} AI diagnostic agent{agentCount !== 1 ? 's' : ''}
                  </p>
                )}
              </Link>
            )
          })}
        </div>
      </section>

      {/* Mission context */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <blockquote className="text-slate-600 italic text-base leading-relaxed mb-4">
            "If you know the enemy and know yourself, you need not fear the result of a hundred battles."
            <span className="block text-xs text-slate-400 mt-1 not-italic">— Sun Tzu, The Art of War</span>
          </blockquote>
          <p className="text-sm text-slate-500">
            The Pediatric Moonshot Atlases are the &ldquo;knowing the enemy.&rdquo; BevelCloud&rsquo;s AI agents are how that
            knowledge becomes actionable diagnosis at the point of care — for any child, anywhere.
          </p>
          <div className="flex flex-wrap gap-4 mt-6 text-xs text-slate-400">
            <span>PediatricMoonshot.org</span>
            <span>·</span>
            <span>bevelcloud.ai</span>
            <span>·</span>
            <span>Version 1.0 · June 2026 · Confidential</span>
          </div>
        </div>
      </section>
    </div>
  )
}
