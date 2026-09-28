import { create } from 'zustand'
import type { AsyncStatus, Entity, EntityInput } from '@/types'
import type { CollectionService } from '@/services/collection'
import { getErrorMessage } from '@/services/errors'
import { registerReset } from './registry'

export interface CollectionState<T extends Entity> {
  items: T[]
  status: AsyncStatus
  error: string | null
  load: (force?: boolean) => Promise<void>
  create: (input: EntityInput<T>) => Promise<T>
  update: (id: string, patch: Partial<EntityInput<T>>) => Promise<T>
  remove: (id: string) => Promise<void>
  /** Substitui um item vindo de uma operação específica do serviço (ex.: `toggle`). */
  replace: (item: T) => void
  reset: () => void
}

/**
 * Fábrica de stores para coleções CRUD: cache em memória compartilhado entre
 * páginas, atualizações otimistas com rollback em caso de erro.
 */
export function createCollectionStore<T extends Entity>(service: CollectionService<T>) {
  const initial = { items: [] as T[], status: 'idle' as AsyncStatus, error: null as string | null }

  const useStore = create<CollectionState<T>>()((set, get) => ({
    ...initial,

    async load(force = false) {
      const { status } = get()
      if (!force && (status === 'loading' || status === 'success')) return
      set({ status: 'loading', error: null })
      try {
        const items = await service.list()
        set({ items, status: 'success' })
      } catch (error) {
        set({ status: 'error', error: getErrorMessage(error) })
      }
    },

    async create(input) {
      const item = await service.create(input)
      set((state) => ({ items: [item, ...state.items] }))
      return item
    },

    async update(id, patch) {
      const previous = get().items
      set((state) => ({ items: state.items.map((item) => (item.id === id ? { ...item, ...patch } : item)) }))
      try {
        const updated = await service.update(id, patch)
        set((state) => ({ items: state.items.map((item) => (item.id === id ? updated : item)) }))
        return updated
      } catch (error) {
        set({ items: previous })
        throw error
      }
    },

    async remove(id) {
      const previous = get().items
      set((state) => ({ items: state.items.filter((item) => item.id !== id) }))
      try {
        await service.remove(id)
      } catch (error) {
        set({ items: previous })
        throw error
      }
    },

    replace(item) {
      set((state) => ({ items: state.items.map((current) => (current.id === item.id ? item : current)) }))
    },

    reset() {
      set(initial)
    },
  }))

  registerReset(() => useStore.getState().reset())
  return useStore
}
