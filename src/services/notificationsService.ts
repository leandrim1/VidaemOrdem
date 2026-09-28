import type { Notification } from '@/types'
import { delay } from '@/lib/delay'
import { createId } from '@/lib/id'
import { readCollection, writeCollection } from './collection'
import { COLLECTIONS } from './collections'

const MAX_NOTIFICATIONS = 50

function save(items: Notification[]): Notification[] {
  const sorted = [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, MAX_NOTIFICATIONS)
  writeCollection(COLLECTIONS.notifications, sorted)
  return sorted
}

export const notificationsService = {
  async list(): Promise<Notification[]> {
    await delay(150)
    return readCollection<Notification>(COLLECTIONS.notifications).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async setRead(id: string, read: boolean): Promise<Notification[]> {
    return save(readCollection<Notification>(COLLECTIONS.notifications).map((n) => (n.id === id ? { ...n, read } : n)))
  },

  async markAllRead(): Promise<Notification[]> {
    return save(readCollection<Notification>(COLLECTIONS.notifications).map((n) => ({ ...n, read: true })))
  },

  async remove(id: string): Promise<Notification[]> {
    return save(readCollection<Notification>(COLLECTIONS.notifications).filter((n) => n.id !== id))
  },

  async clear(): Promise<Notification[]> {
    return save([])
  },

  /** Cria a notificação apenas uma vez por `key` (ex.: lembrete de fim do teste). */
  async pushOnce(key: string, input: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification[]> {
    const items = readCollection<Notification>(COLLECTIONS.notifications)
    if (items.some((n) => n.id === key)) return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    return save([{ ...input, id: key, createdAt: new Date().toISOString(), read: false }, ...items])
  },

  async push(input: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification[]> {
    const notification: Notification = { ...input, id: createId(), createdAt: new Date().toISOString(), read: false }
    return save([notification, ...readCollection<Notification>(COLLECTIONS.notifications)])
  },
}
