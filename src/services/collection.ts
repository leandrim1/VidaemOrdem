import type { Entity, EntityInput } from '@/types'
import { delay } from '@/lib/delay'
import { createId } from '@/lib/id'
import { readJSON, storageKeys, writeJSON } from '@/lib/storage'
import { ServiceError } from './errors'
import { requireUserId } from './session'

/**
 * Contrato de CRUD usado pelos stores. A implementação atual persiste no
 * localStorage (namespace do usuário da sessão); para migrar ao Supabase basta
 * reimplementar estas funções com `supabase.from(tabela)` — componentes, hooks
 * e stores continuam iguais.
 */
export interface CollectionService<T extends Entity> {
  list(): Promise<T[]>
  create(input: EntityInput<T>): Promise<T>
  update(id: string, patch: Partial<EntityInput<T>>): Promise<T>
  remove(id: string): Promise<void>
}

export function readCollection<T>(collection: string, userId: string = requireUserId()): T[] {
  return readJSON<T[]>(storageKeys.user(userId, collection), [])
}

export function writeCollection<T>(collection: string, items: T[], userId: string = requireUserId()): void {
  if (!writeJSON(storageKeys.user(userId, collection), items)) {
    throw new ServiceError('storage', 'Não foi possível salvar. Verifique o espaço disponível no navegador.')
  }
}

export function createCollectionService<T extends Entity>(collection: string): CollectionService<T> {
  return {
    async list() {
      await delay()
      return readCollection<T>(collection)
    },

    async create(input) {
      await delay(120)
      const item = { ...input, id: createId(), createdAt: new Date().toISOString() } as T
      writeCollection(collection, [item, ...readCollection<T>(collection)])
      return item
    },

    async update(id, patch) {
      await delay(120)
      const items = readCollection<T>(collection)
      const index = items.findIndex((item) => item.id === id)
      if (index === -1) throw new ServiceError('not_found', 'Este item não existe mais.')
      const updated: T = { ...items[index], ...patch, id, updatedAt: new Date().toISOString() }
      items[index] = updated
      writeCollection(collection, items)
      return updated
    },

    async remove(id) {
      await delay(120)
      writeCollection(
        collection,
        readCollection<T>(collection).filter((item) => item.id !== id),
      )
    },
  }
}

/** Serviço para um único documento por usuário (ex.: progresso do desafio). */
export interface DocumentService<T> {
  get(): Promise<T>
  save(value: T): Promise<T>
  /**
   * Leitura-modificação-escrita atômica: lê e grava sem pausa entre as etapas,
   * evitando que operações simultâneas sobrescrevam umas às outras.
   */
  update(fn: (current: T) => T): Promise<T>
}

export function createDocumentService<T>(collection: string, fallback: () => T): DocumentService<T> {
  const read = (): T => readJSON<T | null>(storageKeys.user(requireUserId(), collection), null) ?? fallback()
  const write = (value: T): T => {
    if (!writeJSON(storageKeys.user(requireUserId(), collection), value)) {
      throw new ServiceError('storage', 'Não foi possível salvar o progresso.')
    }
    return value
  }
  return {
    async get() {
      await delay(180)
      return read()
    },
    async save(value) {
      await delay(60)
      return write(value)
    },
    async update(fn) {
      await delay(60)
      return write(fn(read()))
    },
  }
}
