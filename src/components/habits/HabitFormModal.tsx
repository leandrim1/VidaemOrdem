import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Flame } from 'lucide-react'
import type { Habit, HabitIcon } from '@/types'
import type { HabitInput } from '@/hooks/useHabits'
import { cn } from '@/lib/cn'
import { habitSchema, type HabitFormValues } from '@/lib/schemas/life'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { HABIT_ICONS } from './icons'

interface HabitFormModalProps {
  open: boolean
  onClose: () => void
  habit?: Habit | null
  onSubmit: (input: HabitInput) => Promise<boolean>
}

function HabitForm({ habit, onClose, onSubmit }: Omit<HabitFormModalProps, 'open'>) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormValues>({
    resolver: zodResolver(habitSchema),
    defaultValues: habit ? { name: habit.name, icon: habit.icon, targetPerWeek: habit.targetPerWeek } : { name: '', icon: 'book', targetPerWeek: 5 },
  })

  const submit = handleSubmit(async (values) => {
    if (await onSubmit({ ...values, archived: habit?.archived ?? false })) onClose()
  })

  return (
    <form onSubmit={submit} noValidate>
      <ModalBody className="space-y-5">
        <FormField label="Nome do hábito" error={errors.name?.message} required>
          {({ id, describedBy, invalid }) => <Input id={id} placeholder="Ex.: Ler 20 minutos" autoFocus invalid={invalid} aria-describedby={describedBy} {...register('name')} />}
        </FormField>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-fg-soft">Ícone</legend>
          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <div role="radiogroup" aria-label="Ícone do hábito" className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {(Object.keys(HABIT_ICONS) as HabitIcon[]).map((key) => {
                  const { icon: Icon, label } = HABIT_ICONS[key]
                  const checked = field.value === key
                  return (
                    <label
                      key={key}
                      title={label}
                      className={cn(
                        'flex aspect-square cursor-pointer items-center justify-center rounded-xl border transition-colors has-focus-visible:ring-2 has-focus-visible:ring-primary',
                        checked ? 'border-primary bg-primary text-white' : 'border-line text-fg-soft hover:border-line-strong hover:text-fg',
                      )}
                    >
                      <input type="radio" name="habit-icon" value={key} checked={checked} onChange={() => field.onChange(key)} className="sr-only" aria-label={label} />
                      <Icon className="size-5" aria-hidden />
                    </label>
                  )
                })}
              </div>
            )}
          />
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-fg-soft">Meta semanal</legend>
          <Controller
            control={control}
            name="targetPerWeek"
            render={({ field }) => (
              <div role="radiogroup" aria-label="Vezes por semana" className="grid grid-cols-7 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                  <label
                    key={n}
                    className={cn(
                      'vo-tabular flex h-10 cursor-pointer items-center justify-center rounded-lg border text-sm font-semibold transition-colors has-focus-visible:ring-2 has-focus-visible:ring-primary',
                      field.value === n ? 'border-primary bg-primary-soft text-primary-ink' : 'border-line text-fg-soft hover:border-line-strong',
                    )}
                  >
                    <input type="radio" name="habit-target" value={n} checked={field.value === n} onChange={() => field.onChange(n)} className="sr-only" aria-label={`${n} vez${n > 1 ? 'es' : ''} por semana`} />
                    {n}×
                  </label>
                ))}
              </div>
            )}
          />
          <p className="mt-2 text-[13px] text-muted">Quantas vezes por semana você quer praticar este hábito.</p>
        </fieldset>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {habit ? 'Salvar alterações' : 'Criar hábito'}
        </Button>
      </ModalFooter>
    </form>
  )
}

export function HabitFormModal({ open, onClose, habit, onSubmit }: HabitFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={habit ? 'Editar hábito' : 'Novo hábito'} description="Pequenas ações repetidas criam grandes mudanças." icon={<Flame />}>
      <HabitForm habit={habit} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  )
}
