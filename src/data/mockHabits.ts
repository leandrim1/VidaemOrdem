import { subDays } from 'date-fns'
import type { Habit, HabitLog } from '@/types'
import { createRandom } from '@/lib/random'
import { toISODate } from '@/utils/date'

interface HabitSeed {
  habit: Omit<Habit, 'createdAt'>
  /** Dias (0 = hoje) concluídos na janela dos últimos 7 dias. */
  recent: number[]
  /** Dias forçados como concluídos/não concluídos além da janela. */
  forceDone?: number[]
  forceMiss?: number[]
  /** Probabilidade de conclusão no histórico mais antigo. */
  density: number
}

/**
 * Janela de 7 dias calibrada para 78% de progresso semanal:
 * (5 + 4 + 7 + 3 + 2) / (7 + 5 + 7 + 5 + 3) = 21 / 27.
 */
const SEEDS: HabitSeed[] = [
  { habit: { id: 'habit-1', name: 'Ler 20 minutos', icon: 'book', targetPerWeek: 7, archived: false }, recent: [1, 2, 3, 5, 6], density: 0.7 },
  { habit: { id: 'habit-2', name: 'Caminhar 30 minutos', icon: 'walk', targetPerWeek: 5, archived: false }, recent: [0, 2, 4, 5], density: 0.55 },
  {
    habit: { id: 'habit-3', name: 'Beber 2L de água', icon: 'water', targetPerWeek: 7, archived: false },
    recent: [0, 1, 2, 3, 4, 5, 6],
    forceDone: [7, 8, 9, 10, 11],
    forceMiss: [12],
    density: 0.85,
  },
  { habit: { id: 'habit-4', name: 'Estudar inglês', icon: 'study', targetPerWeek: 5, archived: false }, recent: [1, 3, 5], density: 0.5 },
  { habit: { id: 'habit-5', name: 'Exercitar', icon: 'dumbbell', targetPerWeek: 3, archived: false }, recent: [2, 4], density: 0.42 },
]

const HISTORY_DAYS = 120

export function createMockHabits(): Habit[] {
  const createdAt = subDays(new Date(), HISTORY_DAYS).toISOString()
  return SEEDS.map((seed) => ({ ...seed.habit, createdAt }))
}

export function createMockHabitLogs(reference: Date = new Date()): HabitLog[] {
  const logs: HabitLog[] = []
  SEEDS.forEach((seed, habitIndex) => {
    const random = createRandom(700 + habitIndex * 31)
    for (let offset = 0; offset < HISTORY_DAYS; offset++) {
      let done: boolean
      if (offset < 7) done = seed.recent.includes(offset)
      else if (seed.forceDone?.includes(offset)) done = true
      else if (seed.forceMiss?.includes(offset)) done = false
      else done = random() < seed.density
      if (done) {
        const date = toISODate(subDays(reference, offset))
        logs.push({ id: `${seed.habit.id}-${date}`, habitId: seed.habit.id, date })
      }
    }
  })
  return logs
}
