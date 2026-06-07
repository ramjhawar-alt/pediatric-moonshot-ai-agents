'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import type { AtlasCondition, Specialty } from '@/lib/types'
import { SPECIALTY_COLORS } from '@/lib/atlas-utils'
import HeredityBadge from './HeredityBadge'
import CategoryFilter from './CategoryFilter'
import { searchConditions } from '@/lib/search'

interface Props {
  conditions: AtlasCondition[]
  specialty: Specialty
}

export default function DiseaseList({ conditions, specialty }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAgentOnly, setShowAgentOnly]       = useState(false)
  const [query, setQuery]                        = useState('')

  const colors = SPECIALTY_COLORS[specialty]

  const categories = useMemo(() => {
    const seen = new Set<string>()
    const out: string[] = []
    for (const c of conditions) {
      if (!seen.has(c.category)) { seen.add(c.category); out.push(c.category) }
    }
    return out
  }, [conditions])

  const agentCount = useMemo(() => conditions.filter(c => c.hasAgent).length, [conditions])

  const displayed = useMemo(() => {
    let list: AtlasCondition[]
    if (query.trim().length >= 2) {
      // Fuse search, but restrict to this specialty
      const all = searchConditions(query, 200)
      list = all.filter(c => c.specialty === specialty)
    } else {
      list = conditions
    }
    if (selectedCategory) list = list.filter(c => c.category === selectedCategory)
    if (showAgentOnly)    list = list.filter(c => c.hasAgent)
    return list
  }, [query, conditions, specialty, selectedCategory, showAgentOnly])

  return (
    <div className="flex gap-8">
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        agentCount={agentCount}
        showAgentOnly={showAgentOnly}
        onAgentToggle={() => setShowAgentOnly(v => !v)}
      />

      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search conditions…"
            className="w-full max-w-md border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <p className="text-xs text-slate-400 mb-3">{displayed.length} condition{displayed.length !== 1 ? 's' : ''}</p>

        <ul className="space-y-2">
          {displayed.map(cond => (
            <li key={cond.id}>
              <Link
                href={`/${specialty}/${cond.slug}`}
                className="block p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                        {cond.name}
                      </span>
                      <HeredityBadge tier={cond.heredityTier} />
                      {cond.hasAgent && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          AI Agent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{cond.category}</p>
                    <p className="text-sm text-slate-600 mt-1.5 line-clamp-2">{cond.description}</p>
                  </div>
                  <span className="text-xs text-slate-300 font-mono shrink-0">#{cond.id}</span>
                </div>
              </Link>
            </li>
          ))}
          {displayed.length === 0 && (
            <li className="text-center py-12 text-slate-400 text-sm">No conditions match your filters.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
