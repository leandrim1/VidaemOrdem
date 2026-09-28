import { useCallback, useMemo, useState } from 'react'
import { CircleAlert, CircleCheck, Clock, Plus, Receipt, Repeat, RotateCcw } from 'lucide-react'
import type { AccountStatus } from '@/types'
import { ACCOUNT_CATEGORIES, accountCategoryLabel } from '@/data/categories'
import { cn } from '@/lib/cn'
import { useAccounts, type AccountWithStatus } from '@/hooks/useAccounts'
import { useEditor } from '@/hooks/useDisclosure'
import { useQueryAction } from '@/hooks/useQueryAction'
import { confirm } from '@/stores/confirmStore'
import { formatDate, formatRelativeDay } from '@/utils/format'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Money } from '@/components/ui/Money'
import { PageHeader } from '@/components/ui/PageHeader'
import { RowActions } from '@/components/ui/RowActions'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { StatCard } from '@/components/ui/StatCard'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States'
import { Tabs } from '@/components/ui/Tabs'
import { AccountFormModal } from '@/components/finance/AccountFormModal'
import { AccountStatusBadge } from '@/components/finance/AccountStatusBadge'
import { ACCOUNT_ICONS } from '@/components/finance/icons'

type StatusFilter = 'all' | AccountStatus

function AccountName({ account }: { account: AccountWithStatus }) {
  const Icon = ACCOUNT_ICONS[account.category]
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-fg-soft">
        <Icon className="size-[18px]" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 truncate font-semibold text-fg">
          {account.name}
          {account.recurring && <Repeat className="size-3.5 shrink-0 text-subtle" aria-label="Recorrente" />}
        </p>
        {account.notes && <p className="truncate text-xs text-muted">{account.notes}</p>}
      </div>
    </div>
  )
}

export default function AccountsPage() {
  const { accounts, totals, status, error, isLoading, reload, addAccount, updateAccount, deleteAccount, togglePaid } = useAccounts()
  const editor = useEditor<AccountWithStatus>()
  useQueryAction(editor.openNew)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [category, setCategory] = useState('')
  const [query, setQuery] = useState('')

  const counts = useMemo(
    () => ({
      all: accounts.length,
      pending: accounts.filter((a) => a.effectiveStatus === 'pending').length,
      overdue: accounts.filter((a) => a.effectiveStatus === 'overdue').length,
      paid: accounts.filter((a) => a.effectiveStatus === 'paid').length,
    }),
    [accounts],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return accounts.filter((a) => (filter === 'all' || a.effectiveStatus === filter) && (!category || a.category === category) && (!q || a.name.toLowerCase().includes(q)))
  }, [accounts, filter, category, query])

  const handleDelete = useCallback(
    async (account: AccountWithStatus) => {
      if (await confirm({ title: 'Tem certeza?', description: `A conta "${account.name}" será excluída.`, confirmLabel: 'Excluir' })) await deleteAccount(account.id)
    },
    [deleteAccount],
  )

  const { openEdit } = editor
  const columns = useMemo<Column<AccountWithStatus>[]>(
    () => [
      { key: 'name', header: 'Conta', sortValue: (a) => a.name, cell: (a) => <AccountName account={a} /> },
      { key: 'category', header: 'Categoria', hideBelow: 'lg', sortValue: (a) => accountCategoryLabel(a.category), cell: (a) => accountCategoryLabel(a.category) },
      {
        key: 'due',
        header: 'Vencimento',
        sortValue: (a) => a.dueDate,
        cell: (a) => (
          <div>
            <p className="vo-tabular text-fg">{formatDate(a.dueDate, 'dd/MM/yyyy')}</p>
            {a.effectiveStatus !== 'paid' && <p className={cn('text-xs', a.effectiveStatus === 'overdue' ? 'font-semibold text-danger-ink' : 'text-muted')}>{formatRelativeDay(a.dueDate)}</p>}
          </div>
        ),
      },
      { key: 'amount', header: 'Valor', align: 'right', sortValue: (a) => a.amount, cell: (a) => <Money value={a.amount} className="font-semibold text-fg" /> },
      { key: 'status', header: 'Status', sortValue: (a) => a.effectiveStatus, cell: (a) => <AccountStatusBadge status={a.effectiveStatus} /> },
      {
        key: 'actions',
        header: 'Ações',
        align: 'right',
        cell: (a) => (
          <div className="flex items-center justify-end gap-1">
            <Button size="sm" variant={a.status === 'paid' ? 'ghost' : 'soft'} onClick={() => void togglePaid(a)} leftIcon={a.status === 'paid' ? <RotateCcw className="size-3.5" /> : <CircleCheck className="size-3.5" />}>
              {a.status === 'paid' ? 'Reabrir' : 'Pagar'}
            </Button>
            <RowActions label={a.name} onEdit={() => openEdit(a)} onDelete={() => void handleDelete(a)} />
          </div>
        ),
      },
    ],
    [openEdit, handleDelete, togglePaid],
  )

  return (
    <>
      <PageHeader
        title="Contas"
        description="Boletos, faturas e vencimentos organizados — sem juros por esquecimento."
        actions={
          <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
            Adicionar conta
          </Button>
        }
      />

      {status === 'error' ? (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      ) : isLoading ? (
        <LoadingState variant="table" count={6} />
      ) : (
        <div className="animate-fade-in space-y-5">
          <div className="vo-stagger grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="A pagar" value={<Money value={totals.pending} />} icon={<Clock />} tone="warning" footer={`${counts.pending} conta${counts.pending === 1 ? '' : 's'} pendente${counts.pending === 1 ? '' : 's'}`} />
            <StatCard label="Atrasadas" value={<Money value={totals.overdue} />} icon={<CircleAlert />} tone="danger" footer={counts.overdue > 0 ? 'Regularize para evitar juros' : 'Nenhuma conta atrasada'} />
            <StatCard label="Pagas" value={<Money value={totals.paid} />} icon={<CircleCheck />} tone="success" footer={`${counts.paid} conta${counts.paid === 1 ? '' : 's'} quitada${counts.paid === 1 ? '' : 's'}`} />
          </div>

          <Card padding="none">
            <div className="flex flex-col gap-3 p-4 sm:p-5 lg:flex-row lg:items-center">
              <Tabs
                label="Filtrar por status"
                value={filter}
                onChange={setFilter}
                items={[
                  { value: 'all', label: 'Todas', count: counts.all },
                  { value: 'pending', label: 'Pendentes', count: counts.pending },
                  { value: 'overdue', label: 'Atrasadas', count: counts.overdue },
                  { value: 'paid', label: 'Pagas', count: counts.paid },
                ]}
              />
              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:ml-auto lg:max-w-lg">
                <SearchInput value={query} onChange={setQuery} placeholder="Buscar conta…" />
                <Select aria-label="Filtrar por categoria" value={category} onChange={(e) => setCategory(e.target.value)} options={[{ value: '', label: 'Todas as categorias' }, ...ACCOUNT_CATEGORIES]} />
              </div>
            </div>
            <div className="border-t border-line">
              <DataTable
                caption="Contas a pagar"
                columns={columns}
                rows={filtered}
                getRowId={(a) => a.id}
                initialSort={{ key: 'due', direction: 'asc' }}
                rowClassName={(a) => (a.effectiveStatus === 'overdue' ? 'bg-danger-soft/40' : undefined)}
                mobileCard={(a) => (
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <AccountName account={a} />
                      <RowActions label={a.name} onEdit={() => openEdit(a)} onDelete={() => void handleDelete(a)} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <Money value={a.amount} className="font-bold text-fg" />
                        <p className="text-xs text-muted">Vence {formatDate(a.dueDate, 'dd/MM')} · {formatRelativeDay(a.dueDate).toLowerCase()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <AccountStatusBadge status={a.effectiveStatus} />
                        <Button size="sm" variant={a.status === 'paid' ? 'ghost' : 'soft'} onClick={() => void togglePaid(a)}>
                          {a.status === 'paid' ? 'Reabrir' : 'Pagar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                empty={
                  <EmptyState
                    icon={<Receipt />}
                    title={accounts.length === 0 ? 'Nenhuma conta cadastrada' : 'Nenhuma conta encontrada'}
                    description={accounts.length === 0 ? 'Cadastre suas contas para receber lembretes de vencimento.' : 'Ajuste os filtros para ver outras contas.'}
                    action={
                      accounts.length === 0 && (
                        <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
                          Adicionar conta
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

      <AccountFormModal open={editor.isOpen} onClose={editor.close} account={editor.editing} onSubmit={(input) => (editor.editing ? updateAccount(editor.editing.id, input) : addAccount(input))} />
    </>
  )
}
