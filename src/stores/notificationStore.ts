import { create } from 'zustand'
import type { AsyncStatus, Notification } from '@/types'
import { notificationsService } from '@/services/notificationsService'
import { getErrorMessage } from '@/services/errors'
import { registerReset } from './registry'

interface NotificationState {
  items: Notification[]
  status: AsyncStatus
  error: string | null
  load: (force?: boolean) => Promise<void>
  toggleRead: (id: string) => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  remove: (id: string) => Promise<void>
  clear: () => Promise<void>
  push: (input: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Promise<void>
  reset: () => void
}

const initial = { items: [] as Notification[], status: 'idle' as AsyncStatus, error: null as string | null }

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  ...initial,

  async load(force = false) {
    const { status } = get()
    if (!force && (status === 'loading' || status === 'success')) return
    set({ status: 'loading', error: null })
    try {
      set({ items: await notificationsService.list(), status: 'success' })
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) })
    }
  },

  async toggleRead(id) {
    const target = get().items.find((n) => n.id === id)
    if (!target) return
    set({ items: await notificationsService.setRead(id, !target.read) })
  },

  async markRead(id) {
    if (get().items.find((n) => n.id === id)?.read) return
    set({ items: await notificationsService.setRead(id, true) })
  },

  async markAllRead() {
    set({ items: await notificationsService.markAllRead() })
  },

  async remove(id) {
    set({ items: await notificationsService.remove(id) })
  },

  async clear() {
    set({ items: await notificationsService.clear() })
  },

  async push(input) {
    set({ items: await notificationsService.push(input) })
  },

  reset() {
    set(initial)
  },
}))

registerReset(() => useNotificationStore.getState().reset())
