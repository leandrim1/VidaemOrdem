import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Target } from 'lucide-react'
import type { Goal } from '@/types'
import type { GoalInput } from '@/hooks/useGoals'
import { GOAL_CATEGORIES } from '@/data/categories'
import { goalSchema, type GoalFormValues } from '@/lib/schemas/life'
import { daysFromToday, todayISO } from '@/utils/date'
import { Button } from '@/components/ui/Button'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'

interface GoalFormModalProps {
  open: boolean
  onClose: () => void
  goal?: Goal | null
  onSubmit: (input: GoalInput) => Promise<boolean>
}

function GoalForm({ goal, onClose, onSubmit }: Omit<GoalFormModalProps, 'open'>) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: goal
      ? { name: goal.name, category: goal.category, targetAmount: goal.targetAmount, currentAmount: goal.currentAmount, deadline: goal.deadline }
      : { name: '', category: 'financeira', targetAmount: 0, currentAmount: 0, deadline: daysFromToday(180) },
  })

  const submit = handleSubmit(async (values) => {
    const completedAt = values.currentAmount >= values.targetAmount ? (goal?.completedAt ?? todayISO()) : undefined
    if (await onSubmit({ ...values, completedAt })) onClose()
  })

  return (
    <form onSubmit={submit} noValidate>
      <ModalBody className="space-y-4">
        <FormField label="Nome da meta" error={errors.name?.message} required>
          {({ id, describedBy, invalid }) => <Input id={id} placeholder="Ex.: Reserva de emergência" autoFocus invalid={invalid} aria-describedby={describedBy} {...register('name')} />}
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Categoria" error={errors.category?.message}>
            {({ id, describedBy }) => <Select id={id} options={GOAL_CATEGORIES} aria-describedby={describedBy} {...register('category')} />}
          </FormField>
          <FormField label="Prazo" error={errors.deadline?.message} required>
            {({ id, describedBy, invalid }) => <Input id={id} type="date" invalid={invalid} aria-describedby={describedBy} {...register('deadline')} />}
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Valor objetivo" error={errors.targetAmount?.message} required>
            {({ id, describedBy, invalid }) => (
              <Controller control={control} name="targetAmount" render={({ field }) => <CurrencyInput id={id} value={field.value} onChange={field.onChange} invalid={invalid} aria-describedby={describedBy} />} />
            )}
          </FormField>
          <FormField label="Valor atual" error={errors.currentAmount?.message} hint="Quanto você já guardou">
            {({ id, describedBy, invalid }) => (
              <Controller control={control} name="currentAmount" render={({ field }) => <CurrencyInput id={id} value={field.value} onChange={field.onChange} invalid={invalid} aria-describedby={describedBy} />} />
            )}
          </FormField>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {goal ? 'Salvar alterações' : 'Criar meta'}
        </Button>
      </ModalFooter>
    </form>
  )
}

export function GoalFormModal({ open, onClose, goal, onSubmit }: GoalFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={goal ? 'Editar meta' : 'Nova meta'} description="Metas com valor e prazo têm muito mais chance de acontecer." icon={<Target />}>
      <GoalForm goal={goal} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  )
}
