import type { Account } from '@/types'
import { todayISO } from '@/utils/date'
import { createCollectionService } from './collection'
import { COLLECTIONS } from './collections'

const base = createCollectionService<Account>(COLLECTIONS.accounts)

/** Contas a pagar. */
export const accountsService = {
  ...base,
  markAsPaid(id: string) {
    return base.update(id, { status: 'paid', paidAt: todayISO() })
  },
  markAsPending(id: string) {
    return base.update(id, { status: 'pending', paidAt: undefined })
  },
}
