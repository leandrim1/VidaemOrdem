import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Repeat } from 'lucide-react'
import type { Subscription } from '@/types'
import type { SubscriptionInput } from '@/hooks/useSubscriptions'
import { SUBSCRIPTION_CATEGORIES, SUBSCRIPTION_FREQUENCIES } from '@/data/categories'
import { subscriptionSchema, type SubscriptionFormValues } from '@/lib/schemas/finance'
import { daysFromToday } from '@/utils/date'
import { Button } from '@/components/ui/Button'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'

interface SubscriptionFormModalProps {
  open: boolean
  onClose: () => void
  subscription?: Subscription | null
  onSubmit: (input: SubscriptionInput) => Promise<boolean>
}

function SubscriptionForm({ subscription, onClose, onSubmit }: Omit<SubscriptionFormModalProps, 'open'>) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: subscription
      ? { name: subscription.name, amount: subscription.amount, frequency: subscription.frequency, nextBillingDate: subscription.nextBillingDate, category: subscription.category, active: subscription.active }
      : { name: '', amount: 0, frequency: 'mensal', nextBillingDate: daysFromToday(30), category: 'streaming', active: true },
  })

  const submit = handleSubmit(async (values) => {
    if (await onSubmit(values)) onClose()
  })

  return (
    <form onSubmit={submit} noValidate>
      <ModalBody className="space-y-4">
        <FormField label="Nome" error={errors.name?.message} required>
          {({ id, describedBy, invalid }) => <Input id={id} placeholder="Ex.: Netflix" autoFocus invalid={invalid} aria-describedby={describedBy} {...register('name')} />}
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Valor" error={errors.amount?.message} required>
            {({ id, describedBy, invalid }) => (
              <Controller control={control} name="amount" render={({ field }) => <CurrencyInput id={id} value={field.value} onChange={field.onChange} invalid={invalid} aria-describedby={describedBy} />} />
            )}
          </FormField>
          <FormField label="Frequência" error={errors.frequency?.message}>
            {({ id, describedBy }) => <Select id={id} options={SUBSCRIPTION_FREQUENCIES} aria-describedby={describedBy} {...register('frequency')} />}
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Próxima cobrança" error={errors.nextBillingDate?.message} required>
            {({ id, describedBy, invalid }) => <Input id={id} type="date" invalid={invalid} aria-describedby={describedBy} {...register('nextBillingDate')} />}
          </FormField>
          <FormField label="Categoria" error={errors.category?.message}>
            {({ id, describedBy }) => <Select id={id} options={SUBSCRIPTION_CATEGORIES} aria-describedby={describedBy} {...register('category')} />}
          </FormField>
        </div>
        <Controller
          control={control}
          name="active"
          render={({ field }) => <Switch checked={field.value} onChange={field.onChange} label="Assinatura ativa" description="Assinaturas pausadas não entram no total mensal." />}
        />
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {subscription ? 'Salvar alterações' : 'Adicionar assinatura'}
        </Button>
      </ModalFooter>
    </form>
  )
}

export function SubscriptionFormModal({ open, onClose, subscription, onSubmit }: SubscriptionFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={subscription ? 'Editar assinatura' : 'Adicionar assinatura'} description="Serviços recorrentes que você paga." icon={<Repeat />}>
      <SubscriptionForm subscription={subscription} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  )
}
