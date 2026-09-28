import { useCallback, useMemo } from 'react'
import type { CreditCard, EntityInput } from '@/types'
import { withFeedback } from '@/lib/feedback'
import { useCardsStore } from '@/stores/dataStores'
import { MESSAGES } from '@/stores/toastStore'
import { roundMoney } from '@/utils/format'
import { useCollectionResource } from './useCollectionResource'

export type CardInput = EntityInput<CreditCard>

export function useCards() {
  const resource = useCollectionResource(useCardsStore)
  const { items, create, update, remove } = resource

  const totals = useMemo(() => {
    const limit = roundMoney(items.reduce((sum, c) => sum + c.limit, 0))
    const used = roundMoney(items.reduce((sum, c) => sum + c.used, 0))
    return { limit, used, available: roundMoney(Math.max(0, limit - used)), percent: limit > 0 ? (used / limit) * 100 : 0 }
  }, [items])

  const addCard = useCallback((input: CardInput) => withFeedback(() => create(input), MESSAGES.saved), [create])
  const updateCard = useCallback((id: string, input: Partial<CardInput>) => withFeedback(() => update(id, input), MESSAGES.saved), [update])
  const deleteCard = useCallback((id: string) => withFeedback(() => remove(id), MESSAGES.deleted), [remove])

  return { ...resource, cards: items, totals, addCard, updateCard, deleteCard }
}
