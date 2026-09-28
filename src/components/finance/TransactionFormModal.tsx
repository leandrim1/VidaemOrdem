import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'
import type { Transaction } from '@/types'
import type { TransactionInput } from '@/hooks/useFinance'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS } from '@/data/categories'
import { transactionSchema, type TransactionFormValues } from '@/lib/schemas/finance'
import { todayISO } from '@/utils/date'
import { Button } from '@/components/ui/Button'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Select } from '@/components/ui/Select'

interface TransactionFormModalProps {
  open: boolean
  onClose: () => void
  transaction?: Transaction | null
  onSubmit: (input: TransactionInput) => Promise<boolean>
}

function TransactionForm({ transaction, onClose, onSubmit }: Omit<TransactionFormModalProps, 'open'>) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? { type: transaction.type, description: transaction.description, amount: transaction.amount, date: transaction.date, category: transaction.category, paymentMethod: transaction.paymentMethod }
      : { type: 'expense', description: '', amount: 0, date: todayISO(), category: 'alimentacao', paymentMethod: 'pix' },
  })
  const type = useWatch({ control, name: 'type' })
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

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
              label="Tipo de movimentação"
              value={field.value}
              onChange={(value) => {
                field.onChange(value)
                setValue('category', value === 'income' ? 'salario' : 'alimentacao')
              }}
              options={[
                { value: 'expense', label: 'Despesa', icon: <ArrowDownRight />, activeClassName: 'text-danger-ink' },
                { value: 'income', label: 'Receita', icon: <ArrowUpRight />, activeClassName: 'text-success-ink' },
              ]}
            />
          )}
        />
        <FormField label="Descrição" error={errors.description?.message} required>
          {({ id, describedBy, invalid }) => (
            <Input id={id} placeholder={type === 'income' ? 'Ex.: Salário' : 'Ex.: Supermercado'} invalid={invalid} aria-describedby={describedBy} data-autofocus {...register('description')} />
          )}
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Valor" error={errors.amount?.message} required>
            {({ id, describedBy, invalid }) => (
              <Controller
                control={control}
                name="amount"
                render={({ field }) => <CurrencyInput id={id} value={field.value} onChange={field.onChange} onBlur={field.onBlur} invalid={invalid} aria-describedby={describedBy} />}
              />
            )}
          </FormField>
          <FormField label="Data" error={errors.date?.message} required>
            {({ id, describedBy, invalid }) => <Input id={id} type="date" invalid={invalid} aria-describedby={describedBy} {...register('date')} />}
          </FormField>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Categoria" error={errors.category?.message} required>
            {({ id, describedBy, invalid }) => <Select id={id} options={categories} invalid={invalid} aria-describedby={describedBy} {...register('category')} />}
          </FormField>
          <FormField label="Forma de pagamento" error={errors.paymentMethod?.message} required>
            {({ id, describedBy, invalid }) => <Select id={id} options={PAYMENT_METHODS} invalid={invalid} aria-describedby={describedBy} {...register('paymentMethod')} />}
          </FormField>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {transaction ? 'Salvar alterações' : 'Adicionar movimentação'}
        </Button>
      </ModalFooter>
    </form>
  )
}

export function TransactionFormModal({ open, onClose, transaction, onSubmit }: TransactionFormModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={transaction ? 'Editar movimentação' : 'Adicionar movimentação'}
      description="Registre receitas e despesas para acompanhar seu mês."
      icon={<Wallet />}
    >
      <TransactionForm transaction={transaction} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  )
}
