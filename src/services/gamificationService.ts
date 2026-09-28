import type { GamificationState, PointAction } from '@/types'
import { createId } from '@/lib/id'
import { getLevel, POINTS } from '@/utils/gamification'
import { createDocumentService } from './collection'
import { COLLECTIONS } from './collections'

const store = createDocumentService<GamificationState>(COLLECTIONS.gamification, () => ({ points: 0, history: [], awardedKeys: [] }))

export interface AwardResult {
  state: GamificationState
  awarded: number
  leveledUp: boolean
}

export const gamificationService = {
  get: store.get,

  /**
   * Concede pontos por uma ação. A `key` identifica a ação (ex.: `task:<id>`)
   * para que desmarcar e marcar de novo não gere pontos duplicados.
   */
  async award(action: PointAction, key: string, label: string): Promise<AwardResult> {
    let previous = 0
    let awarded = 0
    const state = await store.update((current) => {
      previous = current.points
      if (current.awardedKeys.includes(key)) return current
      awarded = POINTS[action]
      return {
        points: current.points + awarded,
        awardedKeys: [...current.awardedKeys, key].slice(-2000),
        history: [{ id: createId(), action, points: awarded, label, createdAt: new Date().toISOString() }, ...current.history].slice(0, 100),
      }
    })
    return { state, awarded, leveledUp: getLevel(state.points).level > getLevel(previous).level }
  },
}
