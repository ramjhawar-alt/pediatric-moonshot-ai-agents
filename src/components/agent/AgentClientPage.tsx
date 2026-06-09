'use client'

import { useState } from 'react'
import { Cpu, Activity } from 'lucide-react'
import type { Agent, AtlasCondition } from '@/lib/types'
import QuestionnaireFlow from './QuestionnaireFlow'
import ChecklistFlow from './ChecklistFlow'

interface Props {
  condition: AtlasCondition
  diagnosisAgent: Agent | null
  progressionAgent: Agent | null
}

type Tab = 'diagnosis' | 'progression'

const TAB_META: Record<Tab, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  diagnosis:   { label: 'Diagnosis',       icon: Cpu      },
  progression: { label: 'Progression Risk', icon: Activity },
}

export default function AgentClientPage({ condition, diagnosisAgent, progressionAgent }: Props) {
  const hasBoth   = diagnosisAgent !== null && progressionAgent !== null
  const defaultTab: Tab = diagnosisAgent ? 'diagnosis' : 'progression'
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab)

  const activeAgent = activeTab === 'diagnosis' ? diagnosisAgent : progressionAgent

  return (
    <div>
      {/* Tab bar */}
      {hasBoth && (
        <div className="flex gap-1 mb-8 bg-slate-100 border border-slate-200 p-1 rounded-xl w-fit">
          {(['diagnosis', 'progression'] as Tab[]).map(tab => {
            const { label, icon: Icon } = TAB_META[tab]
            const active = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  active
                    ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Single agent type label */}
      {!hasBoth && activeAgent && (
        <div className="mb-6 flex items-center gap-2">
          {activeAgent.type === 'checklist' ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200 uppercase tracking-wider px-3 py-1.5 rounded-lg">
              <Cpu className="w-3.5 h-3.5" />
              Diagnostic Checklist
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 uppercase tracking-wider px-3 py-1.5 rounded-lg">
              <Cpu className="w-3.5 h-3.5" />
              {TAB_META[activeTab].label} Agent
            </span>
          )}
        </div>
      )}

      {activeAgent === null && (
        <div className="text-center py-16 text-slate-400 text-sm">
          No {activeTab} agent available.
        </div>
      )}

      {activeAgent?.type === 'scored'    && <QuestionnaireFlow agent={activeAgent} />}
      {activeAgent?.type === 'checklist' && <ChecklistFlow agent={activeAgent} />}
    </div>
  )
}
