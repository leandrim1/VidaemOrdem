import type { Task } from '@/types'
import { createCollectionService, readCollection } from './collection'
import { COLLECTIONS } from './collections'
import { ServiceError } from './errors'

const base = createCollectionService<Task>(COLLECTIONS.tasks)

export const tasksService = {
  ...base,
  async toggle(id: string) {
    const task = readCollection<Task>(COLLECTIONS.tasks).find((t) => t.id === id)
    if (!task) throw new ServiceError('not_found', 'Tarefa não encontrada.')
    const completed = !task.completed
    return base.update(id, { completed, completedAt: completed ? new Date().toISOString() : undefined })
  },
}
