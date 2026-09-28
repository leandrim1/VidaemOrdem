import { createMockAccounts } from '@/data/mockAccounts'
import { createMockCards } from '@/data/mockCards'
import { createMockChallenge, createChallenge } from '@/data/mockChallenge'
import { createChecklists, createDigitalItems } from '@/data/mockChecklists'
import { createMockDocuments } from '@/data/mockDocuments'
import { createMockGoals } from '@/data/mockGoals'
import { createMockHabitLogs, createMockHabits } from '@/data/mockHabits'
import { createMockNotifications, createWelcomeNotifications } from '@/data/mockNotifications'
import { createMockRoutine } from '@/data/mockRoutine'
import { createMockSubscriptions } from '@/data/mockSubscriptions'
import { createMockTasks } from '@/data/mockTasks'
import { createMockTransactions } from '@/data/mockTransactions'
import { createMockGamification } from '@/data/mockUser'
import { removeByPrefix, storageKeys, writeJSON } from '@/lib/storage'
import { COLLECTIONS } from './collections'

type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS]

function write(userId: string, collection: CollectionName, value: unknown) {
  writeJSON(storageKeys.user(userId, collection), value)
}

/** Popula todos os módulos com os dados fictícios da usuária demo. */
export function seedDemoData(userId: string): void {
  removeByPrefix(storageKeys.userPrefix(userId))
  write(userId, COLLECTIONS.transactions, createMockTransactions())
  write(userId, COLLECTIONS.accounts, createMockAccounts())
  write(userId, COLLECTIONS.cards, createMockCards())
  write(userId, COLLECTIONS.subscriptions, createMockSubscriptions())
  write(userId, COLLECTIONS.goals, createMockGoals())
  write(userId, COLLECTIONS.tasks, createMockTasks())
  write(userId, COLLECTIONS.routine, createMockRoutine())
  write(userId, COLLECTIONS.habits, createMockHabits())
  write(userId, COLLECTIONS.habitLogs, createMockHabitLogs())
  write(userId, COLLECTIONS.documents, createMockDocuments())
  write(userId, COLLECTIONS.digital, createDigitalItems(true))
  write(userId, COLLECTIONS.checklists, createChecklists(true))
  write(userId, COLLECTIONS.challenge, createMockChallenge())
  write(userId, COLLECTIONS.notifications, createMockNotifications())
  write(userId, COLLECTIONS.gamification, createMockGamification())
}

/** Conta nova: módulos vazios, apenas modelos (checklists, desafio) prontos para uso. */
export function seedNewUserData(userId: string, name: string): void {
  write(userId, COLLECTIONS.digital, createDigitalItems(false))
  write(userId, COLLECTIONS.checklists, createChecklists(false))
  write(userId, COLLECTIONS.challenge, createChallenge())
  write(userId, COLLECTIONS.notifications, createWelcomeNotifications(name))
  write(userId, COLLECTIONS.gamification, { points: 0, history: [], awardedKeys: [] })
}

export function clearUserData(userId: string): void {
  removeByPrefix(storageKeys.userPrefix(userId))
}
