'use client'

import type { AgentQuestion } from '@/lib/types'

const COST_COLORS = {
  Small:  'text-slate-400',
  Medium: 'text-amber-600',
  Large:  'text-rose-600',
}

interface Props {
  question: AgentQuestion
  questionKey: string
  answer: boolean | null | undefined
  onAnswer: (key: string, value: boolean | null) => void
}

export default function QuestionCard({ question, questionKey, answer, onAnswer }: Props) {
  return (
    <div className={`p-4 rounded-lg border transition-colors ${
      answer === true  ? 'border-blue-200 bg-blue-50' :
      answer === false ? 'border-slate-200 bg-slate-50' :
                         'border-slate-200 bg-white'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm text-slate-800 leading-relaxed">{question.question}</p>
          {answer === true && question.confirmingAnswer && (
            <p className="text-xs text-blue-700 mt-1.5 italic">{question.confirmingAnswer}</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0 mt-0.5">
          <span className={`text-xs font-mono ${COST_COLORS[question.cost]}`}>{question.cost}</span>
          <span className="text-xs text-slate-300 ml-1">{question.points}pt</span>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onAnswer(questionKey, answer === true ? null : true)}
          className={`flex-1 py-1.5 px-3 rounded text-sm font-medium transition-colors ${
            answer === true
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-slate-300 text-slate-600 hover:bg-blue-50 hover:border-blue-300'
          }`}
        >
          Yes
        </button>
        <button
          onClick={() => onAnswer(questionKey, answer === false ? null : false)}
          className={`flex-1 py-1.5 px-3 rounded text-sm font-medium transition-colors ${
            answer === false
              ? 'bg-slate-600 text-white'
              : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
          }`}
        >
          No
        </button>
      </div>
    </div>
  )
}
