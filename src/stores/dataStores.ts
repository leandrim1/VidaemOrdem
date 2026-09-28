import type { Account, CreditCard, Document, Goal, RoutineEvent, Subscription, Task, Transaction } from '@/types'
import { accountsService } from '@/services/accountsService'
import { cardsService } from '@/services/cardsService'
import { documentsService } from '@/services/documentsService'
import { financeService } from '@/services/financeService'
import { goalsService } from '@/services/goalsService'
import { routineService } from '@/services/routineService'
import { subscriptionsService } from '@/services/subscriptionsService'
import { tasksService } from '@/services/tasksService'
import { createCollectionStore } from './createCollectionStore'

/* Um store por domínio — nada de um store único para toda a aplicação. */
export const useTransactionsStore = createCollectionStore<Transaction>(financeService)
export const useAccountsStore = createCollectionStore<Account>(accountsService)
export const useCardsStore = createCollectionStore<CreditCard>(cardsService)
export const useSubscriptionsStore = createCollectionStore<Subscription>(subscriptionsService)
export const useGoalsStore = createCollectionStore<Goal>(goalsService)
export const useTasksStore = createCollectionStore<Task>(tasksService)
export const useRoutineStore = createCollectionStore<RoutineEvent>(routineService)
export const useDocumentsStore = createCollectionStore<Document>(documentsService)
