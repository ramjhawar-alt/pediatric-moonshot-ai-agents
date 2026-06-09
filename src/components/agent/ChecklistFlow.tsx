'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import type { ChecklistAgent } from '@/lib/types'

interface Props {
  agent: ChecklistAgent
}

export default function ChecklistFlow({ agent }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  function toggle(key: string) {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const totalItems   = agent.sections.reduce((n, s) => n + s.questions.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length
  const pct          = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  return (
    <div className="max-w-2xl">
      {/* Preamble */}
      {agent.preamble && (
        <div className="clinical-card px-5 py-4 mb-6 bg-slate-50 border-slate-200">
          <p className="text-xs text-slate-500 leading-relaxed">{agent.preamble}</p>
        </div>
      )}

      {/* Progress */}
      <div className="clinical-card mb-6 overflow-hidden">
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-violet-600 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="px-5 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">
            <span className="text-slate-800">{checkedCount}</span>
            <span className="text-slate-400"> / {totalItems} criteria met</span>
          </span>
          {checkedCount > 0 && (
            <button
              onClick={() => setChecked({})}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Sections */}
      {agent.sections.map((section, si) => (
        <div key={si} className="clinical-card mb-4 overflow-hidden">
          <div className="clinical-card-header bg-slate-50">
            <span className="section-label">{section.heading}</span>
            <span className="text-xs text-slate-400">
              {section.questions.filter((_, qi) => checked[`${si}-${qi}`]).length} / {section.questions.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {section.questions.map((q, qi) => {
              const key       = `${si}-${qi}`
              const isChecked = !!checked[key]
              return (
                <label
                  key={key}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer transition-colors ${
                    isChecked ? 'bg-violet-50' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isChecked
                        ? 'bg-violet-600 border-violet-600'
                        : 'border-slate-300'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(key)}
                      className="sr-only"
                    />
                  </div>

                  <div className="flex-1">
                    {/* In checklist format: domain = question text */}
                    <p className="text-sm text-slate-800 leading-relaxed">{q.domain}</p>
                    {/* Show clinical context when checked */}
                    {isChecked && q.question && (
                      <p className="text-xs text-violet-700 mt-2 leading-relaxed bg-violet-50 border border-violet-200 rounded px-3 py-2">
                        {q.question}
                      </p>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      ))}

      {/* Confidence note */}
      {agent.confidenceNote && (
        <div className="clinical-card mt-6 overflow-hidden">
          <div className="clinical-card-header bg-slate-50">
            <span className="section-label">Confidence Interpretation</span>
          </div>
          <div className="px-5 py-5">
            {agent.confidenceNote.split('\n').filter(Boolean).map((line, i) => {
              const isHigh     = line.includes('High Confidence') || line.includes('85')
              const isModerate = line.includes('Moderate') || (line.includes('40') && line.includes('84'))
              const isLow      = line.includes('Low Confidence') || line.includes('<40')
              const color = isHigh
                ? 'border-red-200 bg-red-50 text-red-800'
                : isModerate
                ? 'border-yellow-200 bg-yellow-50 text-yellow-800'
                : isLow
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-slate-50 text-slate-700'
              return (
                <div key={i} className={`rounded-lg border px-4 py-3 mb-2 last:mb-0 ${color}`}>
                  <p className="text-xs leading-relaxed">{line.trim()}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
