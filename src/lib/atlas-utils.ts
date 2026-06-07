import type { AtlasCondition, Specialty, Agent } from './types'

// Static imports — bundled at build time
import cancerRaw     from '@/data/atlas/cancer.json'
import cardiologyRaw from '@/data/atlas/cardiology.json'
import nephrologyRaw from '@/data/atlas/nephrology.json'
import neurologyRaw  from '@/data/atlas/neurology.json'

const ATLAS_DATA: Record<Specialty, AtlasCondition[]> = {
  cancer:     cancerRaw     as AtlasCondition[],
  cardiology: cardiologyRaw as AtlasCondition[],
  nephrology: nephrologyRaw as AtlasCondition[],
  neurology:  neurologyRaw  as AtlasCondition[],
}

export function getAllConditions(specialty: Specialty): AtlasCondition[] {
  return ATLAS_DATA[specialty] ?? []
}

export function getCondition(specialty: Specialty, slug: string): AtlasCondition | undefined {
  return ATLAS_DATA[specialty]?.find(c => c.slug === slug)
}

export function getAllConditionsFlat(): AtlasCondition[] {
  return (Object.values(ATLAS_DATA) as AtlasCondition[][]).flat()
}

// Nephrology uses the "kidney" agent directory
const AGENT_DIR: Partial<Record<Specialty, string>> = {
  cardiology: 'cardiology',
  nephrology: 'kidney',
  neurology:  'neurology',
}

export async function loadAgent(
  specialty: Specialty,
  agentSlug: string,
  agentType: 'diagnosis' | 'progression',
): Promise<Agent | null> {
  const dir = AGENT_DIR[specialty]
  if (!dir) return null
  try {
    const mod = await import(`@/data/agents/${dir}/${agentSlug}-${agentType}.json`)
    return mod.default as Agent
  } catch {
    return null
  }
}

export const SPECIALTY_LABELS: Record<Specialty, string> = {
  cancer:     'Cancer',
  cardiology: 'Cardiology',
  nephrology: 'Nephrology',
  neurology:  'Neurology',
}

export const SPECIALTY_COLORS: Record<Specialty, { bg: string; text: string; border: string; badge: string }> = {
  cancer:     { bg: 'bg-rose-50',   text: 'text-rose-900',   border: 'border-rose-200',   badge: 'bg-rose-100 text-rose-800'   },
  cardiology: { bg: 'bg-blue-50',   text: 'text-blue-900',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-800'   },
  nephrology: { bg: 'bg-amber-50',  text: 'text-amber-900',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-800' },
  neurology:  { bg: 'bg-violet-50', text: 'text-violet-900', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-800'},
}

export const CONDITION_COUNTS: Record<Specialty, number> = {
  cancer:     104,
  cardiology: 104,
  nephrology: 176,
  neurology:  233,
}
