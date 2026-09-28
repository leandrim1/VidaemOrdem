import type { Subscription } from '@/types'
import { createCollectionService } from './collection'
import { COLLECTIONS } from './collections'

export const subscriptionsService = createCollectionService<Subscription>(COLLECTIONS.subscriptions)
