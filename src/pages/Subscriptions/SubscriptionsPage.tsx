import { useCallback, useMemo } from 'react'
import { Cloud, Dumbbell, GraduationCap, Lightbulb, Music, Pause, Play, Plus, Repeat, Tv, Code, type LucideIcon } from 'lucide-react'
import type { Subscription, SubscriptionCategory } from '@/types'
import { frequencyLabel, subscriptionCategoryLabel } from '@/data/categories'
import { cn } from '@/lib/cn'
import { useEditor } from '@/hooks/useDisclosure'
import { useQueryAction } from '@/hooks/useQueryAction'
import { useSubscriptions } from '@/hooks/useSubscriptions'
import { confirm } from '@/stores/confirmStore'
import { monthlyEquivalent } from '@/utils/finance'
import { formatCurrency, formatDate, formatRelativeDay } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { Money } from '@/components/ui/Money'
import { PageHeader } from '@/components/ui/PageHeader'
import { RowActions } from '@/components/ui/RowActions'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States'
import { SubscriptionFormModal } from '@/components/subscriptions/SubscriptionFormModal'

const ICONS: Record<SubscriptionCategory, LucideIcon> = {
  streaming: Tv,
  musica: Music,
  software: Code,
  armazenamento: Cloud,
  saude: Dumbbell,
  educacao: GraduationCap,
  outros: Repeat,
}

function SubscriptionName({ subscription }: { subscription: Subscription }) {
  const Icon = ICONS[subscription.category]
  return (
    <div className="flex items-center gap-3">
      <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', subscription.active ? 'bg-primary-soft text-primary-ink' : 'bg-surface-2 text-subtle')}>
        <Icon className="size-[18px]" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className={cn('truncate font-semibold', subscription.active ? 'text-fg' : 'text-muted')}>{subscription.name}</p>
        <p className="text-xs text-muted">{subscriptionCategoryLabel(subscription.category)}</p>
      </div>
    </div>
  )
}

export default function SubscriptionsPage() {
  const { subscriptions, active, monthlyTotal, yearlyTotal, status, error, isLoading, reload, addSubscription, updateSubscription, deleteSubscription } = useSubscriptions()
  const editor = useEditor<Subscription>()
  useQueryAction(editor.openNew)
  const { openEdit } = editor

  const byCategory = useMemo(() => {
    const map = new Map<SubscriptionCategory, number>()
    active.forEach((s) => map.set(s.category, (map.get(s.category) ?? 0) + monthlyEquivalent(s)))
    return Array.from(map.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
  }, [active])

  const priciest = active.reduce<Subscription | null>((max, s) => (!max || monthlyEquivalent(s) > monthlyEquivalent(max) ? s : max), null)

  const handleDelete = useCallback(
    async (s: Subscription) => {
      if (await confirm({ title: 'Tem certeza?', description: `A assinatura "${s.name}" será excluída.`, confirmLabel: 'Excluir' })) await deleteSubscription(s.id)
    },
    [deleteSubscription],
  )
  const toggleActive = useCallback((s: Subscription) => updateSubscription(s.id, { active: !s.active }), [updateSubscription])

  const columns = useMemo<Column<Subscription>[]>(
    () => [
      { key: 'name', header: 'Nome', sortValue: (s) => s.name, cell: (s) => <SubscriptionName subscription={s} /> },
      { key: 'amount', header: 'Valor', align: 'right', sortValue: (s) => s.amount, cell: (s) => <Money value={s.amount} className="font-semibold text-fg" /> },
      { key: 'frequency', header: 'Frequência', sortValue: (s) => s.frequency, cell: (s) => <Badge tone="neutral">{frequencyLabel(s.frequency)}</Badge> },
      {
        key: 'next',
        header: 'Próxima cobrança',
        sortValue: (s) => s.nextBillingDate,
        cell: (s) =>
          s.active ? (
            <div>
              <p className="vo-tabular text-fg">{formatDate(s.nextBillingDate, 'dd/MM/yyyy')}</p>
              <p className="text-xs text-muted">{formatRelativeDay(s.nextBillingDate)}</p>
            </div>
          ) : (
            <Badge tone="neutral" icon={<Pause />}>
              Pausada
            </Badge>
          ),
      },
      { key: 'category', header: 'Categoria', hideBelow: 'xl', sortValue: (s) => s.category, cell: (s) => subscriptionCategoryLabel(s.category) },
      {
        key: 'actions',
        header: 'Ações',
        align: 'right',
        cell: (s) => (
          <RowActions
            label={s.name}
            extra={[{ label: s.active ? 'Pausar' : 'Reativar', icon: s.active ? <Pause /> : <Play />, onSelect: () => void toggleActive(s) }]}
            onEdit={() => openEdit(s)}
            onDelete={() => void handleDelete(s)}
          />
        ),
      },
    ],
    [openEdit, handleDelete, toggleActive],
  )

  return (
    <>
      <PageHeader
        title="Assinaturas"
        description="Serviços recorrentes somam — veja quanto custam de verdade."
        actions={
          <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
            Adicionar assinatura
          </Button>
        }
      />
      {status === 'error' ? (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      ) : isLoading ? (
        <LoadingState variant="table" count={6} />
      ) : (
        <div className="animate-fade-in space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <Card className="relative overflow-hidden bg-navy text-white lg:col-span-2 dark:bg-surface">
              <div className="pointer-events-none absolute -top-20 -right-10 size-64 rounded-full bg-primary/30 blur-3xl" aria-hidden />
              <div className="relative">
                <p className="text-sm font-medium text-slate-300 dark:text-muted">Resumo das assinaturas</p>
                <p className="mt-3 font-display text-2xl font-bold sm:text-3xl dark:text-fg">
                  Você possui {active.length} assinatura{active.length === 1 ? '' : 's'}.
                </p>
                <p className="mt-1 text-lg text-slate-200 dark:text-fg-soft">
                  Total mensal: <Money value={monthlyTotal} cents={monthlyTotal % 1 !== 0} className="font-bold text-white dark:text-fg" />
                </p>
                <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                  <div>
                    <p className="text-slate-400 dark:text-muted">Por ano</p>
                    <Money value={yearlyTotal} className="font-semibold text-white dark:text-fg" />
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-muted">Mais cara</p>
                    <p className="font-semibold text-white dark:text-fg">{priciest ? `${priciest.name} · ${formatCurrency(monthlyEquivalent(priciest))}/mês` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 dark:text-muted">Pausadas</p>
                    <p className="font-semibold text-white dark:text-fg">{subscriptions.length - active.length}</p>
                  </div>
                </div>
              </div>
            </Card>
            <Card>
              <CardHeader title="Por categoria" description="Custo mensal equivalente" />
              {byCategory.length === 0 ? (
                <p className="text-sm text-muted">Nenhuma assinatura ativa.</p>
              ) : (
                <ul className="space-y-3">
                  {byCategory.map(({ category, total }) => {
                    const Icon = ICONS[category]
                    return (
                      <li key={category} className="flex items-center gap-3 text-sm">
                        <Icon className="size-4 text-muted" aria-hidden />
                        <span className="flex-1 text-fg-soft">{subscriptionCategoryLabel(category)}</span>
                        <Money value={total} className="font-semibold text-fg" />
                      </li>
                    )
                  })}
                </ul>
              )}
              <p className="mt-5 flex gap-2 rounded-xl bg-warning-soft p-3 text-[13px] text-warning-ink">
                <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden />
                Revise a cada 3 meses: cancelar uma assinatura esquecida é dinheiro de volta todo mês.
              </p>
            </Card>
          </div>

          <Card padding="none">
            <div className="p-5 pb-4 sm:p-6 sm:pb-4">
              <CardHeader title="Suas assinaturas" description="Ordenadas pela próxima cobrança" className="mb-0" />
            </div>
            <div className="border-t border-line">
              <DataTable
                caption="Assinaturas"
                columns={columns}
                rows={subscriptions}
                getRowId={(s) => s.id}
                initialSort={{ key: 'next', direction: 'asc' }}
                rowClassName={(s) => (s.active ? undefined : 'opacity-70')}
                mobileCard={(s) => (
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <SubscriptionName subscription={s} />
                    </div>
                    <div className="text-right">
                      <Money value={s.amount} className="text-sm font-semibold text-fg" />
                      <p className="text-xs text-muted">{s.active ? `${frequencyLabel(s.frequency)} · ${formatDate(s.nextBillingDate, 'dd/MM')}` : 'Pausada'}</p>
                    </div>
                    <RowActions
                      label={s.name}
                      extra={[{ label: s.active ? 'Pausar' : 'Reativar', icon: s.active ? <Pause /> : <Play />, onSelect: () => void toggleActive(s) }]}
                      onEdit={() => openEdit(s)}
                      onDelete={() => void handleDelete(s)}
                    />
                  </div>
                )}
                empty={
                  <EmptyState
                    icon={<Repeat />}
                    title="Nenhuma assinatura cadastrada"
                    description="Cadastre streaming, apps e serviços para ver quanto eles custam por mês."
                    action={
                      <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
                        Adicionar assinatura
                      </Button>
                    }
                  />
                }
              />
            </div>
          </Card>
        </div>
      )}
      <SubscriptionFormModal
        open={editor.isOpen}
        onClose={editor.close}
        subscription={editor.editing}
        onSubmit={(input) => (editor.editing ? updateSubscription(editor.editing.id, input) : addSubscription(input))}
      />
    </>
  )
}
