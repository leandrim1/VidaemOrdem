import { useCallback, useMemo, useState } from 'react'
import { startOfMonth, subMonths } from 'date-fns'
import { ArrowDownRight, ArrowUpRight, PiggyBank, Plus, Scale, Wallet } from 'lucide-react'
import type { Transaction, TransactionType } from '@/types'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, categoryLabel, paymentMethodLabel } from '@/data/categories'
import { cn } from '@/lib/cn'
import { useEditor } from '@/hooks/useDisclosure'
import { useFinance } from '@/hooks/useFinance'
import { useQueryAction } from '@/hooks/useQueryAction'
import { confirm } from '@/stores/confirmStore'
import { expensesByCategory, summarize, transactionsInMonth } from '@/utils/finance'
import { formatDate, formatPercent } from '@/utils/format'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { AnimatedMoney, Money } from '@/components/ui/Money'
import { PageHeader } from '@/components/ui/PageHeader'
import { RowActions } from '@/components/ui/RowActions'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { StatCard } from '@/components/ui/StatCard'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States'
import { Tabs } from '@/components/ui/Tabs'
import { CategoryDonut } from '@/components/charts/CategoryDonut'
import { IncomeExpenseBarChart } from '@/components/charts/IncomeExpenseBarChart'
import { LEGEND_INCOME_EXPENSE } from '@/components/charts/chartTheme'
import { MonthSwitcher } from '@/components/finance/MonthSwitcher'
import { TransactionFormModal } from '@/components/finance/TransactionFormModal'
import { TransactionIcon } from '@/components/finance/TransactionIcon'

type TypeFilter = 'all' | TransactionType

function delta(current: number, previous: number) {
  if (previous === 0) return undefined
  return ((current - previous) / Math.abs(previous)) * 100
}

export default function FinancePage() {
  const { transactions, series, status, error, isLoading, reload, addTransaction, updateTransaction, deleteTransaction } = useFinance()
  const editor = useEditor<Transaction>()
  useQueryAction(editor.openNew)

  const [month, setMonth] = useState(() => startOfMonth(new Date()))
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [category, setCategory] = useState('')
  const [query, setQuery] = useState('')

  const monthTransactions = useMemo(() => transactionsInMonth(transactions, month), [transactions, month])
  const summary = useMemo(() => summarize(monthTransactions), [monthTransactions])
  const previous = useMemo(() => summarize(transactionsInMonth(transactions, subMonths(month, 1))), [transactions, month])
  const categories = useMemo(() => expensesByCategory(monthTransactions), [monthTransactions])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return monthTransactions.filter(
      (t) =>
        (typeFilter === 'all' || t.type === typeFilter) &&
        (!category || t.category === category) &&
        (!q || t.description.toLowerCase().includes(q) || categoryLabel(t.category).toLowerCase().includes(q)),
    )
  }, [monthTransactions, typeFilter, category, query])

  const handleDelete = useCallback(
    async (transaction: Transaction) => {
      const ok = await confirm({
        title: 'Tem certeza?',
        description: `A movimentação "${transaction.description}" será excluída permanentemente.`,
        confirmLabel: 'Excluir',
      })
      if (ok) await deleteTransaction(transaction.id)
    },
    [deleteTransaction],
  )

  const columns = useMemo<Column<Transaction>[]>(
    () => [
      {
        key: 'description',
        header: 'Descrição',
        sortValue: (t) => t.description,
        cell: (t) => (
          <div className="flex items-center gap-3">
            <TransactionIcon transaction={t} />
            <div className="min-w-0">
              <p className="truncate font-semibold text-fg">{t.description}</p>
              <p className="text-xs text-muted xl:hidden">{categoryLabel(t.category)}</p>
            </div>
          </div>
        ),
      },
      { key: 'category', header: 'Categoria', hideBelow: 'xl', sortValue: (t) => categoryLabel(t.category), cell: (t) => categoryLabel(t.category) },
      { key: 'date', header: 'Data', sortValue: (t) => t.date, cell: (t) => <span className="vo-tabular">{formatDate(t.date, 'dd/MM/yyyy')}</span> },
      { key: 'payment', header: 'Pagamento', hideBelow: 'lg', cell: (t) => paymentMethodLabel(t.paymentMethod) },
      {
        key: 'amount',
        header: 'Valor',
        align: 'right',
        sortValue: (t) => (t.type === 'income' ? t.amount : -t.amount),
        cell: (t) => <Money value={t.type === 'income' ? t.amount : -t.amount} signed className={cn('font-semibold', t.type === 'income' ? 'text-success-ink' : 'text-fg')} />,
      },
      {
        key: 'actions',
        header: 'Ações',
        align: 'right',
        className: 'w-16',
        cell: (t) => <RowActions label={t.description} onEdit={() => editor.openEdit(t)} onDelete={() => void handleDelete(t)} />,
      },
    ],
    [editor.openEdit, handleDelete],
  )

  const categoryOptions = typeFilter === 'income' ? INCOME_CATEGORIES : typeFilter === 'expense' ? EXPENSE_CATEGORIES : [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES.filter((c) => c.value !== 'outros')]

  const header = (
    <PageHeader
      title="Finanças"
      description="Acompanhe receitas, despesas e para onde vai o seu dinheiro."
      actions={
        <>
          <MonthSwitcher month={month} onChange={setMonth} min={startOfMonth(subMonths(new Date(), 11))} />
          <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
            Adicionar movimentação
          </Button>
        </>
      }
    />
  )

  if (status === 'error') {
    return (
      <>
        {header}
        <ErrorState message={error ?? undefined} onRetry={reload} />
      </>
    )
  }

  return (
    <>
      {header}
      {isLoading ? (
        <LoadingState variant="page" />
      ) : (
        <div className="animate-fade-in space-y-5">
          <div className="vo-stagger grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <StatCard label="Receitas" value={<AnimatedMoney value={summary.income} />} icon={<ArrowUpRight />} tone="success" delta={delta(summary.income, previous.income) !== undefined ? { value: delta(summary.income, previous.income) ?? 0, label: 'vs. mês anterior' } : undefined} />
            <StatCard label="Despesas" value={<AnimatedMoney value={summary.expense} />} icon={<ArrowDownRight />} tone="danger" delta={delta(summary.expense, previous.expense) !== undefined ? { value: delta(summary.expense, previous.expense) ?? 0, label: 'vs. mês anterior', positiveIsGood: false } : undefined} />
            <StatCard label="Saldo" value={<AnimatedMoney value={summary.balance} />} icon={<Scale />} tone="primary" footer={summary.balance >= 0 ? 'Mês no azul' : 'Atenção: mês no vermelho'} />
            <StatCard label="Economia" value={formatPercent(summary.savingsRate)} icon={<PiggyBank />} tone="warning" footer="da receita guardada" />
          </div>

          <div className="vo-stagger grid grid-cols-1 gap-5 xl:grid-cols-2">
            <ChartCard title="Despesas por categoria" description="Distribuição dos gastos no mês">
              {categories.length === 0 ? (
                <EmptyState compact icon={<Wallet />} title="Sem despesas no mês" description="Suas despesas aparecerão aqui por categoria." />
              ) : (
                <CategoryDonut data={categories} total={summary.expense} />
              )}
            </ChartCard>
            <ChartCard
              title="Evolução mensal"
              description="Receitas e despesas dos últimos 6 meses"
              legend={LEGEND_INCOME_EXPENSE}
              summary={series.map((p) => `${p.label}: receitas ${p.income}, despesas ${p.expense}`).join('; ')}
            >
              <IncomeExpenseBarChart data={series} />
            </ChartCard>
          </div>

          <Card padding="none">
            <div className="p-5 pb-4 sm:p-6 sm:pb-4">
              <CardHeader title="Últimas movimentações" description={`${filtered.length} movimentaç${filtered.length === 1 ? 'ão' : 'ões'} no período`} className="mb-4" />
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <Tabs
                  label="Filtrar por tipo"
                  value={typeFilter}
                  onChange={(value) => {
                    setTypeFilter(value)
                    setCategory('')
                  }}
                  items={[
                    { value: 'all', label: 'Todas' },
                    { value: 'income', label: 'Receitas' },
                    { value: 'expense', label: 'Despesas' },
                  ]}
                />
                <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:ml-auto lg:max-w-xl">
                  <SearchInput value={query} onChange={setQuery} placeholder="Buscar movimentação…" />
                  <Select aria-label="Filtrar por categoria" value={category} onChange={(e) => setCategory(e.target.value)} options={[{ value: '', label: 'Todas as categorias' }, ...categoryOptions]} />
                </div>
              </div>
            </div>
            <div className="border-t border-line">
              <DataTable
                caption="Movimentações do mês"
                columns={columns}
                rows={filtered}
                getRowId={(t) => t.id}
                pageSize={10}
                initialSort={{ key: 'date', direction: 'desc' }}
                mobileCard={(t) => (
                  <div className="flex items-center gap-3">
                    <TransactionIcon transaction={t} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg">{t.description}</p>
                      <p className="text-xs text-muted">
                        {categoryLabel(t.category)} · {formatDate(t.date, 'dd/MM')}
                      </p>
                    </div>
                    <Money value={t.type === 'income' ? t.amount : -t.amount} signed className={cn('text-sm font-semibold', t.type === 'income' ? 'text-success-ink' : 'text-fg')} />
                    <RowActions label={t.description} onEdit={() => editor.openEdit(t)} onDelete={() => void handleDelete(t)} />
                  </div>
                )}
                empty={
                  <EmptyState
                    icon={<Wallet />}
                    title={monthTransactions.length === 0 ? 'Nenhuma movimentação neste mês' : 'Nada encontrado'}
                    description={monthTransactions.length === 0 ? 'Registre sua primeira receita ou despesa para começar.' : 'Tente ajustar a busca ou os filtros.'}
                    action={
                      monthTransactions.length === 0 && (
                        <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
                          Adicionar movimentação
                        </Button>
                      )
                    }
                  />
                }
              />
            </div>
          </Card>
        </div>
      )}

      <TransactionFormModal
        open={editor.isOpen}
        onClose={editor.close}
        transaction={editor.editing}
        onSubmit={(input) => (editor.editing ? updateTransaction(editor.editing.id, input) : addTransaction(input))}
      />
    </>
  )
}
