import { useCallback } from 'react'
import { CalendarCheck, CalendarClock, CreditCard as CreditCardIcon, Gauge, Plus, Wallet } from 'lucide-react'
import type { CreditCard } from '@/types'
import { useCards } from '@/hooks/useCards'
import { useEditor } from '@/hooks/useDisclosure'
import { useQueryAction } from '@/hooks/useQueryAction'
import { confirm } from '@/stores/confirmStore'
import { cardUsage } from '@/utils/finance'
import { formatPercent } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Money } from '@/components/ui/Money'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RowActions } from '@/components/ui/RowActions'
import { StatCard } from '@/components/ui/StatCard'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States'
import { CardFormModal } from '@/components/finance/CardFormModal'
import { CreditCardVisual } from '@/components/finance/CreditCardVisual'

function CardItem({ card, onEdit, onDelete }: { card: CreditCard; onEdit: () => void; onDelete: () => void }) {
  const { available, percent } = cardUsage(card)
  return (
    <Card as="article" className="flex flex-col gap-5">
      <CreditCardVisual card={card} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-fg">
            {card.bank} {card.name}
          </h2>
          <p className="text-sm text-muted">Final {card.lastDigits}</p>
        </div>
        <div className="flex items-center gap-1">
          {percent >= 85 ? <Badge tone="danger">Limite quase no fim</Badge> : percent >= 60 ? <Badge tone="warning">Atenção ao limite</Badge> : <Badge tone="success">Uso saudável</Badge>}
          <RowActions label={`${card.bank} ${card.name}`} onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="text-muted">Utilizado</span>
          <span className="vo-tabular font-semibold text-fg">{formatPercent(percent)}</span>
        </div>
        <ProgressBar value={percent} tone="auto-usage" size="md" label={`Uso do limite do cartão ${card.name}`} />
      </div>
      <dl className="grid grid-cols-3 gap-3 border-t border-line pt-4 text-sm">
        <div>
          <dt className="text-xs text-muted">Limite</dt>
          <dd className="mt-0.5 font-semibold text-fg">
            <Money value={card.limit} cents={false} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Utilizado</dt>
          <dd className="mt-0.5 font-semibold text-fg">
            <Money value={card.used} cents={false} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Disponível</dt>
          <dd className="mt-0.5 font-semibold text-success-ink">
            <Money value={available} cents={false} />
          </dd>
        </div>
      </dl>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2.5 rounded-xl bg-surface-2/70 p-3">
          <CalendarCheck className="size-4 text-muted" aria-hidden />
          <div>
            <p className="text-xs text-muted">Fechamento</p>
            <p className="text-sm font-semibold text-fg">Dia {card.closingDay}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 rounded-xl bg-surface-2/70 p-3">
          <CalendarClock className="size-4 text-muted" aria-hidden />
          <div>
            <p className="text-xs text-muted">Vencimento</p>
            <p className="text-sm font-semibold text-fg">Dia {card.dueDay}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function CardsPage() {
  const { cards, totals, status, error, isLoading, reload, addCard, updateCard, deleteCard } = useCards()
  const editor = useEditor<CreditCard>()
  useQueryAction(editor.openNew)

  const handleDelete = useCallback(
    async (card: CreditCard) => {
      if (await confirm({ title: 'Tem certeza?', description: `O cartão ${card.bank} ${card.name} será removido.`, confirmLabel: 'Excluir' })) await deleteCard(card.id)
    },
    [deleteCard],
  )

  return (
    <>
      <PageHeader
        title="Cartões"
        description="Limites, faturas e datas de fechamento de todos os seus cartões."
        actions={
          <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
            Adicionar cartão
          </Button>
        }
      />
      {status === 'error' ? (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      ) : isLoading ? (
        <LoadingState variant="cards" count={3} />
      ) : (
        <div className="animate-fade-in space-y-5">
          {cards.length > 0 && (
            <div className="vo-stagger grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard label="Limite total" value={<Money value={totals.limit} />} icon={<Wallet />} tone="primary" footer={`${cards.length} cart${cards.length === 1 ? 'ão' : 'ões'}`} />
              <StatCard label="Utilizado" value={<Money value={totals.used} />} icon={<Gauge />} tone="warning" footer={`${formatPercent(totals.percent)} do limite total`} />
              <StatCard label="Disponível" value={<Money value={totals.available} />} icon={<CreditCardIcon />} tone="success" footer="para novas compras" />
            </div>
          )}
          {cards.length === 0 ? (
            <Card>
              <EmptyState
                icon={<CreditCardIcon />}
                title="Nenhum cartão cadastrado"
                description="Adicione seus cartões para acompanhar limite, fatura e vencimentos."
                action={
                  <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
                    Adicionar cartão
                  </Button>
                }
              />
            </Card>
          ) : (
            <div className="vo-stagger grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {cards.map((card) => (
                <CardItem key={card.id} card={card} onEdit={() => editor.openEdit(card)} onDelete={() => void handleDelete(card)} />
              ))}
            </div>
          )}
        </div>
      )}
      <CardFormModal open={editor.isOpen} onClose={editor.close} card={editor.editing} onSubmit={(input) => (editor.editing ? updateCard(editor.editing.id, input) : addCard(input))} />
    </>
  )
}
