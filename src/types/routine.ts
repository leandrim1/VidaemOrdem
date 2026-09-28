import type { Entity, ISODate } from './common'

export type RoutineEventType = 'compromisso' | 'tarefa' | 'evento'

export interface RoutineEvent extends Entity {
  title: string
  type: RoutineEventType
  date: ISODate
  /** Horário `HH:mm`. */
  startTime: string
  endTime?: string
  location?: string
  notes?: string
}

export type RoutineViewMode = 'day' | 'week' | 'month'
