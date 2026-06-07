import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Specialty } from '@/lib/types'
import { getAllConditions, getCondition, SPECIALTY_LABELS, SPECIALTY_COLORS } from '@/lib/atlas-utils'
import HeredityBadge from '@/components/atlas/HeredityBadge'

export function generateStaticParams() {
  const specialties: Specialty[] = ['cancer', 'cardiology', 'nephrology', 'neurology']
  return specialties.flatMap(specialty =>
    getAllConditions(specialty).map(c => ({ specialty, slug: c.slug }))
  )
}

function TreatmentBlock({ label, text, color }: { label: string; text: string; color: string }) {
  if (!text) return null
  return (
    <div className={color + ' mb-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed'}>
      <span className="block font-semibold text-xs uppercase tracking-wide text-current opacity-70 mb-1">{label}</span>
      {text}
    </div>
  )
}

export default function DiseaseDetailPage({ params }: { params: { specialty: string; slug: string } }) {
  const specialty = params.specialty as Specialty
  const condition = getCondition(specialty, params.slug)
  if (!condition) notFound()

  const colors = SPECIALTY_COLORS[specialty]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href={`/${specialty}`} className="hover:text-blue-600 transition-colors">{SPECIALTY_LABELS[specialty]}</Link>
        <span>/</span>
        <span className="text-slate-700">{condition.name}</span>
      </nav>

      {/* Header card */}
      <div className={`rounded-xl ${colors.bg} border ${colors.border} px-6 py-6 mb-6`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors.badge}`}>{condition.category}</span>
              <HeredityBadge tier={condition.heredityTier} size="md" />
              <span className="text-xs text-slate-400 font-mono">#{condition.id}</span>
            </div>
            <h1 className={`text-2xl font-bold ${colors.text}`}>{condition.name}</h1>
          </div>
          {condition.hasAgent && (
            <Link
              href={`/${specialty}/${condition.slug}/agent`}
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors shadow"
            >
              Run Diagnostic Agent →
            </Link>
          )}
        </div>
      </div>

      {/* Content sections */}
      <div className="space-y-5">
        {condition.description && (
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Description</h2>
            <p className="text-slate-700 leading-relaxed">{condition.description}</p>
          </section>
        )}

        {(condition.frequency.us || condition.frequency.global) && (
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Frequency / Epidemiology</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {condition.frequency.us && (
                <div>
                  <span className="text-xs text-slate-400 block mb-1">US</span>
                  <p className="text-slate-700 text-sm leading-relaxed">{condition.frequency.us}</p>
                </div>
              )}
              {condition.frequency.global && (
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Global</span>
                  <p className="text-slate-700 text-sm leading-relaxed">{condition.frequency.global}</p>
                </div>
              )}
            </div>
            {condition.frequency.sources && (
              <p className="text-xs text-slate-400 mt-3 border-t border-slate-100 pt-3">{condition.frequency.sources}</p>
            )}
          </section>
        )}

        {condition.diagnosis && (
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Diagnostic Methods</h2>
            <p className="text-slate-700 text-sm leading-relaxed">{condition.diagnosis}</p>
          </section>
        )}

        {(condition.treatment.standardOfCare || condition.treatment.emerging) && (
          <section className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Treatment</h2>
            <TreatmentBlock
              label="Standard of Care"
              text={condition.treatment.standardOfCare}
              color="treatment-soc"
            />
            <TreatmentBlock
              label="Emerging / Investigational"
              text={condition.treatment.emerging}
              color="treatment-emerging"
            />
          </section>
        )}
      </div>

      {/* Agent CTA at bottom */}
      {condition.hasAgent && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-semibold text-blue-900">AI Diagnostic Agent Available</p>
            <p className="text-sm text-blue-700 mt-0.5">
              Run the 100-point weighted diagnostic scoring questionnaire for {condition.name}.
            </p>
          </div>
          <Link
            href={`/${specialty}/${condition.slug}/agent`}
            className="shrink-0 px-5 py-2.5 bg-blue-700 text-white rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors shadow"
          >
            Run Diagnostic Agent →
          </Link>
        </div>
      )}
    </div>
  )
}
