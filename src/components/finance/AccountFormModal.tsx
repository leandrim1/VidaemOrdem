import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Receipt } from 'lucide-react'
import type { Account } from '@/types'
import type { AccountInput } from '@/hooks/useAccounts'
import { ACCOUNT_CATEGORIES } from '@/data/categories'
import { accountSchema, type AccountFormOutput, type AccountFormValues } from '@/lib/schemas/finance'
import { daysFromToday, todayISO } from '@/utils/date'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import { FormField } from '@/components/ui/FormField'
import { Input, Textarea } from '@/components/ui/Input'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Select } from '@/components/ui/Select'

interface AccountFormModalProps {
  open: boolean
  onClose: () => void
  account?: Account | null
  onSubmit: (input: AccountInput) => Promise<boolean>
}

function AccountForm({ account, onClose, onSubmit }: Omit<AccountFormModalProps, 'open'>) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues, unknown, AccountFormOutput>({
    resolver: zodResolver(accountSchema),
    defaultValues: account
      ? { name: account.name, category: account.category, dueDate: account.dueDate, amount: account.amount, status: account.status === 'paid' ? 'paid' : 'pending', recurring: account.recurring, notes: account.notes ?? '' }
      : { name: '', category: 'moradia', dueDate: daysFromToday(7), amount: 0, status: 'pending', recurring: true, notes: '' },
  })

  const submit = handleSubmit(async (values) => {
    const input: AccountInput = { ...values, paidAt: values.status === 'paid' ? (account?.paidAt ?? todayISO()) : undefined }
    if (await onSubmit(input)) onClose()
  })

  return (
    <form onSubmit={submit} noValidate>
      <ModalBody className="space-y-4">
        <FormField label="Nome da conta" error={errors.name?.message} required>
          {({ id, describedBy, invalid }) => <Input id={id} placeholder="Ex.: Conta de luz" autoFocus invalid={invalid} aria-describedby={describedBy} {...register('name')} />}
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Categoria" error={errors.category?.message} required>
            {({ id, describedBy, invalid }) => <Select id={id} options={ACCOUNT_CATEGORIES} invalid={invalid} aria-describedby={describedBy} {...register('category')} />}
          </FormField>
          <FormField label="Valor" error={errors.amount?.message} required>
            {({ id, describedBy, invalid }) => (
              <Controller control={control} name="amount" render={({ field }) => <CurrencyInput id={id} value={field.value} onChange={field.onChange} onBlur={field.onBlur} invalid={invalid} aria-describedby={describedBy} />} />
            )}
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Vencimento" error={errors.dueDate?.message} required>
            {({ id, describedBy, invalid }) => <Input id={id} type="date" invalid={invalid} aria-describedby={describedBy} {...register('dueDate')} />}
          </FormField>
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-fg-soft">Status</span>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <SegmentedControl
                  label="Status da conta"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: 'pending', label: 'Pendente', activeClassName: 'text-warning-ink' },
                    { value: 'paid', label: 'Pago', activeClassName: 'text-success-ink' },
                  ]}
                />
              )}
            />
          </div>
        </div>
        <Controller
          control={control}
          name="recurring"
          render={({ field }) => (
            <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} label="Conta recorrente" description="Repete todo mês (aluguel, energia, internet…)." />
          )}
        />
        <FormField label="Observações" error={errors.notes?.message}>
          {({ id, describedBy, invalid }) => <Textarea id={id} rows={2} placeholder="Opcional" invalid={invalid} aria-describedby={describedBy} {...register('notes')} />}
        </FormField>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {account ? 'Salvar alterações' : 'Adicionar conta'}
        </Button>
      </ModalFooter>
    </form>
  )
}

export function AccountFormModal({ open, onClose, account, onSubmit }: AccountFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={account ? 'Editar conta' : 'Adicionar conta'} description="Cadastre boletos e faturas para não perder nenhum vencimento." icon={<Receipt />}>
      <AccountForm account={account} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  )
}
