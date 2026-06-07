'use client'

import { useState, useMemo } from 'react'
import type { ScoredAgent } from '@/lib/types'
import { buildTestOptions, flattenQuestions, isEligible, computeScore } from '@/lib/scoring'
import TestSelectionStep from './TestSelectionStep'
import DomainSection from './DomainSection'
import LiveScoreWidget from './LiveScoreWidget'
import ResultsPanel from './ResultsPanel'

interface Props {
  agent: ScoredAgent
}

export default function QuestionnaireFlow({ agent }: Props) {
  const testOptions = useMemo(() => buildTestOptions(agent), [agent])

  const [step, setStep]                     = useState<1 | 2 | 3>(1)
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set())
  const [answers, setAnswers]               = useState<Record<string, boolean | null>>({})

  function toggleTest(id: string) {
    setCompletedTests(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function setAnswer(key: string, value: boolean | null) {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  function restart() {
    setStep(1)
    setCompletedTests(new Set())
    setAnswers({})
  }

  const allQuestions = useMemo(() => flattenQuestions(agent), [agent])
  const eligibleQuestions = useMemo(
    () => allQuestions.filter(q => isEligible(q, completedTests)),
    [allQuestions, completedTests],
  )
  const answeredCount = useMemo(
    () => eligibleQuestions.filter(q => answers[q.key] !== null && answers[q.key] !== undefined).length,
    [eligibleQuestions, answers],
  )
  const score = useMemo(
    () => computeScore(agent, completedTests, answers),
    [agent, completedTests, answers],
  )

  // Step indicator
  const steps = ['Test Selection', 'Questions', 'Results']

  return (
    <div>
      {/* Step progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((label, i) => {
          const n = i + 1
          const active = step === n
          const done   = step > n
          return (
            <div key={n} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                done   ? 'bg-blue-600 text-white' :
                active ? 'bg-blue-700 text-white ring-2 ring-blue-300' :
                         'bg-slate-200 text-slate-500'
              }`}>
                {done ? '✓' : n}
              </div>
              <span className={`text-sm hidden sm:inline ${active ? 'font-semibold text-slate-800' : 'text-slate-400'}`}>
                {label}
              </span>
              {i < steps.length - 1 && <span className="text-slate-200 ml-2">—</span>}
            </div>
          )
        })}
      </div>

      {step === 1 && (
        <TestSelectionStep
          agent={agent}
          testOptions={testOptions}
          completedTests={completedTests}
          onToggle={toggleTest}
          onBegin={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <div className="flex gap-8 items-start">
          {/* Questions */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Assessment Questions</h2>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors"
              >
                View Results →
              </button>
            </div>
            {agent.sections.map((section, si) => (
              <DomainSection
                key={si}
                section={section}
                sectionIndex={si}
                completedTests={completedTests}
                answers={answers}
                onAnswer={setAnswer}
              />
            ))}
            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Change Tests
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors"
              >
                View Results →
              </button>
            </div>
          </div>

          {/* Sticky score widget */}
          <div className="w-64 shrink-0 sticky top-20">
            <LiveScoreWidget
              score={score}
              agent={agent}
              answeredCount={answeredCount}
              totalEligible={eligibleQuestions.length}
            />
            <button
              onClick={() => setStep(3)}
              className="mt-3 w-full py-2 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors"
            >
              View Results →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <ResultsPanel agent={agent} score={score} onRestart={restart} />
      )}
    </div>
  )
}
