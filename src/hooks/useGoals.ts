import { useCallback, useMemo } from 'react'
import type { EntityInput, Goal } from '@/types'
import { withFeedback } from '@/lib/feedback'
import { goalsService } from '@/services/goalsService'
import { useGoalsStore } from '@/stores/dataStores'
import { useGamificationStore } from '@/stores/gamificationStore'
import { MESSAGES } from '@/stores/toastStore'
import { formatCurrency } from '@/utils/format'
import { useCollectionResource } from './useCollectionResource'

export type GoalInput = EntityInput<Goal>

export function goalProgress(goal: Pick<Goal, 'currentAmount' | 'targetAmount'>): number {
  return goal.targetAmount > 0 ? Math.min(100, (goal.currentAmount / goal.targetAmount) * 100) : 0
}

export function useGoals() {
  const resource = useCollectionResource(useGoalsStore)
  const { items, create, update, remove, replace } = resource
  const award = useGamificationStore((s) => s.award)

  const goals = useMemo(
    () =>
      [...items].sort((a, b) => {
        const doneA = a.currentAmount >= a.targetAmount
        const doneB = b.currentAmount >= b.targetAmount
        if (doneA !== doneB) return doneA ? 1 : -1
        return a.createdAt.localeCompare(b.createdAt)
      }),
    [items],
  )
  const active = useMemo(() => goals.filter((g) => g.currentAmount < g.targetAmount), [goals])
  const completed = useMemo(() => goals.filter((g) => g.currentAmount >= g.targetAmount), [goals])

  const rewardIfCompleted = useCallback(
    (goal: Goal) => {
      if (goal.currentAmount >= goal.targetAmount) void award('goal', `goal:${goal.id}`, `Meta concluída: ${goal.name}`)
    },
    [award],
  )

  const addGoal = useCallback(
    (input: GoalInput) =>
      withFeedback(async () => {
        rewardIfCompleted(await create(input))
      }, MESSAGES.saved),
    [create, rewardIfCompleted],
  )
  const updateGoal = useCallback(
    (id: string, input: Partial<GoalInput>) =>
      withFeedback(async () => {
        rewardIfCompleted(await update(id, input))
      }, MESSAGES.saved),
    [update, rewardIfCompleted],
  )
  const deleteGoal = useCallback((id: string) => withFeedback(() => remove(id), MESSAGES.deleted), [remove])
  const contribute = useCallback(
    (goal: Goal, amount: number) =>
      withFeedback(async () => {
        const updated = await goalsService.contribute(goal.id, amount)
        replace(updated)
        rewardIfCompleted(updated)
      }, amount >= 0 ? `${formatCurrency(amount)} adicionados à meta.` : `${formatCurrency(Math.abs(amount))} retirados da meta.`),
    [replace, rewardIfCompleted],
  )

  return { ...resource, goals, active, completed, addGoal, updateGoal, deleteGoal, contribute }
}
