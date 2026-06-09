'use client'

import { ChevronLeft, ChevronRight, SkipForward } from 'lucide-react'
import type { IndexedQuestion } from '@/lib/scoring'
import type { ScoreResult } from '@/lib/types'

interface Props {
  question: IndexedQuestion
  questionNumber: number    // 1-based
  totalQuestions: number
  sectionName: string
  answer: boolean | null | undefined
  onAnswer: (key: string, value: boolean | null) => void
  onPrevious: () => void
  onNext: () => void
  isFirst: boolean
  isLast: boolean
  score: ScoreResult
}

const CONFIDENCE_COLOR = {
  high:     'text-red-500',
  moderate: 'text-yellow-500',
  low:      'text-emerald-500',
}

const CONFIDENCE_LABEL = {
  high:     'High',
  moderate: 'Moderate',
  low:      'Low',
}

const COST_LABEL = {
  Small:  { text: 'Standard',   cls: 'text-slate-500 bg-slate-100' },
  Medium: { text: 'Targeted',   cls: 'text-amber-700 bg-amber-50'  },
  Large:  { text: 'Advanced',   cls: 'text-rose-700 bg-rose-50'    },
}

export default function SingleQuestionView({
  question,
  questionNumber,
  totalQuestions,
  sectionName,
  answer,
  onAnswer,
  onPrevious,
  onNext,
  isFirst,
  isLast,
  score,
}: Props) {
  const progress = (questionNumber - 1) / totalQuestions

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── Progress bar + score strip ──────────────────────────────── */}
      <div className="clinical-card mb-6 overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <div className="px-5 py-3 flex items-center justify-between">
          {/* Progress label */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              Question <span className="text-slate-800">{questionNumber}</span> of {totalQuestions}
            </span>
            <span className="hidden sm:block text-slate-200">|</span>
            <span className="hidden sm:block text-xs text-slate-400 truncate max-w-[180px]">{sectionName}</span>
          </div>

          {/* Live score (compact) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Score</span>
            <span className="text-sm font-bold text-slate-800">{score.currentScore}</span>
            <span className="text-xs text-slate-300">/</span>
            <span className="text-xs text-slate-400">{score.totalPoints}</span>
            <span className={`text-xs font-bold ml-1 ${CONFIDENCE_COLOR[score.confidenceLevel]}`}>
              {CONFIDENCE_LABEL[score.confidenceLevel]}
            </span>
          </div>
        </div>
      </div>

      {/* ── Question card ───────────────────────────────────────────── */}
      <div className="clinical-card mb-4">
        <div className="p-6 sm:p-8">
          {/* Domain + metadata */}
          <div className="flex items-center gap-2 mb-5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">
              {question.domain}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded ${COST_LABEL[question.cost].cls}`}>
              {COST_LABEL[question.cost].text}
            </span>
            <span className="text-[10px] text-slate-400 font-mono ml-auto">
              {question.points} {question.points === 1 ? 'point' : 'points'}
            </span>
          </div>

          {/* Question text */}
          <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed mb-6">
            {question.question}
          </p>

          {/* Confirming answer — shown when YES */}
          {answer === true && question.confirmingAnswer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Clinical Context</p>
              <p className="text-sm text-blue-800 leading-relaxed">{question.confirmingAnswer}</p>
            </div>
          )}

          {/* Answer buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onAnswer(question.key, answer === true ? null : true)}
              className={`py-3.5 px-6 rounded-lg font-semibold text-sm transition-all ${
                answer === true
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-700'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => onAnswer(question.key, answer === false ? null : false)}
              className={`py-3.5 px-6 rounded-lg font-semibold text-sm transition-all ${
                answer === false
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-400'
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        {/* Back */}
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-2">
          {/* Skip */}
          {answer === null || answer === undefined ? (
            <button
              onClick={onNext}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Skip
            </button>
          ) : null}

          {/* Next / Complete */}
          <button
            onClick={onNext}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm ${
              answer !== null && answer !== undefined
                ? 'bg-blue-700 text-white hover:bg-blue-800'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            {isLast ? 'View Results' : 'Next Question'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
