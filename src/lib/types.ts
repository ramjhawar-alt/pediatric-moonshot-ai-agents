export type Specialty = 'cancer' | 'cardiology' | 'nephrology' | 'neurology'
export type HeredityTier = 'strong' | 'dominant' | 'associated' | 'none'
export type CostTier = 'Small' | 'Medium' | 'Large'
export type AgentType = 'diagnosis' | 'progression'

export interface AtlasCondition {
  id: number
  slug: string
  specialty: Specialty
  category: string
  name: string
  heredityTier: HeredityTier
  description: string
  frequency: { us: string; global: string; sources?: string }
  diagnosis: string
  treatment: { standardOfCare: string; emerging: string }
  hasAgent: boolean
  agentSlug?: string | null
}

export interface AgentQuestion {
  domain: string
  question: string
  confirmingAnswer: string
  points: number
  cost: CostTier
}

export interface AgentSection {
  heading: string
  sectionPoints: number
  questions: AgentQuestion[]
}

export interface ConfidenceThreshold {
  min: number
  max: number
  label: string
  action: string
}

export interface ScoredAgent {
  type: 'scored'
  conditionId: number
  conditionName: string
  specialty: Specialty
  agentType: AgentType
  totalPoints: number
  preamble: string
  sections: AgentSection[]
  confidenceThresholds: {
    high: ConfidenceThreshold
    moderate: ConfidenceThreshold
    low: ConfidenceThreshold
  }
  guidelinesCitation?: string
}

// In the checklist format (Neurology), `domain` holds the question text
// and `question` holds the confirming-answer/clinical context.
export interface ChecklistQuestion {
  domain: string
  question: string
}

export interface ChecklistSection {
  heading: string
  questions: ChecklistQuestion[]
}

export interface ChecklistAgent {
  type: 'checklist'
  conditionId: number
  conditionName: string
  specialty: 'neurology'
  agentType: AgentType
  preamble: string
  confidenceNote: string
  sections: ChecklistSection[]
}

export type Agent = ScoredAgent | ChecklistAgent

// ── Scoring runtime types ────────────────────────────────────────────────

export interface TestOption {
  id: string          // e.g. "Genetics-Medium"
  label: string       // e.g. "Genetic Panel Testing"
  domain: string
  costTier: CostTier
  isPreChecked: boolean
}

export interface ScoringState {
  completedTests: Set<string>
  answers: Record<string, boolean | null>  // questionIndex → true/false/null
}

export interface ScoreResult {
  currentScore: number
  maxAchievable: number
  totalPoints: number
  confidenceLevel: 'high' | 'moderate' | 'low'
  pendingTests: PendingTestResult[]
}

export interface PendingTestResult {
  testId: string
  testLabel: string
  costTier: CostTier
  estimatedCost: number
  potentialPoints: number
  pointsPerDollar: number
}
