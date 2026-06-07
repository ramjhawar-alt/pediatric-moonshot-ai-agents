import type { HeredityTier } from '@/lib/types'

const TIERS: Record<HeredityTier, { emoji: string; label: string; cls: string } | null> = {
  strong:     { emoji: '🧬🧬🧬', label: 'Strong Hereditary',     cls: 'bg-purple-100 text-purple-800 border border-purple-200' },
  dominant:   { emoji: '🧬🧬',   label: 'Dominant Hereditary',   cls: 'bg-indigo-100 text-indigo-800 border border-indigo-200' },
  associated: { emoji: '🧬',    label: 'Associated Hereditary',  cls: 'bg-blue-100  text-blue-800  border border-blue-200'   },
  none:       null,
}

export default function HeredityBadge({ tier, size = 'sm' }: { tier: HeredityTier; size?: 'sm' | 'md' }) {
  const def = TIERS[tier]
  if (!def) return null
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ${size === 'sm' ? 'text-xs' : 'text-sm'} ${def.cls}`}>
      <span>{def.emoji}</span>
      {size === 'md' && <span>{def.label}</span>}
    </span>
  )
}
