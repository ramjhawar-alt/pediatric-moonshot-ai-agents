'use client'

import type { AgentSection, AgentQuestion } from '@/lib/types'
import QuestionCard from './QuestionCard'

interface Props {
  section: AgentSection
  sectionIndex: number
  completedTests: Set<string>
  answers: Record<string, boolean | null>
  onAnswer: (key: string, value: boolean | null) => void
}

function isEligible(q: AgentQuestion, completedTests: Set<string>): boolean {
  if (q.cost === 'Small') return true
  return completedTests.has(`${q.domain}__${q.cost}`)
}

export default function DomainSection({ section, sectionIndex, completedTests, answers, onAnswer }: Props) {
  const eligibleQuestions = section.questions.filter(q => isEligible(q, completedTests))
  if (eligibleQuestions.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{section.heading}</h3>
      </div>
      <div className="space-y-3">
        {section.questions.map((q, qi) => {
          if (!isEligible(q, completedTests)) return null
          const key = `${sectionIndex}-${qi}`
          return (
            <QuestionCard
              key={key}
              question={q}
              questionKey={key}
              answer={answers[key] ?? null}
              onAnswer={onAnswer}
            />
          )
        })}
      </div>
    </div>
  )
}
