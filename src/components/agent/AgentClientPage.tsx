'use client'

import { useState } from 'react'
import type { Agent, AtlasCondition } from '@/lib/types'
import QuestionnaireFlow from './QuestionnaireFlow'
import ChecklistFlow from './ChecklistFlow'

interface Props {
  condition: AtlasCondition
  diagnosisAgent: Agent | null
  progressionAgent: Agent | null
}

type Tab = 'diagnosis' | 'progression'

const AGENT_TYPE_LABEL: Record<Tab, string> = {
  diagnosis:   'Diagnosis',
  progression: 'Progression Risk',
}

export default function AgentClientPage({ condition, diagnosisAgent, progressionAgent }: Props) {
  const hasBoth = diagnosisAgent !== null && progressionAgent !== null
  const defaultTab: Tab = diagnosisAgent ? 'diagnosis' : 'progression'
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab)

  const activeAgent = activeTab === 'diagnosis' ? diagnosisAgent : progressionAgent

  return (
    <div>
      {/* Tab bar (only shown if both types exist) */}
      {hasBoth && (
        <div className="flex gap-1 mb-8 bg-slate-100 p-1 rounded-lg w-fit">
          {(['diagnosis', 'progression'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {AGENT_TYPE_LABEL[tab]}
            </button>
          ))}
        </div>
      )}

      {!hasBoth && activeAgent && (
        <div className="mb-6">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            {activeAgent.type === 'checklist' ? 'Diagnostic Checklist' : `${AGENT_TYPE_LABEL[activeTab]} Agent`}
          </span>
        </div>
      )}

      {activeAgent === null && (
        <div className="text-center py-16 text-slate-400">
          <p>No {activeTab} agent available for this condition.</p>
        </div>
      )}

      {activeAgent?.type === 'scored' && <QuestionnaireFlow agent={activeAgent} />}
      {activeAgent?.type === 'checklist' && <ChecklistFlow agent={activeAgent} />}
    </div>
  )
}
