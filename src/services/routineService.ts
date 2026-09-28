import type { RoutineEvent } from '@/types'
import { createCollectionService } from './collection'
import { COLLECTIONS } from './collections'

export const routineService = createCollectionService<RoutineEvent>(COLLECTIONS.routine)
