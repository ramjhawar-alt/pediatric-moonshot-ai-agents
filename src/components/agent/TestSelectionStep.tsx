'use client'

import type { ScoredAgent, TestOption } from '@/lib/types'

interface Props {
  agent: ScoredAgent
  testOptions: TestOption[]
  completedTests: Set<string>
  onToggle: (id: string) => void
  onBegin: () => void
}

const COST_LABELS = {
  Small:  { label: 'Standard',       desc: 'Existing record / routine tests',              color: 'text-slate-500' },
  Medium: { label: 'Targeted',       desc: '$200–$1,500 · genetic panel, advanced tests',  color: 'text-amber-700' },
  Large:  { label: 'Advanced Imaging', desc: '$1,500–$5,000+ · CT/MRI/cath/RHC',          color: 'text-rose-700' },
}

export default function TestSelectionStep({ agent, testOptions, completedTests, onToggle, onBegin }: Props) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-800 mb-2">What testing has been completed for this patient?</h2>
      <p className="text-sm text-slate-500 mb-6">
        Select all tests that have been done. Questions are filtered to only show what&rsquo;s relevant given completed workup.
      </p>

      {agent.preamble && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-xs text-slate-600 leading-relaxed">
          {agent.preamble}
        </div>
      )}

      {/* Pre-checked: Small (always included) */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <input type="checkbox" checked readOnly className="rounded" />
          <span className="text-sm font-medium text-slate-700">Standard clinical encounter &amp; existing records</span>
          <span className="text-xs text-slate-400">(pre-checked)</span>
        </div>
        <p className={`text-xs ml-6 ${COST_LABELS.Small.color}`}>{COST_LABELS.Small.desc}</p>
      </div>

      {testOptions.length > 0 && (
        <>
          <hr className="mb-4 border-slate-200" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Optional additional tests</p>
          <div className="space-y-3">
            {testOptions.map(opt => {
              const checked = completedTests.has(opt.id)
              const meta = COST_LABELS[opt.costTier]
              return (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    checked ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(opt.id)}
                    className="mt-0.5 rounded"
                  />
                  <div>
                    <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                    <p className={`text-xs mt-0.5 ${meta.color}`}>{meta.label} · {meta.desc}</p>
                  </div>
                </label>
              )
            })}
          </div>
        </>
      )}

      <button
        onClick={onBegin}
        className="mt-8 w-full sm:w-auto px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors shadow"
      >
        Begin Assessment →
      </button>
    </div>
  )
}
