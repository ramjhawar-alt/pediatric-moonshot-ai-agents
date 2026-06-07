import type { ScoredAgent, TestOption, CostTier, AgentQuestion, ScoreResult, PendingTestResult } from './types'

// ── Cost estimates ────────────────────────────────────────────────────────
const COST_ESTIMATE: Record<CostTier, number> = {
  Small:  100,
  Medium: 850,
  Large:  3250,
}

// ── Domain → test label mapping ───────────────────────────────────────────
function testLabel(domain: string, cost: CostTier): string {
  const d = domain.toLowerCase()
  if (cost === 'Medium') {
    if (d.includes('genetic') || d.includes('family hx'))  return 'Genetic Panel Testing'
    if (d.includes('exercise') || d.includes('stress'))    return 'Exercise Stress Testing'
    if (d.includes('biomarker'))                            return 'Advanced Biomarker Panel'
    if (d.includes('symptom'))                             return 'Functional Symptom Assessment'
    if (d.includes('associated') || d.includes('lab'))    return 'Advanced Lab Panel'
    return `${domain} (Medium)`
  }
  if (cost === 'Large') {
    if (d.includes('cardiac mri') || d.includes('cmr'))   return 'Cardiac MRI (CMR)'
    if (d.includes('echo') || d.includes('imaging'))      return 'CT / MRI Angiography'
    if (d.includes('rhc') || d.includes('right heart'))   return 'Right Heart Catheterization'
    if (d.includes('cath'))                               return 'Cardiac Catheterization'
    return `${domain} (Large)`
  }
  return domain
}

// ── Build the list of optional tests from an agent ────────────────────────
export function buildTestOptions(agent: ScoredAgent): TestOption[] {
  const seen = new Set<string>()
  const options: TestOption[] = []

  for (const section of agent.sections) {
    for (const q of section.questions) {
      if (q.cost === 'Small') continue
      const id = `${q.domain}__${q.cost}`
      if (seen.has(id)) continue
      seen.add(id)
      options.push({
        id,
        label: testLabel(q.domain, q.cost),
        domain: q.domain,
        costTier: q.cost,
        isPreChecked: false,
      })
    }
  }

  return options
}

// ── Determine if a question is eligible given completed tests ─────────────
export function isEligible(q: AgentQuestion, completedTests: Set<string>): boolean {
  if (q.cost === 'Small') return true
  return completedTests.has(`${q.domain}__${q.cost}`)
}

// ── Flat list of all questions with a stable index key ────────────────────
export interface IndexedQuestion extends AgentQuestion {
  key: string  // "sectionIdx-questionIdx"
}

export function flattenQuestions(agent: ScoredAgent): IndexedQuestion[] {
  const out: IndexedQuestion[] = []
  agent.sections.forEach((section, si) => {
    section.questions.forEach((q, qi) => {
      out.push({ ...q, key: `${si}-${qi}` })
    })
  })
  return out
}

// ── Compute live score ────────────────────────────────────────────────────
export function computeScore(
  agent: ScoredAgent,
  completedTests: Set<string>,
  answers: Record<string, boolean | null>,
): ScoreResult {
  const questions = flattenQuestions(agent)
  const eligible = questions.filter(q => isEligible(q, completedTests))

  let currentScore = 0
  let unansweredPoints = 0

  for (const q of eligible) {
    const ans = answers[q.key]
    if (ans === true)       currentScore += q.points
    else if (ans === null || ans === undefined) unansweredPoints += q.points
  }

  const maxAchievable = currentScore + unansweredPoints
  const totalPoints   = agent.totalPoints

  // Normalize to percentage for non-100-point agents, then compare thresholds
  const pct = (currentScore / totalPoints) * 100
  const thresholds = agent.confidenceThresholds
  let confidenceLevel: 'high' | 'moderate' | 'low' = 'low'
  if (pct >= thresholds.high.min)     confidenceLevel = 'high'
  else if (pct >= thresholds.moderate.min) confidenceLevel = 'moderate'

  // ── Pending tests ranked by points-per-dollar ─────────────────────────
  const pendingMap = new Map<string, { label: string; cost: CostTier; pts: number }>()

  for (const q of questions) {
    if (isEligible(q, completedTests)) continue   // already unlocked
    const id = `${q.domain}__${q.cost}`
    const existing = pendingMap.get(id)
    if (existing) {
      existing.pts += q.points
    } else {
      pendingMap.set(id, {
        label: testLabel(q.domain, q.cost),
        cost:  q.cost,
        pts:   q.points,
      })
    }
  }

  const pendingTests: PendingTestResult[] = Array.from(pendingMap.entries())
    .map(([id, { label, cost, pts }]) => ({
      testId:         id,
      testLabel:      label,
      costTier:       cost,
      estimatedCost:  COST_ESTIMATE[cost],
      potentialPoints: pts,
      pointsPerDollar: pts / COST_ESTIMATE[cost],
    }))
    .sort((a, b) => b.pointsPerDollar - a.pointsPerDollar)

  return { currentScore, maxAchievable, totalPoints, confidenceLevel, pendingTests }
}
