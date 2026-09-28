import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDays, Trash2 } from 'lucide-react'
import type { ISODate, RoutineEvent } from '@/types'
import type { RoutineEventInput } from '@/hooks/useRoutine'
import { routineEventSchema, type RoutineEventFormOutput, type RoutineEventFormValues } from '@/lib/schemas/life'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input, Textarea } from '@/components/ui/Input'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { EVENT_STYLES } from './eventStyles'

interface RoutineEventFormModalProps {
  open: boolean
  onClose: () => void
  event?: RoutineEvent | null
  defaultDate: ISODate
  onSubmit: (input: RoutineEventInput) => Promise<boolean>
  onDelete?: (event: RoutineEvent) => Promise<boolean>
}

function EventForm({ event, defaultDate, onClose, onSubmit, onDelete }: Omit<RoutineEventFormModalProps, 'open'>) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RoutineEventFormValues, unknown, RoutineEventFormOutput>({
    resolver: zodResolver(routineEventSchema),
    defaultValues: event
      ? { title: event.title, type: event.type, date: event.date, startTime: event.startTime, endTime: event.endTime ?? '', location: event.location ?? '', notes: event.notes ?? '' }
      : { title: '', type: 'compromisso', date: defaultDate, startTime: '09:00', endTime: '10:00', location: '', notes: '' },
  })

  const submit = handleSubmit(async (values) => {
    if (await onSubmit(values)) onClose()
  })

  return (
    <form onSubmit={submit} noValidate>
      <ModalBody className="space-y-4">
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <SegmentedControl
              label="Tipo"
              value={field.value}
              onChange={field.onChange}
              options={(['compromisso', 'tarefa', 'evento'] as const).map((type) => {
                const Icon = EVENT_STYLES[type].icon
                return { value: type, label: EVENT_STYLES[type].label, icon: <Icon /> }
              })}
            />
          )}
        />
        <FormField label="Título" error={errors.title?.message} required>
          {({ id, describedBy, invalid }) => <Input id={id} placeholder="Ex.: Reunião, academia, aniversário…" autoFocus invalid={invalid} aria-describedby={describedBy} {...register('title')} />}
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Data" error={errors.date?.message} required className="sm:col-span-1">
            {({ id, describedBy, invalid }) => <Input id={id} type="date" invalid={invalid} aria-describedby={describedBy} {...register('date')} />}
          </FormField>
          <FormField label="Início" error={errors.startTime?.message} required>
            {({ id, describedBy, invalid }) => <Input id={id} type="time" invalid={invalid} aria-describedby={describedBy} {...register('startTime')} />}
          </FormField>
          <FormField label="Término" error={errors.endTime?.message}>
            {({ id, describedBy, invalid }) => <Input id={id} type="time" invalid={invalid} aria-describedby={describedBy} {...register('endTime')} />}
          </FormField>
        </div>
        <FormField label="Local" error={errors.location?.message}>
          {({ id, describedBy, invalid }) => <Input id={id} placeholder="Opcional" invalid={invalid} aria-describedby={describedBy} {...register('location')} />}
        </FormField>
        <FormField label="Observações" error={errors.notes?.message}>
          {({ id, describedBy, invalid }) => <Textarea id={id} rows={2} placeholder="Opcional" invalid={invalid} aria-describedby={describedBy} {...register('notes')} />}
        </FormField>
      </ModalBody>
      <ModalFooter className="sm:justify-between">
        {event && onDelete ? (
          <Button
            variant="ghost"
            className="text-danger-ink hover:bg-danger-soft hover:text-danger-ink"
            leftIcon={<Trash2 className="size-4" />}
            onClick={async () => {
              if (await onDelete(event)) onClose()
            }}
          >
            Excluir
          </Button>
        ) : (
          <span className="hidden sm:block" />
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {event ? 'Salvar alterações' : 'Adicionar à rotina'}
          </Button>
        </div>
      </ModalFooter>
    </form>
  )
}

export function RoutineEventFormModal(props: RoutineEventFormModalProps) {
  const { open, onClose, event } = props
  return (
    <Modal open={open} onClose={onClose} title={event ? 'Editar item da rotina' : 'Adicionar à rotina'} description="Compromissos, tarefas e eventos no seu planner." icon={<CalendarDays />}>
      <EventForm {...props} />
    </Modal>
  )
}
