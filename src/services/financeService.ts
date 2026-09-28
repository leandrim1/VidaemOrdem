import type { Transaction } from '@/types'
import { createCollectionService } from './collection'
import { COLLECTIONS } from './collections'

/** Movimentações financeiras (receitas e despesas). */
export const financeService = createCollectionService<Transaction>(COLLECTIONS.transactions)
