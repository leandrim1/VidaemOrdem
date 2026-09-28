import { create } from 'zustand'
import type { AsyncStatus, Challenge } from '@/types'
import { challengeService } from '@/services/challengeService'
import { getErrorMessage } from '@/services/errors'
import { registerReset } from './registry'

interface ChallengeState {
  challenge: Challenge | null
  status: AsyncStatus
  error: string | null
  load: (force?: boolean) => Promise<void>
  toggleItem: (day: number, itemId: string) => Promise<void>
  completeDay: (day: number) => Promise<Challenge>
  restart: () => Promise<void>
  reset: () => void
}

const initial = { challenge: null as Challenge | null, status: 'idle' as AsyncStatus, error: null as string | null }

/* Cliques rápidos geram várias requisições: só aplicamos a resposta do servidor
   quando a última termina, evitando "piscadas" no estado otimista. */
let pendingToggles = 0

export const useChallengeStore = create<ChallengeState>()((set, get) => ({
  ...initial,

  async load(force = false) {
    const { status } = get()
    if (!force && (status === 'loading' || status === 'success')) return
    set({ status: 'loading', error: null })
    try {
      set({ challenge: await challengeService.get(), status: 'success' })
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) })
    }
  },

  async toggleItem(day, itemId) {
    const previous = get().challenge
    if (!previous) return
    set({
      challenge: {
        ...previous,
        days: previous.days.map((d) =>
          d.day === day ? { ...d, items: d.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) } : d,
        ),
      },
    })
    pendingToggles++
    try {
      const result = await challengeService.toggleItem(day, itemId)
      if (pendingToggles === 1) set({ challenge: result })
    } catch (error) {
      set({ challenge: previous })
      throw error
    } finally {
      pendingToggles--
    }
  },

  async completeDay(day) {
    const challenge = await challengeService.completeDay(day)
    set({ challenge })
    return challenge
  },

  async restart() {
    set({ challenge: await challengeService.reset() })
  },

  reset() {
    set(initial)
  },
}))

registerReset(() => useChallengeStore.getState().reset())
