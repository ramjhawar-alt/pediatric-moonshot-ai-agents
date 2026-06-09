import type { HeredityTier } from '@/lib/types'

const TIERS: Record<HeredityTier, { label: string; cls: string } | null> = {
  strong:     { label: 'Strong Hereditary',     cls: 'bg-purple-100 text-purple-800 border-purple-200' },
  dominant:   { label: 'Dominant Hereditary',   cls: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  associated: { label: 'Associated Hereditary', cls: 'bg-blue-100  text-blue-800  border-blue-200'    },
  none:       null,
}

export default function HeredityBadge({
  tier,
  size = 'sm',
}: {
  tier: HeredityTier
  size?: 'sm' | 'md'
}) {
  const def = TIERS[tier]
  if (!def) return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border font-medium ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } ${def.cls}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
      {def.label}
    </span>
  )
}
