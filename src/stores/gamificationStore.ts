import { create } from 'zustand'
import type { AsyncStatus, GamificationState, PointAction } from '@/types'
import { gamificationService } from '@/services/gamificationService'
import { getErrorMessage } from '@/services/errors'
import { getLevel } from '@/utils/gamification'
import { useNotificationStore } from './notificationStore'
import { registerReset } from './registry'
import { toast } from './toastStore'

interface GamificationStoreState {
  data: GamificationState
  status: AsyncStatus
  error: string | null
  load: (force?: boolean) => Promise<void>
  award: (action: PointAction, key: string, label: string) => Promise<number>
  reset: () => void
}

const empty: GamificationState = { points: 0, history: [], awardedKeys: [] }
const initial = { data: empty, status: 'idle' as AsyncStatus, error: null as string | null }

export const useGamificationStore = create<GamificationStoreState>()((set, get) => ({
  ...initial,

  async load(force = false) {
    const { status } = get()
    if (!force && (status === 'loading' || status === 'success')) return
    set({ status: 'loading', error: null })
    try {
      set({ data: await gamificationService.get(), status: 'success' })
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) })
    }
  },

  async award(action, key, label) {
    try {
      const result = await gamificationService.award(action, key, label)
      if (result.awarded > 0) {
        set({ data: result.state, status: 'success' })
        toast.reward(`+${result.awarded} pontos`, label)
      }
      if (result.leveledUp) {
        const level = getLevel(result.state.points)
        toast.reward(`Nível ${level.level} desbloqueado!`, `Você agora é "${level.name}".`)
        void useNotificationStore.getState().push({
          kind: 'achievement',
          title: 'Novo nível',
          message: `Você alcançou o nível ${level.level} — ${level.name}. Continue assim!`,
          href: '/app/perfil',
        })
      }
      return result.awarded
    } catch {
      return 0
    }
  },

  reset() {
    set(initial)
  },
}))

registerReset(() => useGamificationStore.getState().reset())
