import { Link } from 'react-router-dom'
import { ArrowRight, CalendarClock, Check } from 'lucide-react'
import type { AccountWithStatus } from '@/hooks/useAccounts'
import { cn } from '@/lib/cn'
import { PATHS } from '@/routes/paths'
import { daysUntil } from '@/utils/date'
import { formatRelativeDay } from '@/utils/format'
import { Card, CardHeader } from '@/components/ui/Card'
import { IconButton } from '@/components/ui/IconButton'
import { Money } from '@/components/ui/Money'
import { EmptyState } from '@/components/ui/States'
import { ACCOUNT_ICONS } from '@/components/finance/icons'

interface UpcomingBillsCardProps {
  bills: AccountWithStatus[]
  overdueCount: number
  onPay: (bill: AccountWithStatus) => void
}

export function UpcomingBillsCard({ bills, overdueCount, onPay }: UpcomingBillsCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Contas próximas"
        description={overdueCount > 0 ? `${overdueCount} conta${overdueCount > 1 ? 's' : ''} atrasada${overdueCount > 1 ? 's' : ''}` : 'Próximos 15 dias'}
        icon={<CalendarClock />}
        action={
          <Link to={PATHS.accounts} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-semibold text-primary-ink hover:bg-primary-soft">
            Ver todas <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        }
      />
      {bills.length === 0 ? (
        <EmptyState compact icon={<Check />} title="Nenhuma conta próxima" description="Você não tem vencimentos nos próximos 15 dias." />
      ) : (
        <ul className="divide-y divide-line">
          {bills.slice(0, 3).map((bill) => {
            const Icon = ACCOUNT_ICONS[bill.category]
            const soon = daysUntil(bill.dueDate) <= 2
            return (
              <li key={bill.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-fg-soft">
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-fg">{bill.name}</p>
                  <p className={cn('text-[13px]', soon ? 'font-semibold text-warning-ink' : 'text-muted')}>Vence {formatRelativeDay(bill.dueDate).toLowerCase()}</p>
                </div>
                <Money value={bill.amount} className="text-sm font-bold text-fg" />
                <IconButton size="sm" label={`Marcar ${bill.name} como paga`} icon={<Check />} onClick={() => onPay(bill)} className="hover:bg-success-soft hover:text-success-ink" />
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
