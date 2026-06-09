import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Cpu, ChevronRight } from 'lucide-react'
import type { Specialty } from '@/lib/types'
import { getAllConditions, getCondition, SPECIALTY_LABELS, SPECIALTY_COLORS } from '@/lib/atlas-utils'
import HeredityBadge from '@/components/atlas/HeredityBadge'

export function generateStaticParams() {
  const specialties: Specialty[] = ['cancer', 'cardiology', 'nephrology', 'neurology']
  return specialties.flatMap(specialty =>
    getAllConditions(specialty).map(c => ({ specialty, slug: c.slug }))
  )
}

// ── Text parsing utilities ──────────────────────────────────────────────────

type ParsedContent =
  | { type: 'bullets'; items: string[] }
  | { type: 'paragraph'; text: string }

function parseTreatment(raw: string): ParsedContent {
  if (!raw?.trim()) return { type: 'paragraph', text: '' }

  // Strip leading label prefixes (e.g. "▸ Standard of Care: ", "▸ Emerging: ")
  let text = raw
    .replace(/^[▸►]\s*(Standard of Care|Emerging[^:]*|Investigational[^:]*):\s*/i, '')
    .trim()

  // Nephrology uses • bullet markers
  if (text.includes('•')) {
    const items = text.split('•').map(s => s.trim()).filter(Boolean)
    if (items.length > 1) return { type: 'bullets', items }
  }
  // Some atlases use ▶
  if (text.includes('▶')) {
    const items = text.split('▶').map(s => s.trim()).filter(Boolean)
    if (items.length > 1) return { type: 'bullets', items }
  }

  // Paragraph: join mid-sentence line wraps
  text = text
    .replace(/\n([a-z(±·\-])/g, ' $1')
    .replace(/\n/g, ' ')
    .trim()

  return { type: 'paragraph', text }
}

function parseDiagnosis(raw: string): ParsedContent {
  if (!raw?.trim()) return { type: 'paragraph', text: '' }

  if (raw.includes(';')) {
    const items = raw.split(';').map(s => s.trim()).filter(Boolean)
    if (items.length > 1) return { type: 'bullets', items }
  }

  const text = raw.replace(/\n([a-z(])/g, ' $1').replace(/\n/g, ' ').trim()
  return { type: 'paragraph', text }
}

function renderContent(content: ParsedContent, className = '') {
  if (content.type === 'bullets') {
    return (
      <ul className={`space-y-2 ${className}`}>
        {content.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <p className={`text-sm text-slate-700 leading-relaxed ${className}`}>
      {content.text}
    </p>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function DiseaseDetailPage({
  params,
}: {
  params: { specialty: string; slug: string }
}) {
  const specialty = params.specialty as Specialty
  const condition = getCondition(specialty, params.slug)
  if (!condition) notFound()

  const colors = SPECIALTY_COLORS[specialty]

  const socContent      = parseTreatment(condition.treatment.standardOfCare)
  const emergingContent = parseTreatment(condition.treatment.emerging)
  const diagnosisContent = parseDiagnosis(condition.diagnosis)

  const hasFreq = condition.frequency.us || condition.frequency.global

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/${specialty}`} className="hover:text-slate-600 transition-colors">
          {SPECIALTY_LABELS[specialty]}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-600 font-medium truncate max-w-[240px]">{condition.name}</span>
      </nav>

      {/* Header card */}
      <div className="clinical-card mb-6 overflow-hidden">
        {/* Specialty accent top strip */}
        <div className={`h-1.5 w-full ${
          specialty === 'cancer'     ? 'bg-rose-600' :
          specialty === 'cardiology' ? 'bg-blue-700' :
          specialty === 'nephrology' ? 'bg-amber-600' :
                                       'bg-violet-700'
        }`} />

        <div className="p-6">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-0">
              {/* Category + ID */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${colors.badge}`}>
                  {condition.category}
                </span>
                <HeredityBadge tier={condition.heredityTier} size="md" />
                <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                  #{condition.id}
                </span>
              </div>

              {/* Condition name */}
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {condition.name}
              </h1>
            </div>

            {condition.hasAgent && (
              <Link
                href={`/${specialty}/${condition.slug}/agent`}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors shadow-sm"
              >
                <Cpu className="w-4 h-4" />
                Run Diagnostic Agent
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column — wide */}
        <div className="lg:col-span-2 space-y-4">
          {/* Overview */}
          {condition.description && (
            <div className="clinical-card">
              <div className="clinical-card-header">
                <span className="section-label">Overview</span>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-slate-700 leading-relaxed">{condition.description}</p>
              </div>
            </div>
          )}

          {/* Diagnostic Methods */}
          {condition.diagnosis && (
            <div className="clinical-card">
              <div className="clinical-card-header">
                <span className="section-label">Diagnostic Methods</span>
              </div>
              <div className="px-6 py-5">
                {renderContent(diagnosisContent)}
              </div>
            </div>
          )}

          {/* Treatment */}
          {(condition.treatment.standardOfCare || condition.treatment.emerging) && (
            <div className="clinical-card">
              <div className="clinical-card-header">
                <span className="section-label">Treatment</span>
              </div>
              <div className="px-6 py-5 space-y-5">
                {socContent.type === 'paragraph' && socContent.text && (
                  <div>
                    <div className="treatment-soc">
                      <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-2">
                        Standard of Care
                      </p>
                      {renderContent(socContent)}
                    </div>
                  </div>
                )}
                {socContent.type === 'bullets' && socContent.items.length > 0 && (
                  <div>
                    <div className="treatment-soc">
                      <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-3">
                        Standard of Care
                      </p>
                      {renderContent(socContent)}
                    </div>
                  </div>
                )}
                {emergingContent.type === 'paragraph' && emergingContent.text && (
                  <div>
                    <div className="treatment-emerging">
                      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">
                        Emerging / Investigational
                      </p>
                      {renderContent(emergingContent)}
                    </div>
                  </div>
                )}
                {emergingContent.type === 'bullets' && emergingContent.items.length > 0 && (
                  <div>
                    <div className="treatment-emerging">
                      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-3">
                        Emerging / Investigational
                      </p>
                      {renderContent(emergingContent)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column — narrow */}
        <div className="space-y-4">
          {/* Frequency */}
          {hasFreq && (
            <div className="clinical-card">
              <div className="clinical-card-header">
                <span className="section-label">Epidemiology</span>
              </div>
              <div className="divide-y divide-slate-100">
                {condition.frequency.us && (
                  <div className="px-6 py-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      United States
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {condition.frequency.us}
                    </p>
                  </div>
                )}
                {condition.frequency.global && (
                  <div className="px-6 py-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Global
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {condition.frequency.global}
                    </p>
                  </div>
                )}
                {condition.frequency.sources && (
                  <div className="px-6 py-4 bg-slate-50">
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {condition.frequency.sources}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Agent CTA */}
          {condition.hasAgent && (
            <div className="clinical-card border-blue-200 bg-blue-50">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Cpu className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">AI Agent Available</span>
                </div>
                <p className="text-sm text-blue-800 mb-4 leading-relaxed">
                  100-point weighted diagnostic scoring for {condition.name}.
                </p>
                <Link
                  href={`/${specialty}/${condition.slug}/agent`}
                  className="block w-full text-center px-4 py-2.5 bg-blue-700 text-white rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors"
                >
                  Run Diagnostic Agent
                </Link>
              </div>
            </div>
          )}

          {/* Atlas source */}
          <div className="clinical-card">
            <div className="px-5 py-4">
              <p className="section-label mb-2">Source</p>
              <p className="text-sm text-slate-600">
                Pediatric {SPECIALTY_LABELS[specialty]} Atlas · Condition #{condition.id}
              </p>
              <p className="text-xs text-slate-400 mt-1">Version 1.0 · 2026 · Confidential</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
