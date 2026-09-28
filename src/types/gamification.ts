import type { ISODateTime } from './common'

export type PointAction = 'task' | 'habit' | 'checklist' | 'goal' | 'challenge'

export interface PointEvent {
  id: string
  action: PointAction
  points: number
  label: string
  createdAt: ISODateTime
}

export interface GamificationState {
  points: number
  history: PointEvent[]
  /** Chaves de ações já recompensadas (evita pontuar duas vezes a mesma ação). */
  awardedKeys: string[]
}

export interface Level {
  level: number
  name: string
  minPoints: number
}
