import type { Account, Checklist, DigitalItem, Habit, HabitLog, Task } from '@/types'
import { resolveAccountStatus } from './finance'
import { overallWeeklyProgress } from './habits'

export interface OrganizationArea {
  key: 'financas' | 'tarefas' | 'habitos' | 'digital' | 'checklists'
  label: string
  score: number
}

export interface OrganizationScore {
  score: number
  areas: OrganizationArea[]
}

interface OrganizationInput {
  accounts: Account[]
  tasks: Task[]
  habits: Habit[]
  habitLogs: HabitLog[]
  digitalItems: DigitalItem[]
  checklists: Checklist[]
}

function ratio(done: number, total: number, empty = 0): number {
  return total > 0 ? Math.round((done / total) * 100) : empty
}

/**
 * Índice de organização (0–100): média de cinco áreas da vida do usuário.
 * Cada área é calculada a partir dos próprios dados, então o índice evolui
 * conforme o usuário paga contas, conclui tarefas, mantém hábitos etc.
 */
export function computeOrganizationScore(input: OrganizationInput): OrganizationScore {
  const accountsOnTime = input.accounts.filter((a) => resolveAccountStatus(a) !== 'overdue').length
  const tasksDone = input.tasks.filter((t) => t.completed).length
  const digitalDone = input.digitalItems.filter((i) => i.done).length
  const checklistItems = input.checklists.flatMap((c) => c.items)
  const checklistDone = checklistItems.filter((i) => i.done).length

  const areas: OrganizationArea[] = [
    { key: 'financas', label: 'Contas em dia', score: ratio(accountsOnTime, input.accounts.length) },
    { key: 'tarefas', label: 'Tarefas concluídas', score: ratio(tasksDone, input.tasks.length) },
    { key: 'habitos', label: 'Hábitos da semana', score: overallWeeklyProgress(input.habits, input.habitLogs) },
    { key: 'digital', label: 'Organização digital', score: ratio(digitalDone, input.digitalItems.length) },
    { key: 'checklists', label: 'Checklists', score: ratio(checklistDone, checklistItems.length) },
  ]
  const score = Math.round(areas.reduce((sum, area) => sum + area.score, 0) / areas.length)
  return { score, areas }
}
