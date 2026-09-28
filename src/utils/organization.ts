import type { Account, Checklist, DigitalItem, Habit, HabitLog, Task } from '@/types'
import { resolveAccountStatus } from './finance'
import { overallWeeklyProgress } from './habits'

export interface OrganizationArea {
  key: 'financas' | 'tarefas' | 'habitos' | 'digital' | 'checklists'
  label: string
  score: number
  /** `false` quando o usuário ainda não tem dados nesta área (conta como 0). */
  hasData: boolean
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
    { key: 'financas', label: 'Contas em dia', score: ratio(accountsOnTime, input.accounts.length), hasData: input.accounts.length > 0 },
    { key: 'tarefas', label: 'Tarefas concluídas', score: ratio(tasksDone, input.tasks.length), hasData: input.tasks.length > 0 },
    { key: 'habitos', label: 'Hábitos da semana', score: overallWeeklyProgress(input.habits, input.habitLogs), hasData: input.habits.some((h) => !h.archived) },
    { key: 'digital', label: 'Organização digital', score: ratio(digitalDone, input.digitalItems.length), hasData: input.digitalItems.length > 0 },
    { key: 'checklists', label: 'Checklists', score: ratio(checklistDone, checklistItems.length), hasData: checklistItems.length > 0 },
  ]
  const score = Math.round(areas.reduce((sum, area) => sum + area.score, 0) / areas.length)
  return { score, areas }
}
