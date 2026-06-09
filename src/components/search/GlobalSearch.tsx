'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Search, Cpu, ChevronRight } from 'lucide-react'
import type { AtlasCondition } from '@/lib/types'
import { searchConditions } from '@/lib/search'
import { SPECIALTY_LABELS } from '@/lib/atlas-utils'

export default function GlobalSearch() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<AtlasCondition[]>([])
  const [open, setOpen]       = useState(false)
  const containerRef          = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.trim().length >= 2) {
      setResults(searchConditions(query, 10))
      setOpen(true)
    } else {
      setResults([])
      setOpen(false)
    }
  }, [query])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search 617 conditions across all specialties…"
          className="w-full pl-12 pr-4 py-4 text-base bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-slate-400 rounded-xl focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all"
        />
      </div>

      {open && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {results.map(c => (
            <li key={`${c.specialty}-${c.slug}`}>
              <Link
                href={`/${c.specialty}/${c.slug}`}
                onClick={() => { setOpen(false); setQuery('') }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                    {c.name}
                  </span>
                  <span className="text-xs text-slate-400 ml-2">{c.category}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {c.hasAgent && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      <Cpu className="w-2.5 h-2.5" />
                      Agent
                    </span>
                  )}
                  <span className="text-xs text-slate-400">{SPECIALTY_LABELS[c.specialty]}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
