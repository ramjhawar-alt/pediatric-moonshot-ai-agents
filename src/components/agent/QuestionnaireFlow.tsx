'use client'

import { useState, useMemo } from 'react'
import type { ScoredAgent } from '@/lib/types'
import { buildTestOptions, flattenQuestions, isEligible, computeScore } from '@/lib/scoring'
import TestSelectionStep from './TestSelectionStep'
import SingleQuestionView from './SingleQuestionView'
import ResultsPanel from './ResultsPanel'

interface Props {
  agent: ScoredAgent
}

export default function QuestionnaireFlow({ agent }: Props) {
  const testOptions = useMemo(() => buildTestOptions(agent), [agent])

  const [step, setStep]                     = useState<1 | 2 | 3>(1)
  const [completedTests, setCompletedTests] = useState<Set<string>>(new Set())
  const [answers, setAnswers]               = useState<Record<string, boolean | null>>({})
  const [currentIdx, setCurrentIdx]         = useState(0)

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
    setCurrentIdx(0)
  }

  function beginAssessment() {
    setCurrentIdx(0)
    setStep(2)
  }

  const eligibleQuestions = useMemo(
    () => flattenQuestions(agent).filter(q => isEligible(q, completedTests)),
    [agent, completedTests],
  )

  const score = useMemo(
    () => computeScore(agent, completedTests, answers),
    [agent, completedTests, answers],
  )

  // Navigation
  function goNext() {
    if (currentIdx >= eligibleQuestions.length - 1) {
      setStep(3)
    } else {
      setCurrentIdx(i => i + 1)
    }
  }

  function goPrev() {
    if (currentIdx > 0) setCurrentIdx(i => i - 1)
  }

  // Step indicator
  const STEPS = [
    { n: 1, label: 'Test Selection' },
    { n: 2, label: 'Questions' },
    { n: 3, label: 'Results' },
  ]

  return (
    <div>
      {/* Step progress */}
      <div className="flex items-center gap-3 mb-8">
        {STEPS.map(({ n, label }, i) => {
          const active = step === n
          const done   = step > n
          return (
            <div key={n} className="flex items-center gap-2">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                done   ? 'bg-blue-600 text-white' :
                active ? 'bg-blue-700 text-white ring-2 ring-blue-200' :
                         'bg-slate-100 text-slate-400'
              }`}>
                {done ? '✓' : n}
              </div>
              <span className={`text-sm hidden sm:inline transition-colors ${
                active ? 'font-semibold text-slate-800' : 'text-slate-400'
              }`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <span className="text-slate-200 text-xs ml-1">—</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1: Test selection */}
      {step === 1 && (
        <TestSelectionStep
          agent={agent}
          testOptions={testOptions}
          completedTests={completedTests}
          onToggle={toggleTest}
          onBegin={beginAssessment}
        />
      )}

      {/* Step 2: Questions — one at a time */}
      {step === 2 && eligibleQuestions.length > 0 && (
        <SingleQuestionView
          question={eligibleQuestions[currentIdx]}
          questionNumber={currentIdx + 1}
          totalQuestions={eligibleQuestions.length}
          sectionName={
            // Find which section heading this question belongs to
            agent.sections.find(s =>
              s.questions.some((_, qi) => {
                const si = agent.sections.indexOf(s)
                return `${si}-${qi}` === eligibleQuestions[currentIdx].key
              })
            )?.heading ?? 'Assessment'
          }
          answer={answers[eligibleQuestions[currentIdx].key] ?? null}
          onAnswer={setAnswer}
          onPrevious={goPrev}
          onNext={goNext}
          isFirst={currentIdx === 0}
          isLast={currentIdx === eligibleQuestions.length - 1}
          score={score}
        />
      )}

      {/* Fallback: no eligible questions */}
      {step === 2 && eligibleQuestions.length === 0 && (
        <div className="text-center py-16 text-slate-400 text-sm">
          <p>No questions available for the selected tests.</p>
          <button onClick={() => setStep(1)} className="mt-4 text-blue-600 hover:text-blue-800 underline text-sm">
            Go back to test selection
          </button>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <ResultsPanel agent={agent} score={score} onRestart={restart} />
      )}
    </div>
  )
}
