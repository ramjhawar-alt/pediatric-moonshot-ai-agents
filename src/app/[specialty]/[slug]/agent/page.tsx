import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Specialty } from '@/lib/types'
import { getAllConditions, getCondition, loadAgent, SPECIALTY_LABELS, SPECIALTY_COLORS } from '@/lib/atlas-utils'
import AgentClientPage from '@/components/agent/AgentClientPage'

export function generateStaticParams() {
  const specialties: Specialty[] = ['cardiology', 'nephrology', 'neurology']
  return specialties.flatMap(specialty =>
    getAllConditions(specialty)
      .filter(c => c.hasAgent)
      .map(c => ({ specialty, slug: c.slug }))
  )
}

export default async function AgentPage({ params }: { params: { specialty: string; slug: string } }) {
  const specialty = params.specialty as Specialty
  const condition = getCondition(specialty, params.slug)
  if (!condition || !condition.hasAgent || !condition.agentSlug) notFound()

  const colors = SPECIALTY_COLORS[specialty]

  const [diagnosisAgent, progressionAgent] = await Promise.all([
    loadAgent(specialty, condition.agentSlug, 'diagnosis'),
    loadAgent(specialty, condition.agentSlug, 'progression'),
  ])

  if (!diagnosisAgent && !progressionAgent) notFound()

  const agentLabel = diagnosisAgent?.type === 'checklist' ? 'Diagnostic Checklist' : 'AI Diagnostic Agent'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${specialty}`} className="hover:text-blue-600 transition-colors">{SPECIALTY_LABELS[specialty]}</Link>
        <span>/</span>
        <Link href={`/${specialty}/${condition.slug}`} className="hover:text-blue-600 transition-colors">{condition.name}</Link>
        <span>/</span>
        <span className="text-slate-700">{agentLabel}</span>
      </nav>

      {/* Header */}
      <div className={`rounded-xl ${colors.bg} border ${colors.border} px-6 py-5 mb-8`}>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{agentLabel}</p>
        <h1 className={`text-2xl font-bold ${colors.text}`}>{condition.name}</h1>
      </div>

      <AgentClientPage
        condition={condition}
        diagnosisAgent={diagnosisAgent}
        progressionAgent={progressionAgent}
      />
    </div>
  )
}
