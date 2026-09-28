import { useCallback, useMemo } from 'react'
import type { Document, EntityInput } from '@/types'
import { withFeedback } from '@/lib/feedback'
import { useDocumentsStore } from '@/stores/dataStores'
import { MESSAGES } from '@/stores/toastStore'
import { daysUntil } from '@/utils/date'
import { useCollectionResource } from './useCollectionResource'

export type DocumentInput = EntityInput<Document>

export type ExpiryState = 'expired' | 'soon' | 'valid' | 'none'

export function expiryState(doc: Pick<Document, 'expiresAt'>): ExpiryState {
  if (!doc.expiresAt) return 'none'
  const days = daysUntil(doc.expiresAt)
  if (days < 0) return 'expired'
  if (days <= 60) return 'soon'
  return 'valid'
}

export function useDocuments() {
  const resource = useCollectionResource(useDocumentsStore)
  const { items, create, update, remove } = resource

  const documents = useMemo(() => [...items].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')), [items])
  const attention = useMemo(
    () => documents.filter((d) => ['expired', 'soon'].includes(expiryState(d))).sort((a, b) => (a.expiresAt ?? '').localeCompare(b.expiresAt ?? '')),
    [documents],
  )

  const addDocument = useCallback((input: DocumentInput) => withFeedback(() => create(input), MESSAGES.saved), [create])
  const updateDocument = useCallback(
    (id: string, input: Partial<DocumentInput>) => withFeedback(() => update(id, input), MESSAGES.saved),
    [update],
  )
  const deleteDocument = useCallback((id: string) => withFeedback(() => remove(id), MESSAGES.deleted), [remove])

  return { ...resource, documents, attention, addDocument, updateDocument, deleteDocument }
}
