'use client'

import type { ScoredAgent } from '@/lib/types'
import type { ScoreResult } from '@/lib/types'

const CONFIDENCE_UI = {
  high:     { emoji: '🔴', label: 'High Confidence',     bar: 'bg-red-500'    },
  moderate: { emoji: '🟡', label: 'Moderate Confidence', bar: 'bg-yellow-400' },
  low:      { emoji: '🟢', label: 'Low Confidence',      bar: 'bg-emerald-500'},
}

interface Props {
  score: ScoreResult
  agent: ScoredAgent
  answeredCount: number
  totalEligible: number
}

export default function LiveScoreWidget({ score, agent, answeredCount, totalEligible }: Props) {
  const pct = Math.round((score.currentScore / score.totalPoints) * 100)
  const conf = CONFIDENCE_UI[score.confidenceLevel]
  const progress = totalEligible > 0 ? (answeredCount / totalEligible) * 100 : 0

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Live Score</span>
        <span className="text-xs text-slate-400">{answeredCount} / {totalEligible} answered</span>
      </div>

      <div className="text-3xl font-bold text-slate-900 mb-0.5">
        {score.currentScore}
        <span className="text-base font-normal text-slate-400 ml-1">/ {score.totalPoints} pts</span>
      </div>
      <div className="text-xs text-slate-500 mb-3">Max achievable: {score.maxAchievable} pts</div>

      {/* Score bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all ${conf.bar}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>

      {/* Confidence */}
      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
        <span>{conf.emoji}</span>
        <span>{conf.label}</span>
      </div>

      {/* Progress */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Questions answered</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
