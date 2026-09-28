import type { Goal } from '@/types'
import { roundMoney } from '@/utils/format'
import { todayISO } from '@/utils/date'
import { createCollectionService, readCollection } from './collection'
import { COLLECTIONS } from './collections'
import { ServiceError } from './errors'

const base = createCollectionService<Goal>(COLLECTIONS.goals)

export const goalsService = {
  ...base,
  /** Adiciona (ou retira, com valor negativo) um aporte à meta. */
  async contribute(id: string, amount: number) {
    const goal = readCollection<Goal>(COLLECTIONS.goals).find((g) => g.id === id)
    if (!goal) throw new ServiceError('not_found', 'Meta não encontrada.')
    const currentAmount = Math.max(0, roundMoney(goal.currentAmount + amount))
    const completedAt = currentAmount >= goal.targetAmount ? (goal.completedAt ?? todayISO()) : undefined
    return base.update(id, { currentAmount, completedAt })
  },
}
