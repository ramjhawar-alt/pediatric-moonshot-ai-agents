'use client'

import { useState } from 'react'
import type { ChecklistAgent } from '@/lib/types'

interface Props {
  agent: ChecklistAgent
}

export default function ChecklistFlow({ agent }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  function toggle(key: string) {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const totalItems = agent.sections.reduce((n, s) => n + s.questions.length, 0)
  const checkedCount = Object.values(checked).filter(Boolean).length

  return (
    <div className="max-w-3xl">
      {agent.preamble && (
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4 mb-6 text-sm text-violet-800 leading-relaxed">
          {agent.preamble}
        </div>
      )}

      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-800">{checkedCount}</span> / {totalItems} items checked
        </p>
        {checkedCount > 0 && (
          <button
            onClick={() => setChecked({})}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-violet-500 rounded-full transition-all"
          style={{ width: `${totalItems > 0 ? (checkedCount / totalItems) * 100 : 0}%` }}
        />
      </div>

      {/* Sections */}
      {agent.sections.map((section, si) => (
        <div key={si} className="mb-8">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 pb-2 border-b border-slate-200">
            {section.heading}
          </h3>
          <div className="space-y-2">
            {section.questions.map((q, qi) => {
              const key = `${si}-${qi}`
              const isChecked = !!checked[key]
              return (
                <label
                  key={key}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isChecked ? 'border-violet-200 bg-violet-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(key)}
                    className="mt-0.5 rounded accent-violet-600"
                  />
                  <div>
                    {/* In checklist format: domain = question text, question = clinical context */}
                    <span className="text-sm text-slate-800 leading-relaxed">{q.domain}</span>
                    {isChecked && q.question && (
                      <p className="text-xs text-violet-700 mt-1 italic leading-relaxed">{q.question}</p>
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
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Confidence Interpretation</p>
          <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans leading-relaxed">
            {agent.confidenceNote}
          </pre>
        </div>
      )}
    </div>
  )
}
