import { useMemo } from 'react'
import { useChecklistsStore } from '@/stores/checklistsStore'
import { formatCurrency, formatRelativeDay } from '@/utils/format'
import { computeOrganizationScore } from '@/utils/organization'
import { useAccounts } from './useAccounts'
import { useChallenge } from './useChallenge'
import { useChecklists } from './useChecklists'
import { useDigitalOrganization } from './useDigitalOrganization'
import { useFinance } from './useFinance'
import { useGoals } from './useGoals'
import { useHabits } from './useHabits'
import { useTasks } from './useTasks'

export interface FocusAction {
  id: string
  title: string
  description: string
  href: string
  kind: 'bill' | 'task' | 'challenge' | 'habit' | 'goal' | 'finance'
}

/** Agrega os dados de todos os módulos para a visão geral. */
export function useDashboard() {
  const finance = useFinance()
  const accounts = useAccounts()
  const goals = useGoals()
  const tasks = useTasks()
  const habits = useHabits()
  const digital = useDigitalOrganization()
  const challenge = useChallenge()
  useChecklists()
  const checklists = useChecklistsStore((s) => s.checklists)

  const organization = useMemo(
    () =>
      computeOrganizationScore({
        accounts: accounts.items,
        tasks: tasks.items,
        habits: habits.habits,
        habitLogs: habits.logs,
        digitalItems: digital.items,
        checklists,
      }),
    [accounts.items, tasks.items, habits.habits, habits.logs, digital.items, checklists],
  )

  const focus = useMemo<FocusAction[]>(() => {
    const actions: FocusAction[] = []
    const overdue = accounts.accounts.find((a) => a.effectiveStatus === 'overdue')
    const nextBill = accounts.upcoming[0]
    if (overdue) {
      actions.push({ id: `bill-${overdue.id}`, kind: 'bill', title: `Regularizar ${overdue.name.toLowerCase()}`, description: `Atrasada · ${formatCurrency(overdue.amount)}`, href: '/app/contas' })
    } else if (nextBill) {
      actions.push({ id: `bill-${nextBill.id}`, kind: 'bill', title: `Pagar ${nextBill.name.toLowerCase()}`, description: `Vence ${formatRelativeDay(nextBill.dueDate).toLowerCase()} · ${formatCurrency(nextBill.amount)}`, href: '/app/contas' })
    }

    const topTask = tasks.todayTasks[0]
    if (topTask) {
      actions.push({ id: `task-${topTask.id}`, kind: 'task', title: topTask.title, description: `Tarefa de hoje · prioridade ${topTask.priority === 'high' ? 'alta' : topTask.priority === 'medium' ? 'média' : 'baixa'}`, href: '/app/tarefas' })
    }

    const day = challenge.challenge?.days.find((d) => !d.completedAt)
    if (day) {
      actions.push({ id: `challenge-${day.day}`, kind: 'challenge', title: `Desafio: Dia ${day.day} — ${day.title}`, description: `${day.items.filter((i) => i.done).length}/${day.items.length} itens concluídos`, href: '/app/desafio' })
    }

    const pendingHabit = habits.habits.find((h) => !h.stats.doneToday)
    if (pendingHabit) {
      actions.push({ id: `habit-${pendingHabit.id}`, kind: 'habit', title: `Registrar: ${pendingHabit.name}`, description: pendingHabit.stats.currentStreak > 0 ? `Mantenha a sequência de ${pendingHabit.stats.currentStreak} dias` : 'Comece uma nova sequência hoje', href: '/app/habitos' })
    }

    if (finance.transactions.length === 0) {
      actions.push({ id: 'finance-first', kind: 'finance', title: 'Registrar sua primeira movimentação', description: 'Comece anotando uma receita ou despesa', href: '/app/financas' })
    }
    if (goals.goals.length === 0) {
      actions.push({ id: 'goal-first', kind: 'goal', title: 'Criar sua primeira meta', description: 'Defina um objetivo com valor e prazo', href: '/app/metas' })
    }
    return actions.slice(0, 3)
  }, [accounts.accounts, accounts.upcoming, tasks.todayTasks, challenge.challenge, habits.habits, finance.transactions.length, goals.goals.length])

  const isLoading = finance.isLoading || accounts.isLoading || goals.isLoading || tasks.isLoading || habits.isLoading

  return { finance, accounts, goals, tasks, habits, digital, challenge, organization, focus, isLoading }
}
