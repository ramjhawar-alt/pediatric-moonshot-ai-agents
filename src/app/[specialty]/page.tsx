import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Specialty } from '@/lib/types'
import { getAllConditions, SPECIALTY_LABELS, SPECIALTY_COLORS } from '@/lib/atlas-utils'
import DiseaseList from '@/components/atlas/DiseaseList'

const VALID_SPECIALTIES = new Set(['cancer', 'cardiology', 'nephrology', 'neurology'])

export function generateStaticParams() {
  return ['cancer', 'cardiology', 'nephrology', 'neurology'].map(s => ({ specialty: s }))
}

export default function SpecialtyPage({ params }: { params: { specialty: string } }) {
  if (!VALID_SPECIALTIES.has(params.specialty)) notFound()
  const specialty = params.specialty as Specialty
  const conditions = getAllConditions(specialty)
  const colors = SPECIALTY_COLORS[specialty]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{SPECIALTY_LABELS[specialty]}</span>
      </nav>

      {/* Heading */}
      <div className={`rounded-xl ${colors.bg} border ${colors.border} px-6 py-5 mb-8`}>
        <h1 className={`text-2xl font-bold ${colors.text}`}>{SPECIALTY_LABELS[specialty]}</h1>
        <p className="text-slate-600 text-sm mt-1">{conditions.length} conditions</p>
      </div>

      <DiseaseList conditions={conditions} specialty={specialty} />
    </div>
  )
}
