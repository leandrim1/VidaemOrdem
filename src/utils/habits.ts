import { addDays, parseISO, startOfDay, subDays } from 'date-fns'
import type { Habit, HabitLog, HabitStats, ISODate } from '@/types'
import { toISODate } from './date'

/** Conjunto de datas concluídas por hábito, para consultas O(1). */
export function indexLogs(logs: HabitLog[]): Map<string, Set<ISODate>> {
  const map = new Map<string, Set<ISODate>>()
  for (const log of logs) {
    let set = map.get(log.habitId)
    if (!set) {
      set = new Set()
      map.set(log.habitId, set)
    }
    set.add(log.date)
  }
  return map
}

/** Datas dos últimos 7 dias, terminando hoje (janela móvel). */
export function lastSevenDays(reference: Date = new Date()): ISODate[] {
  const end = startOfDay(reference)
  return Array.from({ length: 7 }, (_, i) => toISODate(subDays(end, 6 - i)))
}

export function computeHabitStats(habit: Habit, dates: Set<ISODate> | undefined, reference: Date = new Date()): HabitStats {
  const done = dates ?? new Set<ISODate>()
  const today = startOfDay(reference)
  const todayISO = toISODate(today)
  const doneToday = done.has(todayISO)

  // Sequência atual: conta a partir de hoje (ou de ontem, se hoje ainda não foi feito).
  let currentStreak = 0
  let cursor = doneToday ? today : subDays(today, 1)
  while (done.has(toISODate(cursor))) {
    currentStreak++
    cursor = subDays(cursor, 1)
  }

  // Melhor sequência histórica.
  const sorted = Array.from(done).sort()
  let bestStreak = 0
  let run = 0
  let previous: Date | null = null
  for (const iso of sorted) {
    const date = parseISO(iso)
    run = previous && toISODate(addDays(previous, 1)) === iso ? run + 1 : 1
    bestStreak = Math.max(bestStreak, run)
    previous = date
  }

  const weekCount = lastSevenDays(reference).filter((d) => done.has(d)).length
  const target = Math.max(1, habit.targetPerWeek)
  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    weekCount,
    weekProgress: Math.min(100, (weekCount / target) * 100),
    doneToday,
  }
}

/** Progresso semanal consolidado: check-ins (limitados à meta) / soma das metas. */
export function overallWeeklyProgress(habits: Habit[], logs: HabitLog[], reference: Date = new Date()): number {
  const active = habits.filter((h) => !h.archived)
  if (active.length === 0) return 0
  const index = indexLogs(logs)
  const window = lastSevenDays(reference)
  let done = 0
  let target = 0
  for (const habit of active) {
    const dates = index.get(habit.id)
    const count = dates ? window.filter((d) => dates.has(d)).length : 0
    done += Math.min(count, habit.targetPerWeek)
    target += habit.targetPerWeek
  }
  return target > 0 ? Math.round((done / target) * 100) : 0
}
