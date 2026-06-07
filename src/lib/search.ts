import Fuse from 'fuse.js'
import type { AtlasCondition } from './types'
import { getAllConditionsFlat } from './atlas-utils'

let fuseInstance: Fuse<AtlasCondition> | null = null

function getFuse(): Fuse<AtlasCondition> {
  if (!fuseInstance) {
    const data = getAllConditionsFlat()
    fuseInstance = new Fuse(data, {
      keys: [
        { name: 'name',        weight: 2 },
        { name: 'category',    weight: 1 },
        { name: 'description', weight: 0.5 },
      ],
      threshold:       0.35,
      includeScore:    true,
      ignoreLocation:  true,
      minMatchCharLength: 2,
    })
  }
  return fuseInstance
}

export function searchConditions(query: string, limit = 12): AtlasCondition[] {
  if (!query.trim()) return []
  return getFuse()
    .search(query, { limit })
    .map(r => r.item)
}
