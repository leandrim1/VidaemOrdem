import type { Entity, ISODate } from './common'

export type GoalCategory = 'financeira' | 'viagem' | 'educacao' | 'saude' | 'carreira' | 'casa' | 'pessoal'

export interface Goal extends Entity {
  name: string
  category: GoalCategory
  targetAmount: number
  currentAmount: number
  deadline: ISODate
  completedAt?: ISODate
}
