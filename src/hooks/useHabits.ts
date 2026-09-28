import { useCallback, useEffect, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { EntityInput, Habit, HabitStats, ISODate } from '@/types'
import { withFeedback } from '@/lib/feedback'
import { useGamificationStore } from '@/stores/gamificationStore'
import { useHabitsStore } from '@/stores/habitsStore'
import { MESSAGES, toast } from '@/stores/toastStore'
import { todayISO } from '@/utils/date'
import { computeHabitStats, indexLogs, overallWeeklyProgress } from '@/utils/habits'

export type HabitInput = EntityInput<Habit>

export interface HabitWithStats extends Habit {
  stats: HabitStats
  dates: Set<ISODate>
}

export function useHabits() {
  const { habits, logs, status, error, load, create, update, remove, toggleLog } = useHabitsStore(
    useShallow((s) => ({
      habits: s.habits,
      logs: s.logs,
      status: s.status,
      error: s.error,
      load: s.load,
      create: s.create,
      update: s.update,
      remove: s.remove,
      toggleLog: s.toggleLog,
    })),
  )
  const award = useGamificationStore((s) => s.award)

  // Recarrega sempre que o store volta a "idle" (ex.: troca de usuário ou restauração de dados).
  useEffect(() => {
    if (status === 'idle') void load()
  }, [status, load])

  const index = useMemo(() => indexLogs(logs), [logs])
  const active = useMemo(() => habits.filter((h) => !h.archived), [habits])
  const withStats = useMemo<HabitWithStats[]>(
    () =>
      active.map((habit) => {
        const dates = index.get(habit.id) ?? new Set<ISODate>()
        return { ...habit, dates, stats: computeHabitStats(habit, dates) }
      }),
    [active, index],
  )
  const weeklyProgress = useMemo(() => overallWeeklyProgress(habits, logs), [habits, logs])
  const doneToday = withStats.filter((h) => h.stats.doneToday).length

  const toggle = useCallback(
    async (habit: Habit, date: ISODate = todayISO()) => {
      try {
        const done = await toggleLog(habit.id, date)
        if (done) {
          const points = await award('habit', `habit:${habit.id}:${date}`, `Hábito: ${habit.name}`)
          if (points === 0) toast.success('Hábito registrado.')
        }
      } catch {
        toast.error('Não foi possível registrar o hábito.')
      }
    },
    [toggleLog, award],
  )

  const addHabit = useCallback((input: HabitInput) => withFeedback(() => create(input), MESSAGES.saved), [create])
  const updateHabit = useCallback((id: string, input: Partial<HabitInput>) => withFeedback(() => update(id, input), MESSAGES.saved), [update])
  const deleteHabit = useCallback((id: string) => withFeedback(() => remove(id), MESSAGES.deleted), [remove])

  return {
    habits: withStats,
    logs,
    status,
    error,
    isLoading: status === 'idle' || status === 'loading',
    isError: status === 'error',
    reload: () => load(true),
    weeklyProgress,
    doneToday,
    toggle,
    addHabit,
    updateHabit,
    deleteHabit,
  }
}
