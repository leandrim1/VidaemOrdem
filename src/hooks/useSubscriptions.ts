import { useCallback, useMemo } from 'react'
import type { EntityInput, Subscription } from '@/types'
import { withFeedback } from '@/lib/feedback'
import { useSubscriptionsStore } from '@/stores/dataStores'
import { MESSAGES } from '@/stores/toastStore'
import { monthlyEquivalent } from '@/utils/finance'
import { roundMoney } from '@/utils/format'
import { useCollectionResource } from './useCollectionResource'

export type SubscriptionInput = EntityInput<Subscription>

export function useSubscriptions() {
  const resource = useCollectionResource(useSubscriptionsStore)
  const { items, create, update, remove } = resource

  const subscriptions = useMemo(() => [...items].sort((a, b) => a.nextBillingDate.localeCompare(b.nextBillingDate)), [items])
  const active = useMemo(() => subscriptions.filter((s) => s.active), [subscriptions])
  const monthlyTotal = useMemo(() => roundMoney(active.reduce((sum, s) => sum + monthlyEquivalent(s), 0)), [active])

  const addSubscription = useCallback((input: SubscriptionInput) => withFeedback(() => create(input), MESSAGES.saved), [create])
  const updateSubscription = useCallback(
    (id: string, input: Partial<SubscriptionInput>) => withFeedback(() => update(id, input), MESSAGES.saved),
    [update],
  )
  const deleteSubscription = useCallback((id: string) => withFeedback(() => remove(id), MESSAGES.deleted), [remove])

  return {
    ...resource,
    subscriptions,
    active,
    monthlyTotal,
    yearlyTotal: roundMoney(monthlyTotal * 12),
    addSubscription,
    updateSubscription,
    deleteSubscription,
  }
}
