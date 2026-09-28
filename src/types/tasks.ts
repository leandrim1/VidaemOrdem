import type { Entity, ISODate, ISODateTime } from './common'

export type TaskPriority = 'high' | 'medium' | 'low'

export type TaskCategory = 'pessoal' | 'trabalho' | 'casa' | 'financas' | 'saude' | 'estudos'

export interface Task extends Entity {
  title: string
  description?: string
  priority: TaskPriority
  dueDate: ISODate | null
  category: TaskCategory
  completed: boolean
  completedAt?: ISODateTime
}

export type TaskView = 'all' | 'today' | 'upcoming' | 'completed'
