import { useCallback, useMemo } from 'react'
import type { EntityInput, Transaction } from '@/types'
import { withFeedback } from '@/lib/feedback'
import { useTransactionsStore } from '@/stores/dataStores'
import { MESSAGES } from '@/stores/toastStore'
import { expensesByCategory, monthlySeries, summarize, transactionsInMonth } from '@/utils/finance'
import { useCollectionResource } from './useCollectionResource'

export type TransactionInput = EntityInput<Transaction>

export function useFinance() {
  const resource = useCollectionResource(useTransactionsStore)
  const { items, create, update, remove } = resource

  const sorted = useMemo(
    () => [...items].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)),
    [items],
  )
  const monthTransactions = useMemo(() => transactionsInMonth(sorted), [sorted])
  const summary = useMemo(() => summarize(monthTransactions), [monthTransactions])
  const categories = useMemo(() => expensesByCategory(monthTransactions), [monthTransactions])
  const series = useMemo(() => monthlySeries(items, 6), [items])

  const addTransaction = useCallback((input: TransactionInput) => withFeedback(() => create(input), MESSAGES.saved), [create])
  const updateTransaction = useCallback(
    (id: string, input: Partial<TransactionInput>) => withFeedback(() => update(id, input), MESSAGES.saved),
    [update],
  )
  const deleteTransaction = useCallback((id: string) => withFeedback(() => remove(id), MESSAGES.deleted), [remove])

  return {
    ...resource,
    transactions: sorted,
    monthTransactions,
    summary,
    categories,
    series,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
