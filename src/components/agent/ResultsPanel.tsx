'use client'

import type { ScoredAgent } from '@/lib/types'
import type { ScoreResult } from '@/lib/types'

const CONFIDENCE_UI = {
  high: {
    emoji: '🔴',
    label: 'High Confidence',
    bg:    'bg-red-50 border-red-200',
    text:  'text-red-900',
  },
  moderate: {
    emoji: '🟡',
    label: 'Moderate Confidence',
    bg:    'bg-yellow-50 border-yellow-200',
    text:  'text-yellow-900',
  },
  low: {
    emoji: '🟢',
    label: 'Low Confidence',
    bg:    'bg-emerald-50 border-emerald-200',
    text:  'text-emerald-900',
  },
}

const COST_LABEL = {
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
  const conf = agent.confidenceThresholds[score.confidenceLevel]
  const ui   = CONFIDENCE_UI[score.confidenceLevel]
  const pct  = Math.round((score.currentScore / score.totalPoints) * 100)

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Assessment Results</h2>

      {/* Confidence verdict */}
      <div className={`rounded-xl border p-6 mb-6 ${ui.bg}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{ui.emoji}</span>
          <span className={`text-lg font-bold ${ui.text}`}>{conf.label}</span>
        </div>
        <p className={`text-sm ${ui.text} leading-relaxed`}>{conf.action}</p>
      </div>

      {/* Score summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-900">{score.currentScore}</div>
          <div className="text-xs text-slate-400 mt-1">Current Score</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-600">{score.maxAchievable}</div>
          <div className="text-xs text-slate-400 mt-1">Max Achievable</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-slate-400">{score.totalPoints}</div>
          <div className="text-xs text-slate-400 mt-1">Full Maximum</div>
        </div>
      </div>

      {/* Pending tests table */}
      {score.pendingTests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            Additional Tests — Ranked by Points per Dollar
          </h3>
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left border-b border-slate-200">
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Test</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Est. Cost</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Potential Pts</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Pts / $</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {score.pendingTests.map((t, i) => (
                  <tr key={t.testId} className={i === 0 ? 'bg-blue-50' : ''}>
                    <td className="px-4 py-3 font-medium text-slate-800">{t.testLabel}</td>
                    <td className="px-4 py-3 text-right text-slate-500">{COST_LABEL[t.costTier]}</td>
                    <td className="px-4 py-3 text-right text-slate-700 font-semibold">{t.potentialPoints}</td>
                    <td className="px-4 py-3 text-right text-blue-700 font-bold">{t.pointsPerDollar.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guidelines citation */}
      {agent.guidelinesCitation && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6 text-xs text-slate-500">
          <span className="font-semibold">Guidelines: </span>
          {agent.guidelinesCitation}
        </div>
      )}

      <button
        onClick={onRestart}
        className="px-6 py-2.5 border border-slate-300 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors"
      >
        ← Start Over
      </button>
    </div>
  )
}
