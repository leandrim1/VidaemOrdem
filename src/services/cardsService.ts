import type { CreditCard } from '@/types'
import { createCollectionService } from './collection'
import { COLLECTIONS } from './collections'

export const cardsService = createCollectionService<CreditCard>(COLLECTIONS.cards)
