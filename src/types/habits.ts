import type { Entity, ISODate } from './common'

export type HabitIcon = 'book' | 'walk' | 'water' | 'study' | 'dumbbell' | 'brain' | 'sleep' | 'heart'

export interface Habit extends Entity {
  name: string
  icon: HabitIcon
  /** Quantas vezes por semana o hábito deve ser realizado (1–7). */
  targetPerWeek: number
  archived: boolean
}

/** Registro de conclusão de um hábito em um dia. */
export interface HabitLog {
  id: string
  habitId: string
  date: ISODate
}

export interface HabitStats {
  currentStreak: number
  bestStreak: number
  weekCount: number
  weekProgress: number
  doneToday: boolean
}
