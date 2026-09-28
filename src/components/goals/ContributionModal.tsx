import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, PiggyBank, Plus } from 'lucide-react'
import type { Goal } from '@/types'
import { contributionSchema, type ContributionValues } from '@/lib/schemas/life'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/Button'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import { FormField } from '@/components/ui/FormField'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { SegmentedControl } from '@/components/ui/SegmentedControl'

interface ContributionModalProps {
  goal: Goal | null
  onClose: () => void
  onSubmit: (goal: Goal, amount: number) => Promise<boolean>
}

function ContributionForm({ goal, onClose, onSubmit }: { goal: Goal; onClose: () => void; onSubmit: ContributionModalProps['onSubmit'] }) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContributionValues>({ resolver: zodResolver(contributionSchema), defaultValues: { mode: 'add', amount: 0 } })
  const mode = useWatch({ control, name: 'mode' })
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)

  const submit = handleSubmit(async ({ mode, amount }) => {
    if (mode === 'withdraw' && amount > goal.currentAmount) {
      setError('amount', { message: `Você pode retirar no máximo ${formatCurrency(goal.currentAmount)}.` })
      return
    }
    if (await onSubmit(goal, mode === 'add' ? amount : -amount)) onClose()
  })

  return (
    <form onSubmit={submit} noValidate>
      <ModalBody className="space-y-4">
        <div className="rounded-xl bg-surface-2/70 p-4 text-sm">
          <p className="text-muted">Guardado até agora</p>
          <p className="mt-0.5 font-display text-xl font-bold text-fg">
            {formatCurrency(goal.currentAmount)} <span className="text-sm font-medium text-muted">de {formatCurrency(goal.targetAmount)}</span>
          </p>
          {remaining > 0 && <p className="mt-1 text-[13px] text-muted">Faltam {formatCurrency(remaining)} para concluir.</p>}
        </div>
        <Controller
          control={control}
          name="mode"
          render={({ field }) => (
            <SegmentedControl
              label="Tipo de movimentação"
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: 'add', label: 'Guardar', icon: <Plus />, activeClassName: 'text-success-ink' },
                { value: 'withdraw', label: 'Retirar', icon: <Minus />, activeClassName: 'text-danger-ink' },
              ]}
            />
          )}
        />
        <FormField label="Valor" error={errors.amount?.message} required>
          {({ id, describedBy, invalid }) => (
            <Controller control={control} name="amount" render={({ field }) => <CurrencyInput id={id} value={field.value} onChange={field.onChange} invalid={invalid} aria-describedby={describedBy} autoFocus />} />
          )}
        </FormField>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant={mode === 'add' ? 'primary' : 'danger'} loading={isSubmitting}>
          {mode === 'add' ? 'Guardar valor' : 'Retirar valor'}
        </Button>
      </ModalFooter>
    </form>
  )
}

export function ContributionModal({ goal, onClose, onSubmit }: ContributionModalProps) {
  return (
    <Modal open={goal !== null} onClose={onClose} size="sm" title={goal ? goal.name : 'Meta'} description="Atualize quanto você já guardou." icon={<PiggyBank />}>
      {goal && <ContributionForm goal={goal} onClose={onClose} onSubmit={onSubmit} />}
    </Modal>
  )
}
