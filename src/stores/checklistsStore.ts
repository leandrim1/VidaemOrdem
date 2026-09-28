import { create } from 'zustand'
import type { AsyncStatus, Checklist, DigitalItem } from '@/types'
import { checklistsService, digitalService } from '@/services/checklistsService'
import { getErrorMessage } from '@/services/errors'
import { registerReset } from './registry'

interface ChecklistsState {
  checklists: Checklist[]
  status: AsyncStatus
  error: string | null
  load: (force?: boolean) => Promise<void>
  toggleItem: (checklistId: string, itemId: string) => Promise<Checklist>
  addItem: (checklistId: string, label: string) => Promise<Checklist>
  removeItem: (checklistId: string, itemId: string) => Promise<Checklist>
  resetChecklist: (checklistId: string) => Promise<Checklist>
  reset: () => void
}

/* Só aplica a resposta do servidor após a última alteração pendente (sem "piscadas"). */
let pendingChecklist = 0
let pendingDigital = 0

const initialChecklists = { checklists: [] as Checklist[], status: 'idle' as AsyncStatus, error: null as string | null }

export const useChecklistsStore = create<ChecklistsState>()((set, get) => {
  const apply = (updated: Checklist) => {
    set((state) => ({ checklists: state.checklists.map((c) => (c.id === updated.id ? updated : c)) }))
    return updated
  }

  return {
    ...initialChecklists,

    async load(force = false) {
      const { status } = get()
      if (!force && (status === 'loading' || status === 'success')) return
      set({ status: 'loading', error: null })
      try {
        set({ checklists: await checklistsService.list(), status: 'success' })
      } catch (error) {
        set({ status: 'error', error: getErrorMessage(error) })
      }
    },

    async toggleItem(checklistId, itemId) {
      const previous = get().checklists
      set({
        checklists: previous.map((c) =>
          c.id === checklistId ? { ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) } : c,
        ),
      })
      pendingChecklist++
      try {
        const updated = await checklistsService.toggleItem(checklistId, itemId)
        return pendingChecklist === 1 ? apply(updated) : updated
      } catch (error) {
        set({ checklists: previous })
        throw error
      } finally {
        pendingChecklist--
      }
    },

    async addItem(checklistId, label) {
      return apply(await checklistsService.addItem(checklistId, label))
    },

    async removeItem(checklistId, itemId) {
      return apply(await checklistsService.removeItem(checklistId, itemId))
    },

    async resetChecklist(checklistId) {
      return apply(await checklistsService.reset(checklistId))
    },

    reset() {
      set(initialChecklists)
    },
  }
})

interface DigitalState {
  items: DigitalItem[]
  status: AsyncStatus
  error: string | null
  load: (force?: boolean) => Promise<void>
  toggle: (id: string) => Promise<void>
  resetProgress: () => Promise<void>
  reset: () => void
}

const initialDigital = { items: [] as DigitalItem[], status: 'idle' as AsyncStatus, error: null as string | null }

export const useDigitalStore = create<DigitalState>()((set, get) => ({
  ...initialDigital,

  async load(force = false) {
    const { status } = get()
    if (!force && (status === 'loading' || status === 'success')) return
    set({ status: 'loading', error: null })
    try {
      set({ items: await digitalService.list(), status: 'success' })
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) })
    }
  },

  async toggle(id) {
    const previous = get().items
    set({ items: previous.map((i) => (i.id === id ? { ...i, done: !i.done } : i)) })
    pendingDigital++
    try {
      const items = await digitalService.toggle(id)
      if (pendingDigital === 1) set({ items })
    } catch (error) {
      set({ items: previous })
      throw error
    } finally {
      pendingDigital--
    }
  },

  async resetProgress() {
    set({ items: await digitalService.reset() })
  },

  reset() {
    set(initialDigital)
  },
}))

registerReset(() => {
  useChecklistsStore.getState().reset()
  useDigitalStore.getState().reset()
})
