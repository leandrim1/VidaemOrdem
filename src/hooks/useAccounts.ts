import { useCallback, useMemo } from 'react'
import type { Account, AccountStatus, EntityInput } from '@/types'
import { withFeedback } from '@/lib/feedback'
import { accountsService } from '@/services/accountsService'
import { useAccountsStore } from '@/stores/dataStores'
import { MESSAGES } from '@/stores/toastStore'
import { daysUntil } from '@/utils/date'
import { resolveAccountStatus } from '@/utils/finance'
import { roundMoney } from '@/utils/format'
import { useCollectionResource } from './useCollectionResource'

export type AccountInput = EntityInput<Account>

export interface AccountWithStatus extends Account {
  effectiveStatus: AccountStatus
}

/** Contas a pagar. */
export function useAccounts() {
  const resource = useCollectionResource(useAccountsStore)
  const { items, create, update, remove, replace } = resource

  const accounts = useMemo<AccountWithStatus[]>(
    () =>
      items
        .map((a) => ({ ...a, effectiveStatus: resolveAccountStatus(a) }))
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [items],
  )

  const upcoming = useMemo(
    () => accounts.filter((a) => a.effectiveStatus === 'pending' && daysUntil(a.dueDate) <= 15),
    [accounts],
  )

  const totals = useMemo(() => {
    const sum = (status: AccountStatus) =>
      roundMoney(accounts.filter((a) => a.effectiveStatus === status).reduce((acc, a) => acc + a.amount, 0))
    return {
      pending: sum('pending'),
      overdue: sum('overdue'),
      paid: sum('paid'),
      overdueCount: accounts.filter((a) => a.effectiveStatus === 'overdue').length,
    }
  }, [accounts])

  const addAccount = useCallback((input: AccountInput) => withFeedback(() => create(input), MESSAGES.saved), [create])
  const updateAccount = useCallback(
    (id: string, input: Partial<AccountInput>) => withFeedback(() => update(id, input), MESSAGES.saved),
    [update],
  )
  const deleteAccount = useCallback((id: string) => withFeedback(() => remove(id), MESSAGES.deleted), [remove])
  const togglePaid = useCallback(
    (account: Account) =>
      withFeedback(
        async () => replace(account.status === 'paid' ? await accountsService.markAsPending(account.id) : await accountsService.markAsPaid(account.id)),
        account.status === 'paid' ? 'Conta marcada como pendente.' : 'Conta marcada como paga.',
      ),
    [replace],
  )

  return { ...resource, accounts, upcoming, totals, addAccount, updateAccount, deleteAccount, togglePaid }
}
