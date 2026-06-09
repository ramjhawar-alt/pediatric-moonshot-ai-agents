import Link from 'next/link'
import { Microscope, Heart, Droplets, Brain, ChevronRight, Cpu } from 'lucide-react'
import GlobalSearch from '@/components/search/GlobalSearch'
import { SPECIALTY_LABELS, CONDITION_COUNTS } from '@/lib/atlas-utils'
import type { Specialty } from '@/lib/types'

const SPECIALTIES: { id: Specialty; icon: React.ComponentType<{ className?: string }>; agents: number; accent: string; textAccent: string; border: string }[] = [
  { id: 'cancer',     icon: Microscope, agents: 0,  accent: 'bg-rose-600',   textAccent: 'text-rose-600',   border: 'border-rose-200' },
  { id: 'cardiology', icon: Heart,      agents: 6,  accent: 'bg-blue-700',   textAccent: 'text-blue-700',   border: 'border-blue-200' },
  { id: 'nephrology', icon: Droplets,   agents: 6,  accent: 'bg-amber-600',  textAccent: 'text-amber-600',  border: 'border-amber-200' },
  { id: 'neurology',  icon: Brain,      agents: 9,  accent: 'bg-violet-700', textAccent: 'text-violet-700', border: 'border-violet-200' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-clinical-navy dot-grid overflow-hidden py-20 px-4">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Kicker */}
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-300 text-xs font-semibold tracking-widest uppercase">
              BevelCloud × PediatricMoonshot.org
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
            AI-powered diagnostic agents for<br className="hidden sm:block" />
            <span className="text-blue-400"> pediatric rare disease.</span>
          </h1>

          <p className="text-slate-300 text-lg mb-4 max-w-2xl mx-auto leading-relaxed">
            617 conditions · 4 specialties · 21 precision diagnostic agents
          </p>
          <p className="text-slate-500 text-sm mb-10 max-w-xl mx-auto italic">
            "If you know the enemy and know yourself, you need not fear the result of a hundred battles." — Sun Tzu
          </p>

          <GlobalSearch />
        </div>
      </section>

      {/* Specialty grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="section-label mb-5">Browse by Specialty</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SPECIALTIES.map(({ id, icon: Icon, agents, accent, textAccent, border }) => (
            <Link
              key={id}
              href={`/${id}`}
              className={`group clinical-card border ${border} hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              {/* Accent strip */}
              <div className={`h-1 ${accent}`} />

              <div className="p-6">
                <div className={`w-10 h-10 rounded-lg ${accent} bg-opacity-10 flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${textAccent}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">
                  {SPECIALTY_LABELS[id]}
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  {CONDITION_COUNTS[id]} conditions
                </p>
                {agents > 0 ? (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-2 py-1 w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {agents} AI agents
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">Atlas only</div>
                )}
              </div>

              <div className={`px-6 py-3 border-t ${border} bg-slate-50 flex items-center justify-between`}>
                <span className="text-xs text-slate-400 font-medium">Browse conditions</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* About section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="clinical-card p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-2">About This Platform</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                The Pediatric Moonshot Atlases encode knowledge of 617 rare pediatric conditions across Cancer, Cardiology, Nephrology, and Neurology. BevelCloud&rsquo;s precision AI agents operationalize that knowledge — delivering 100-point weighted diagnostic scoring at the point of care for any child, anywhere.
              </p>
              <p className="text-slate-400 text-xs">
                In the next 25 years, the number of known pediatric neurological conditions could exceed 400 — up from 233 today. Federated, privacy-preserving AI infrastructure is not optional. It must be built now.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
