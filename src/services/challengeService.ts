import type { Challenge } from '@/types'
import { createChallenge } from '@/data/mockChallenge'
import { createDocumentService } from './collection'
import { COLLECTIONS } from './collections'
import { ServiceError } from './errors'

const store = createDocumentService<Challenge>(COLLECTIONS.challenge, () => createChallenge())

export const challengeService = {
  get: store.get,

  toggleItem(day: number, itemId: string): Promise<Challenge> {
    return store.update((challenge) => {
      const target = challenge.days.find((d) => d.day === day)
      if (!target) throw new ServiceError('not_found', 'Dia do desafio não encontrado.')
      if (target.completedAt) return challenge
      return {
        ...challenge,
        days: challenge.days.map((d) =>
          d.day === day ? { ...d, items: d.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) } : d,
        ),
      }
    })
  },

  completeDay(day: number): Promise<Challenge> {
    return store.update((challenge) => {
      const target = challenge.days.find((d) => d.day === day)
      if (!target) throw new ServiceError('not_found', 'Dia do desafio não encontrado.')
      if (!target.items.every((i) => i.done)) {
        throw new ServiceError('validation', 'Conclua todos os itens do dia antes de finalizar.')
      }
      const now = new Date().toISOString()
      const days = challenge.days.map((d) => (d.day === day ? { ...d, completedAt: d.completedAt ?? now } : d))
      const completedAt = days.every((d) => d.completedAt) ? (challenge.completedAt ?? now) : undefined
      return { ...challenge, days, completedAt }
    })
  },

  reset(): Promise<Challenge> {
    return store.save(createChallenge())
  },
}
