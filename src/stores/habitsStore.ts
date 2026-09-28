import { create } from 'zustand'
import type { AsyncStatus, EntityInput, Habit, HabitLog, ISODate } from '@/types'
import { habitsService } from '@/services/habitsService'
import { getErrorMessage } from '@/services/errors'
import { registerReset } from './registry'

interface HabitsState {
  habits: Habit[]
  logs: HabitLog[]
  status: AsyncStatus
  error: string | null
  load: (force?: boolean) => Promise<void>
  create: (input: EntityInput<Habit>) => Promise<Habit>
  update: (id: string, patch: Partial<EntityInput<Habit>>) => Promise<Habit>
  remove: (id: string) => Promise<void>
  toggleLog: (habitId: string, date: ISODate) => Promise<boolean>
  reset: () => void
}

const initial = { habits: [] as Habit[], logs: [] as HabitLog[], status: 'idle' as AsyncStatus, error: null as string | null }

export const useHabitsStore = create<HabitsState>()((set, get) => ({
  ...initial,

  async load(force = false) {
    const { status } = get()
    if (!force && (status === 'loading' || status === 'success')) return
    set({ status: 'loading', error: null })
    try {
      const [habits, logs] = await Promise.all([habitsService.list(), habitsService.listLogs()])
      set({ habits, logs, status: 'success' })
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) })
    }
  },

  async create(input) {
    const habit = await habitsService.create(input)
    set((state) => ({ habits: [...state.habits, habit] }))
    return habit
  },

  async update(id, patch) {
    const habit = await habitsService.update(id, patch)
    set((state) => ({ habits: state.habits.map((h) => (h.id === id ? habit : h)) }))
    return habit
  },

  async remove(id) {
    await habitsService.remove(id)
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id), logs: state.logs.filter((l) => l.habitId !== id) }))
  },

  async toggleLog(habitId, date) {
    const previous = get().logs
    const exists = previous.some((l) => l.habitId === habitId && l.date === date)
    // Otimista: o check-in responde instantaneamente.
    set({
      logs: exists
        ? previous.filter((l) => !(l.habitId === habitId && l.date === date))
        : [...previous, { id: `${habitId}-${date}`, habitId, date }],
    })
    try {
      return await habitsService.toggleLog(habitId, date)
    } catch (error) {
      set({ logs: previous })
      throw error
    }
  },

  reset() {
    set(initial)
  },
}))

registerReset(() => useHabitsStore.getState().reset())
