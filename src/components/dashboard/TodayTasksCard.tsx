import { Link } from 'react-router-dom'
import { ArrowRight, ListChecks, PartyPopper } from 'lucide-react'
import type { Task } from '@/types'
import { PATHS } from '@/routes/paths'
import { buttonClasses } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/States'
import { TaskItem } from '@/components/tasks/TaskItem'

export function TodayTasksCard({ tasks, onToggle }: { tasks: Task[]; onToggle: (task: Task) => void }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Tarefas de hoje"
        description={tasks.length > 0 ? `${tasks.length} pendente${tasks.length > 1 ? 's' : ''}` : 'Nada pendente'}
        icon={<ListChecks />}
        action={
          <Link to={PATHS.tasks} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-semibold text-primary-ink hover:bg-primary-soft">
            Ver todas <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        }
      />
      {tasks.length === 0 ? (
        <EmptyState
          compact
          icon={<PartyPopper />}
          title="Dia livre de pendências"
          description="Você concluiu tudo o que estava planejado para hoje."
          action={
            <Link to={`${PATHS.tasks}?novo=1`} className={buttonClasses('soft', 'sm')}>
              Adicionar tarefa
            </Link>
          }
        />
      ) : (
        <ul className="-my-1 divide-y divide-line">
          {tasks.slice(0, 5).map((task) => (
            <li key={task.id}>
              <TaskItem task={task} onToggle={onToggle} compact />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
