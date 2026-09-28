import { useCallback, useMemo } from 'react'
import type { EntityInput, Task, TaskPriority, TaskView } from '@/types'
import { withFeedback } from '@/lib/feedback'
import { tasksService } from '@/services/tasksService'
import { useTasksStore } from '@/stores/dataStores'
import { useGamificationStore } from '@/stores/gamificationStore'
import { MESSAGES, toast } from '@/stores/toastStore'
import { todayISO } from '@/utils/date'
import { useCollectionResource } from './useCollectionResource'

export type TaskInput = EntityInput<Task>

const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 }

function compareTasks(a: Task, b: Task): number {
  const dateA = a.dueDate ?? '9999-12-31'
  const dateB = b.dueDate ?? '9999-12-31'
  return dateA.localeCompare(dateB) || PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority] || a.title.localeCompare(b.title)
}

export function filterTasksByView(tasks: Task[], view: TaskView, today = todayISO()): Task[] {
  switch (view) {
    case 'today':
      return tasks.filter((t) => !t.completed && t.dueDate !== null && t.dueDate <= today)
    case 'upcoming':
      return tasks.filter((t) => !t.completed && (t.dueDate === null || t.dueDate > today))
    case 'completed':
      return tasks
        .filter((t) => t.completed)
        .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
    default:
      return tasks
  }
}

export function useTasks() {
  const resource = useCollectionResource(useTasksStore)
  const { items, create, update, remove, replace } = resource
  const award = useGamificationStore((s) => s.award)

  const tasks = useMemo(() => [...items].sort(compareTasks), [items])
  const today = todayISO()
  const todayTasks = useMemo(() => filterTasksByView(tasks, 'today', today), [tasks, today])
  const counts = useMemo(
    () => ({
      all: tasks.length,
      today: todayTasks.length,
      upcoming: filterTasksByView(tasks, 'upcoming', today).length,
      completed: tasks.filter((t) => t.completed).length,
      overdue: tasks.filter((t) => !t.completed && t.dueDate !== null && t.dueDate < today).length,
    }),
    [tasks, todayTasks, today],
  )

  const addTask = useCallback((input: TaskInput) => withFeedback(() => create(input), MESSAGES.saved), [create])
  const updateTask = useCallback((id: string, input: Partial<TaskInput>) => withFeedback(() => update(id, input), MESSAGES.saved), [update])
  const deleteTask = useCallback((id: string) => withFeedback(() => remove(id), MESSAGES.deleted), [remove])

  const toggleTask = useCallback(
    async (task: Task) => {
      // Atualização otimista para resposta instantânea do checkbox.
      replace({ ...task, completed: !task.completed, completedAt: task.completed ? undefined : new Date().toISOString() })
      try {
        const updated = await tasksService.toggle(task.id)
        replace(updated)
        if (updated.completed) {
          const points = await award('task', `task:${task.id}`, `Tarefa concluída: ${task.title}`)
          if (points === 0) toast.success('Tarefa concluída.')
        }
      } catch {
        replace(task)
        toast.error('Não foi possível atualizar a tarefa.')
      }
    },
    [replace, award],
  )

  return { ...resource, tasks, todayTasks, counts, addTask, updateTask, deleteTask, toggleTask }
}
