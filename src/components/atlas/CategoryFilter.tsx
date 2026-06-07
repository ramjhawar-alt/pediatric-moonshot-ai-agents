'use client'

interface Props {
  categories: string[]
  selected: string | null
  onSelect: (cat: string | null) => void
  agentCount: number
  showAgentOnly: boolean
  onAgentToggle: () => void
}

export default function CategoryFilter({ categories, selected, onSelect, agentCount, showAgentOnly, onAgentToggle }: Props) {
  return (
    <aside className="w-56 shrink-0">
      <div className="sticky top-20 space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 px-2">Categories</p>
        <button
          onClick={() => onSelect(null)}
          className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
            selected === null ? 'bg-blue-100 text-blue-800 font-medium' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All conditions
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelect(cat === selected ? null : cat)}
            className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors leading-snug ${
              selected === cat ? 'bg-blue-100 text-blue-800 font-medium' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
        {agentCount > 0 && (
          <>
            <hr className="my-3 border-slate-200" />
            <button
              onClick={onAgentToggle}
              className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-2 ${
                showAgentOnly ? 'bg-emerald-100 text-emerald-800 font-medium' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              Has AI Agent ({agentCount})
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
