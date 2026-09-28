import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { CalendarClock, CircleCheck, ListChecks, ListTodo, Plus, Sun } from 'lucide-react'
import type { Task, TaskView } from '@/types'
import { TASK_CATEGORIES, TASK_PRIORITIES } from '@/data/categories'
import { useEditor } from '@/hooks/useDisclosure'
import { useQueryAction } from '@/hooks/useQueryAction'
import { filterTasksByView, useTasks } from '@/hooks/useTasks'
import { confirm } from '@/stores/confirmStore'
import { todayISO } from '@/utils/date'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States'
import { Tabs } from '@/components/ui/Tabs'
import { TaskFormModal } from '@/components/tasks/TaskFormModal'
import { TaskItem } from '@/components/tasks/TaskItem'

interface Section {
  key: string
  title: string
  tasks: Task[]
}

function groupTasks(tasks: Task[], view: TaskView): Section[] {
  const today = todayISO()
  if (view === 'completed') return [{ key: view, title: '', tasks }]
  if (view === 'today') {
    // Mantém as concluídas de hoje visíveis (riscadas) para mostrar o progresso do dia.
    return [
      { key: 'today', title: '', tasks: tasks.filter((t) => !t.completed) },
      { key: 'done-today', title: 'Concluídas hoje', tasks: tasks.filter((t) => t.completed) },
    ].filter((s) => s.tasks.length > 0)
  }
  const sections: Section[] = [
    { key: 'overdue', title: 'Atrasadas', tasks: tasks.filter((t) => !t.completed && t.dueDate !== null && t.dueDate < today) },
    { key: 'today', title: 'Hoje', tasks: tasks.filter((t) => !t.completed && t.dueDate === today) },
    { key: 'next', title: 'Próximas', tasks: tasks.filter((t) => !t.completed && t.dueDate !== null && t.dueDate > today) },
    { key: 'nodate', title: 'Sem data', tasks: tasks.filter((t) => !t.completed && t.dueDate === null) },
    { key: 'done', title: 'Concluídas', tasks: tasks.filter((t) => t.completed) },
  ]
  return sections.filter((s) => s.tasks.length > 0)
}

const EMPTY: Record<TaskView, { title: string; description: string }> = {
  all: { title: 'Nenhuma tarefa por aqui', description: 'Crie sua primeira tarefa e comece a riscar pendências.' },
  today: { title: 'Nada para hoje 🎉', description: 'Você está com o dia livre de pendências.' },
  upcoming: { title: 'Nenhuma tarefa futura', description: 'Planeje os próximos dias adicionando tarefas com data.' },
  completed: { title: 'Nenhuma tarefa concluída', description: 'Conclua uma tarefa para ganhar seus primeiros pontos.' },
}

export default function TasksPage() {
  const { tasks, counts, status, error, isLoading, reload, addTask, updateTask, deleteTask, toggleTask } = useTasks()
  const editor = useEditor<Task>()
  useQueryAction(editor.openNew)
  const [view, setView] = useState<TaskView>('today')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('')
  const [query, setQuery] = useState('')
  const [quickTitle, setQuickTitle] = useState('')

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase()
    const today = todayISO()
    const base =
      view === 'today'
        ? [...filterTasksByView(tasks, 'today'), ...tasks.filter((t) => t.completed && (t.dueDate === today || t.completedAt?.startsWith(today)))]
        : filterTasksByView(tasks, view)
    const filtered = base.filter(
      (t) => (!category || t.category === category) && (!priority || t.priority === priority) && (!q || t.title.toLowerCase().includes(q)),
    )
    return groupTasks(filtered, view)
  }, [tasks, view, category, priority, query])

  const todayTotal = tasks.filter((t) => t.dueDate === todayISO()).length
  const todayDone = tasks.filter((t) => t.dueDate === todayISO() && t.completed).length

  const handleDelete = useCallback(
    async (task: Task) => {
      if (await confirm({ title: 'Tem certeza?', description: `A tarefa "${task.title}" será excluída.`, confirmLabel: 'Excluir' })) await deleteTask(task.id)
    },
    [deleteTask],
  )

  const quickAdd = async (event: FormEvent) => {
    event.preventDefault()
    const title = quickTitle.trim()
    if (!title) return
    const ok = await addTask({
      title,
      priority: 'medium',
      category: 'pessoal',
      dueDate: view === 'upcoming' ? null : todayISO(),
      completed: false,
    })
    if (ok) setQuickTitle('')
  }

  return (
    <>
      <PageHeader
        title="Tarefas"
        description="Tudo o que precisa ser feito, organizado por prioridade e data."
        actions={
          <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
            Nova tarefa
          </Button>
        }
      />
      {status === 'error' ? (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      ) : isLoading ? (
        <LoadingState variant="list" count={6} />
      ) : (
        <div className="grid animate-fade-in grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <Card padding="none" className="min-w-0">
            <div className="space-y-3 border-b border-line p-4 sm:p-5">
              <Tabs
                label="Visualização"
                value={view}
                onChange={setView}
                panelId="tasks-panel"
                items={[
                  { value: 'all', label: 'Todas', count: counts.all, icon: <ListTodo /> },
                  { value: 'today', label: 'Hoje', count: counts.today, icon: <Sun /> },
                  { value: 'upcoming', label: 'Próximas', count: counts.upcoming, icon: <CalendarClock /> },
                  { value: 'completed', label: 'Concluídas', count: counts.completed, icon: <CircleCheck /> },
                ]}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SearchInput value={query} onChange={setQuery} placeholder="Buscar tarefa…" />
                <Select aria-label="Filtrar por categoria" value={category} onChange={(e) => setCategory(e.target.value)} options={[{ value: '', label: 'Todas as categorias' }, ...TASK_CATEGORIES]} />
                <Select aria-label="Filtrar por prioridade" value={priority} onChange={(e) => setPriority(e.target.value)} options={[{ value: '', label: 'Todas as prioridades' }, ...TASK_PRIORITIES]} />
              </div>
            </div>

            {view !== 'completed' && (
              <form onSubmit={quickAdd} className="flex gap-2 border-b border-line px-4 py-3 sm:px-5">
                <label htmlFor="quick-task" className="sr-only">
                  Adicionar tarefa rápida
                </label>
                <Input id="quick-task" value={quickTitle} onChange={(e) => setQuickTitle(e.target.value)} placeholder="Adicionar tarefa rápida e pressionar Enter…" leftIcon={<Plus />} maxLength={100} />
                <Button type="submit" variant="soft" disabled={!quickTitle.trim()}>
                  Adicionar
                </Button>
              </form>
            )}

            <div id="tasks-panel" role="tabpanel" className="px-4 pb-2 sm:px-5">
              {sections.length === 0 ? (
                <EmptyState icon={<ListChecks />} title={EMPTY[view].title} description={query || category || priority ? 'Nenhuma tarefa corresponde aos filtros.' : EMPTY[view].description} />
              ) : (
                sections.map((section) => (
                  <section key={section.key} aria-label={section.title || undefined} className="py-2">
                    {section.title && (
                      <h2 className="flex items-center gap-2 pt-3 pb-1 text-xs font-semibold tracking-wider text-muted uppercase">
                        {section.title}
                        <span className="vo-tabular rounded-full bg-surface-2 px-1.5 text-[11px]">{section.tasks.length}</span>
                      </h2>
                    )}
                    <ul className="divide-y divide-line">
                      {section.tasks.map((task) => (
                        <li key={task.id}>
                          <TaskItem task={task} onToggle={toggleTask} onEdit={editor.openEdit} onDelete={handleDelete} />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))
              )}
            </div>
          </Card>

          <aside className="space-y-5">
            <Card>
              <h2 className="text-[15px] font-bold text-fg">Progresso de hoje</h2>
              <p className="mt-1 text-sm text-muted">
                {todayTotal === 0 ? 'Nenhuma tarefa marcada para hoje.' : `${todayDone} de ${todayTotal} tarefas concluídas`}
              </p>
              <ProgressBar value={todayTotal ? (todayDone / todayTotal) * 100 : 0} tone="success" size="md" label="Tarefas de hoje concluídas" className="mt-4" showValue />
            </Card>
            <Card>
              <h2 className="text-[15px] font-bold text-fg">Resumo</h2>
              <dl className="mt-3 space-y-2.5 text-sm">
                {[
                  ['Pendentes', counts.all - counts.completed],
                  ['Atrasadas', counts.overdue],
                  ['Concluídas', counts.completed],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <dt className="text-muted">{label}</dt>
                    <dd className="vo-tabular font-semibold text-fg">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 rounded-xl bg-primary-soft p-3 text-[13px] text-primary-ink">Cada tarefa concluída vale +10 pontos no seu nível de organização.</p>
            </Card>
          </aside>
        </div>
      )}
      <TaskFormModal open={editor.isOpen} onClose={editor.close} task={editor.editing} onSubmit={(input) => (editor.editing ? updateTask(editor.editing.id, input) : addTask(input))} />
    </>
  )
}
