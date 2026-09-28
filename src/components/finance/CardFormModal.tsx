import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, CreditCard as CreditCardIcon } from 'lucide-react'
import type { CreditCard } from '@/types'
import type { CardInput } from '@/hooks/useCards'
import { CARD_COLORS } from '@/data/mockCards'
import { cn } from '@/lib/cn'
import { cardSchema, type CardFormValues } from '@/lib/schemas/finance'
import { Button } from '@/components/ui/Button'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { CreditCardVisual } from './CreditCardVisual'

interface CardFormModalProps {
  open: boolean
  onClose: () => void
  card?: CreditCard | null
  onSubmit: (input: CardInput) => Promise<boolean>
}

const BRANDS = [
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'visa', label: 'Visa' },
  { value: 'elo', label: 'Elo' },
  { value: 'amex', label: 'American Express' },
  { value: 'hipercard', label: 'Hipercard' },
]

function CardForm({ card, onClose, onSubmit }: Omit<CardFormModalProps, 'open'>) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: card
      ? { name: card.name, bank: card.bank, brand: card.brand, lastDigits: card.lastDigits, limit: card.limit, used: card.used, closingDay: card.closingDay, dueDay: card.dueDay, color: card.color }
      : { name: '', bank: '', brand: 'mastercard', lastDigits: '', limit: 0, used: 0, closingDay: 1, dueDay: 10, color: CARD_COLORS[3] },
  })
  const preview = useWatch({ control })

  const submit = handleSubmit(async (values) => {
    if (await onSubmit(values)) onClose()
  })

  return (
    <form onSubmit={submit} noValidate>
      <ModalBody className="grid grid-cols-1 gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
        <div className="space-y-4">
          <CreditCardVisual
            card={{
              name: preview.name || 'Nome do cartão',
              bank: preview.bank || 'Banco',
              brand: preview.brand ?? 'mastercard',
              lastDigits: preview.lastDigits || '0000',
              color: preview.color ?? CARD_COLORS[0],
            }}
          />
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-fg-soft">Cor</legend>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {CARD_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => field.onChange(color)}
                      aria-label={`Cor ${color}`}
                      aria-pressed={field.value === color}
                      className={cn('flex size-8 items-center justify-center rounded-full ring-offset-2 ring-offset-surface transition', field.value === color && 'ring-2 ring-primary')}
                      style={{ backgroundColor: color }}
                    >
                      {field.value === color && <Check className="size-4 text-white" aria-hidden />}
                    </button>
                  ))}
                </div>
              )}
            />
          </fieldset>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Nome do cartão" error={errors.name?.message} required>
              {({ id, describedBy, invalid }) => <Input id={id} placeholder="Ex.: Platinum" autoFocus invalid={invalid} aria-describedby={describedBy} {...register('name')} />}
            </FormField>
            <FormField label="Banco" error={errors.bank?.message} required>
              {({ id, describedBy, invalid }) => <Input id={id} placeholder="Ex.: Nubank" invalid={invalid} aria-describedby={describedBy} {...register('bank')} />}
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Bandeira" error={errors.brand?.message}>
              {({ id, describedBy }) => <Select id={id} options={BRANDS} aria-describedby={describedBy} {...register('brand')} />}
            </FormField>
            <FormField label="Últimos 4 dígitos" error={errors.lastDigits?.message} required>
              {({ id, describedBy, invalid }) => <Input id={id} inputMode="numeric" maxLength={4} placeholder="0000" invalid={invalid} aria-describedby={describedBy} {...register('lastDigits')} />}
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label="Limite" error={errors.limit?.message} required>
              {({ id, describedBy, invalid }) => (
                <Controller control={control} name="limit" render={({ field }) => <CurrencyInput id={id} value={field.value} onChange={field.onChange} invalid={invalid} aria-describedby={describedBy} />} />
              )}
            </FormField>
            <FormField label="Utilizado" error={errors.used?.message}>
              {({ id, describedBy, invalid }) => (
                <Controller control={control} name="used" render={({ field }) => <CurrencyInput id={id} value={field.value} onChange={field.onChange} invalid={invalid} aria-describedby={describedBy} />} />
              )}
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Dia do fechamento" error={errors.closingDay?.message}>
              {({ id, describedBy, invalid }) => <Input id={id} type="number" min={1} max={31} invalid={invalid} aria-describedby={describedBy} {...register('closingDay', { valueAsNumber: true })} />}
            </FormField>
            <FormField label="Dia do vencimento" error={errors.dueDay?.message}>
              {({ id, describedBy, invalid }) => <Input id={id} type="number" min={1} max={31} invalid={invalid} aria-describedby={describedBy} {...register('dueDay', { valueAsNumber: true })} />}
            </FormField>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {card ? 'Salvar alterações' : 'Adicionar cartão'}
        </Button>
      </ModalFooter>
    </form>
  )
}

export function CardFormModal({ open, onClose, card, onSubmit }: CardFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="lg" title={card ? 'Editar cartão' : 'Adicionar cartão'} description="Acompanhe limite, fatura e datas importantes." icon={<CreditCardIcon />}>
      <CardForm card={card} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  )
}
