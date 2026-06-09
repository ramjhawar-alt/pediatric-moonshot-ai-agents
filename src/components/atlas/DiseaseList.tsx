'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Cpu } from 'lucide-react'
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
        {/* Search */}
        <div className="mb-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${conditions.length} conditions…`}
            className="w-full max-w-md pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <p className="text-xs text-slate-400 mb-3 font-medium">
          {displayed.length} condition{displayed.length !== 1 ? 's' : ''}
          {selectedCategory && <span className="ml-1">in {selectedCategory}</span>}
        </p>

        <ul className="space-y-2">
          {displayed.map(cond => (
            <li key={cond.id}>
              <Link
                href={`/${specialty}/${cond.slug}`}
                className="group flex items-start gap-4 p-4 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                {/* Condition number */}
                <span className="text-xs text-slate-300 font-mono w-7 shrink-0 pt-0.5 text-right">
                  {cond.id}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors text-sm">
                      {cond.name}
                    </span>
                    <HeredityBadge tier={cond.heredityTier} />
                    {cond.hasAgent && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase tracking-wide">
                        <Cpu className="w-2.5 h-2.5" />
                        AI Agent
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1.5">
                    {cond.category}
                  </p>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {cond.description}
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 shrink-0 mt-0.5 transition-colors" />
              </Link>
            </li>
          ))}
          {displayed.length === 0 && (
            <li className="text-center py-16 text-slate-400 text-sm">
              No conditions match your filters.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
