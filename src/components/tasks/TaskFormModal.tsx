import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ListChecks } from 'lucide-react'
import type { Task } from '@/types'
import type { TaskInput } from '@/hooks/useTasks'
import { TASK_CATEGORIES, TASK_PRIORITIES } from '@/data/categories'
import { taskSchema, type TaskFormOutput, type TaskFormValues } from '@/lib/schemas/life'
import { todayISO } from '@/utils/date'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input, Textarea } from '@/components/ui/Input'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'

interface TaskFormModalProps {
  open: boolean
  onClose: () => void
  task?: Task | null
  onSubmit: (input: TaskInput) => Promise<boolean>
}

function TaskForm({ task, onClose, onSubmit }: Omit<TaskFormModalProps, 'open'>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues, unknown, TaskFormOutput>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? { title: task.title, description: task.description ?? '', priority: task.priority, category: task.category, dueDate: task.dueDate ?? '' }
      : { title: '', description: '', priority: 'medium', category: 'pessoal', dueDate: todayISO() },
  })

  const submit = handleSubmit(async (values) => {
    const input: TaskInput = {
      title: values.title,
      description: values.description,
      priority: values.priority,
      category: values.category,
      dueDate: values.dueDate ?? null,
      completed: task?.completed ?? false,
      completedAt: task?.completedAt,
    }
    if (await onSubmit(input)) onClose()
  })

  return (
    <form onSubmit={submit} noValidate>
      <ModalBody className="space-y-4">
        <FormField label="Título" error={errors.title?.message} required>
          {({ id, describedBy, invalid }) => <Input id={id} placeholder="O que precisa ser feito?" data-autofocus invalid={invalid} aria-describedby={describedBy} {...register('title')} />}
        </FormField>
        <FormField label="Descrição" error={errors.description?.message}>
          {({ id, describedBy, invalid }) => <Textarea id={id} rows={2} placeholder="Detalhes (opcional)" invalid={invalid} aria-describedby={describedBy} {...register('description')} />}
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Prioridade" error={errors.priority?.message}>
            {({ id, describedBy }) => <Select id={id} options={TASK_PRIORITIES} aria-describedby={describedBy} {...register('priority')} />}
          </FormField>
          <FormField label="Categoria" error={errors.category?.message}>
            {({ id, describedBy }) => <Select id={id} options={TASK_CATEGORIES} aria-describedby={describedBy} {...register('category')} />}
          </FormField>
          <FormField label="Data" error={errors.dueDate?.message}>
            {({ id, describedBy, invalid }) => <Input id={id} type="date" invalid={invalid} aria-describedby={describedBy} {...register('dueDate')} />}
          </FormField>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {task ? 'Salvar alterações' : 'Criar tarefa'}
        </Button>
      </ModalFooter>
    </form>
  )
}

export function TaskFormModal({ open, onClose, task, onSubmit }: TaskFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={task ? 'Editar tarefa' : 'Nova tarefa'} icon={<ListChecks />}>
      <TaskForm task={task} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  )
}
