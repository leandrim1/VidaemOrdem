import type { Checklist, DigitalItem } from '@/types'
import { delay } from '@/lib/delay'
import { createId } from '@/lib/id'
import { createChecklists, createDigitalItems } from '@/data/mockChecklists'
import { readCollection, writeCollection } from './collection'
import { COLLECTIONS } from './collections'
import { ServiceError } from './errors'

function load(): Checklist[] {
  const stored = readCollection<Checklist>(COLLECTIONS.checklists)
  return stored.length > 0 ? stored : createChecklists()
}

function mutate(checklistId: string, fn: (checklist: Checklist) => Checklist): Checklist {
  const lists = load()
  const index = lists.findIndex((c) => c.id === checklistId)
  if (index === -1) throw new ServiceError('not_found', 'Checklist não encontrado.')
  const updated = { ...fn(lists[index]), updatedAt: new Date().toISOString() }
  lists[index] = updated
  writeCollection(COLLECTIONS.checklists, lists)
  return updated
}

export const checklistsService = {
  async list(): Promise<Checklist[]> {
    await delay()
    return load()
  },

  async toggleItem(checklistId: string, itemId: string): Promise<Checklist> {
    await delay(40)
    return mutate(checklistId, (c) => ({ ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) }))
  },

  async addItem(checklistId: string, label: string): Promise<Checklist> {
    await delay(80)
    return mutate(checklistId, (c) => ({ ...c, items: [...c.items, { id: createId(), label, done: false }] }))
  },

  async removeItem(checklistId: string, itemId: string): Promise<Checklist> {
    await delay(80)
    return mutate(checklistId, (c) => ({ ...c, items: c.items.filter((i) => i.id !== itemId) }))
  },

  async reset(checklistId: string): Promise<Checklist> {
    await delay(80)
    return mutate(checklistId, (c) => ({ ...c, items: c.items.map((i) => ({ ...i, done: false })) }))
  },
}

function loadDigital(): DigitalItem[] {
  const stored = readCollection<DigitalItem>(COLLECTIONS.digital)
  return stored.length > 0 ? stored : createDigitalItems()
}

/** Checklist de organização digital (celular, computador, e-mail, arquivos, fotos). */
export const digitalService = {
  async list(): Promise<DigitalItem[]> {
    await delay()
    return loadDigital()
  },

  async toggle(id: string): Promise<DigitalItem[]> {
    await delay(40)
    const items = loadDigital().map((i) => (i.id === id ? { ...i, done: !i.done } : i))
    writeCollection(COLLECTIONS.digital, items)
    return items
  },

  async reset(): Promise<DigitalItem[]> {
    await delay(80)
    const items = loadDigital().map((i) => ({ ...i, done: false }))
    writeCollection(COLLECTIONS.digital, items)
    return items
  },
}
