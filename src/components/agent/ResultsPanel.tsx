'use client'

import { RotateCcw, TrendingUp } from 'lucide-react'
import type { ScoredAgent, ScoreResult, CostTier } from '@/lib/types'

const CONFIDENCE_UI = {
  high: {
    label:  'High Confidence',
    badge:  'bg-red-50 border border-red-200',
    title:  'text-red-800',
    strip:  'bg-red-600',
    dot:    'bg-red-500',
  },
  moderate: {
    label:  'Moderate Confidence',
    badge:  'bg-yellow-50 border border-yellow-200',
    title:  'text-yellow-800',
    strip:  'bg-yellow-400',
    dot:    'bg-yellow-500',
  },
  low: {
    label:  'Low Confidence',
    badge:  'bg-emerald-50 border border-emerald-200',
    title:  'text-emerald-800',
    strip:  'bg-emerald-500',
    dot:    'bg-emerald-500',
  },
}

const COST_LABEL: Record<CostTier, string> = {
  Small:  '$100',
  Medium: '$850',
  Large:  '$3,250',
}

interface Props {
  agent: ScoredAgent
  score: ScoreResult
  onRestart: () => void
}

export default function ResultsPanel({ agent, score, onRestart }: Props) {
  const conf    = agent.confidenceThresholds[score.confidenceLevel]
  const ui      = CONFIDENCE_UI[score.confidenceLevel]
  const pct     = Math.round((score.currentScore / score.totalPoints) * 100)

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Assessment Results</h2>

      {/* Confidence verdict */}
      <div className={`clinical-card mb-6 overflow-hidden ${ui.badge}`}>
        <div className={`h-1.5 ${ui.strip}`} />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2.5 h-2.5 rounded-full ${ui.dot}`} />
            <span className={`text-lg font-bold ${ui.title}`}>{conf.label}</span>
          </div>
          <p className={`text-sm ${ui.title} opacity-80 leading-relaxed`}>{conf.action}</p>
        </div>
      </div>

      {/* Score summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { value: score.currentScore,   label: 'Current Score',     sub: `${pct}%` },
          { value: score.maxAchievable,  label: 'Max Achievable',    sub: 'of tested items' },
          { value: score.totalPoints,    label: 'Full Maximum',      sub: 'all possible' },
        ].map(({ value, label, sub }) => (
          <div key={label} className="clinical-card p-4 text-center">
            <div className="text-2xl font-bold text-slate-800 mb-0.5">{value}</div>
            <div className="text-xs font-semibold text-slate-500 mb-0.5">{label}</div>
            <div className="text-[10px] text-slate-400">{sub}</div>
          </div>
        ))}
      </div>

      {/* Score bar */}
      <div className="clinical-card mb-6 px-5 py-4">
        <div className="flex justify-between text-xs font-medium text-slate-500 mb-2">
          <span>Score distribution</span>
          <span>{pct}% of maximum</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${ui.strip}`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      {/* Pending tests */}
      {score.pendingTests.length > 0 && (
        <div className="clinical-card mb-6 overflow-hidden">
          <div className="clinical-card-header">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              <span className="section-label">Additional Tests — Ranked by Diagnostic Value</span>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Test</th>
                <th className="px-5 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Cost</th>
                <th className="px-5 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">Potential pts</th>
                <th className="px-5 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider">pts / $</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {score.pendingTests.map((t, i) => (
                <tr key={t.testId} className={i === 0 ? 'bg-blue-50' : 'hover:bg-slate-50'}>
                  <td className="px-5 py-3 font-semibold text-slate-700 text-sm">{t.testLabel}</td>
                  <td className="px-5 py-3 text-right text-slate-500 text-sm">{COST_LABEL[t.costTier]}</td>
                  <td className="px-5 py-3 text-right font-bold text-slate-700">{t.potentialPoints}</td>
                  <td className="px-5 py-3 text-right font-bold text-blue-700">{t.pointsPerDollar.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Guidelines */}
      {agent.guidelinesCitation && (
        <div className="clinical-card px-5 py-4 mb-6 bg-slate-50 border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Guidelines</p>
          <p className="text-xs text-slate-600">{agent.guidelinesCitation}</p>
        </div>
      )}

      <button
        onClick={onRestart}
        className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Start Over
      </button>
    </div>
  )
}
