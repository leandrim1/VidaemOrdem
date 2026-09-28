import { memo } from 'react'
import { CalendarDays, Pencil, Trash2 } from 'lucide-react'
import type { Task } from '@/types'
import { cn } from '@/lib/cn'
import { priorityLabel, taskCategoryLabel } from '@/data/categories'
import { daysUntil } from '@/utils/date'
import { formatRelativeDay } from '@/utils/format'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Checkbox } from '@/components/ui/Checkbox'
import { IconButton } from '@/components/ui/IconButton'

const priorityTone: Record<Task['priority'], BadgeTone> = { high: 'danger', medium: 'warning', low: 'neutral' }

interface TaskItemProps {
  task: Task
  onToggle: (task: Task) => void
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
  compact?: boolean
}

export const TaskItem = memo(function TaskItem({ task, onToggle, onEdit, onDelete, compact }: TaskItemProps) {
  const overdue = !task.completed && task.dueDate !== null && daysUntil(task.dueDate) < 0
  return (
    <div className={cn('group flex items-start gap-3', compact ? 'py-2.5' : 'py-3.5')}>
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={task.completed ? `Reabrir tarefa: ${task.title}` : `Concluir tarefa: ${task.title}`}
        size={compact ? 'md' : 'lg'}
        tone="success"
        className="mt-0.5"
      />
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-medium transition-colors', task.completed ? 'text-muted line-through decoration-line-strong' : 'text-fg')}>{task.title}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <Badge tone={task.completed ? 'neutral' : priorityTone[task.priority]} dot>
            {priorityLabel(task.priority)}
          </Badge>
          {!compact && <Badge tone="neutral">{taskCategoryLabel(task.category)}</Badge>}
          {task.dueDate && (
            <span className={cn('inline-flex items-center gap-1 text-xs', overdue ? 'font-semibold text-danger-ink' : 'text-muted')}>
              <CalendarDays className="size-3.5" aria-hidden />
              {overdue ? `Atrasada · ${formatRelativeDay(task.dueDate)}` : formatRelativeDay(task.dueDate)}
            </span>
          )}
        </div>
        {!compact && task.description && <p className="mt-1.5 text-[13px] text-muted">{task.description}</p>}
      </div>
      {(onEdit || onDelete) && (
        <div className="flex shrink-0 gap-0.5 sm:opacity-0 sm:transition-opacity sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
          {onEdit && <IconButton size="sm" label={`Editar ${task.title}`} icon={<Pencil />} onClick={() => onEdit(task)} />}
          {onDelete && <IconButton size="sm" tone="danger" label={`Excluir ${task.title}`} icon={<Trash2 />} onClick={() => onDelete(task)} />}
        </div>
      )}
    </div>
  )
})
