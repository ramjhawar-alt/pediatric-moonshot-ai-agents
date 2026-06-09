'use client'

import { ArrowRight, Check } from 'lucide-react'
import type { ScoredAgent, TestOption, CostTier } from '@/lib/types'

interface Props {
  agent: ScoredAgent
  testOptions: TestOption[]
  completedTests: Set<string>
  onToggle: (id: string) => void
  onBegin: () => void
}

const COST_META: Record<CostTier, { label: string; desc: string; badge: string }> = {
  Small:  {
    label: 'Standard',
    desc:  'Existing record / routine clinical tests',
    badge: 'text-slate-500 bg-slate-100 border-slate-200',
  },
  Medium: {
    label: 'Targeted',
    desc:  'Est. $200 – $1,500 · genetic panels, advanced tests',
    badge: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  Large:  {
    label: 'Advanced Imaging',
    desc:  'Est. $1,500 – $5,000+ · CT/MRI, catheterization, RHC',
    badge: 'text-rose-700 bg-rose-50 border-rose-200',
  },
}

export default function TestSelectionStep({
  agent,
  testOptions,
  completedTests,
  onToggle,
  onBegin,
}: Props) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-800 mb-1">
        What testing has been completed?
      </h2>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        Select all tests done for this patient. Only relevant questions will appear based on your selection.
      </p>

      {/* Preamble */}
      {agent.preamble && (
        <div className="clinical-card px-5 py-4 mb-6 bg-slate-50 border-slate-200">
          <p className="text-xs text-slate-500 leading-relaxed">{agent.preamble}</p>
        </div>
      )}

      {/* Pre-checked: Small cost */}
      <div className="clinical-card mb-4 overflow-hidden">
        <div className="clinical-card-header bg-slate-50">
          <span className="section-label">Always Included</span>
        </div>
        <div className="px-5 py-4 flex items-start gap-3">
          <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Standard clinical encounter &amp; existing records</p>
            <p className="text-xs text-slate-400 mt-0.5">{COST_META.Small.desc}</p>
          </div>
        </div>
      </div>

      {/* Optional tests */}
      {testOptions.length > 0 && (
        <div className="clinical-card overflow-hidden mb-6">
          <div className="clinical-card-header bg-slate-50">
            <span className="section-label">Optional Additional Tests</span>
            <span className="text-xs text-slate-400">{completedTests.size} selected</span>
          </div>
          <div className="divide-y divide-slate-100">
            {testOptions.map(opt => {
              const checked = completedTests.has(opt.id)
              const meta = COST_META[opt.costTier]
              return (
                <label
                  key={opt.id}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors ${
                    checked ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    checked
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-slate-300'
                  }`}>
                    {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(opt.id)}
                      className="sr-only"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-slate-700">{opt.label}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${meta.badge}`}>
                        {meta.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{meta.desc}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      )}

      <button
        onClick={onBegin}
        className="inline-flex items-center gap-2 px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors shadow-sm"
      >
        Begin Assessment
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
