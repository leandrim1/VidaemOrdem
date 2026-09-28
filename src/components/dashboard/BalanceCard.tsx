import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Wallet } from 'lucide-react'
import type { CategoryTotal, MonthSummary } from '@/utils/finance'
import { PATHS } from '@/routes/paths'
import { capitalize, locale } from '@/utils/date'
import { formatPercent } from '@/utils/format'
import { format } from 'date-fns'
import { Card } from '@/components/ui/Card'
import { Money } from '@/components/ui/Money'
import { ProgressBar } from '@/components/ui/ProgressBar'

export function BalanceCard({ summary, categories }: { summary: MonthSummary; categories: CategoryTotal[] }) {
  const spentRatio = summary.income > 0 ? (summary.expense / summary.income) * 100 : 0
  const month = capitalize(format(new Date(), 'MMMM', { locale }))
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-muted">
            <Wallet className="size-4" aria-hidden />
            Saldo do mês · {month}
          </p>
          <Money
            value={summary.balance}
            className={summary.balance >= 0 ? 'mt-2 block font-display text-4xl font-extrabold tracking-tight text-fg' : 'mt-2 block font-display text-4xl font-extrabold tracking-tight text-danger-ink'}
          />
        </div>
        <Link to={PATHS.finance} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-semibold text-primary-ink hover:bg-primary-soft">
          Detalhes
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface-2/70 p-3.5">
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
            <span className="flex size-5 items-center justify-center rounded-md bg-success-soft text-success-ink">
              <ArrowUpRight className="size-3.5" aria-hidden />
            </span>
            Receitas
          </p>
          <Money value={summary.income} className="mt-1.5 block text-lg font-bold text-fg" />
        </div>
        <div className="rounded-xl bg-surface-2/70 p-3.5">
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-muted">
            <span className="flex size-5 items-center justify-center rounded-md bg-danger-soft text-danger-ink">
              <ArrowDownRight className="size-3.5" aria-hidden />
            </span>
            Despesas
          </p>
          <Money value={summary.expense} className="mt-1.5 block text-lg font-bold text-fg" />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mt-5">
          <p className="mb-2.5 text-[13px] font-semibold text-fg-soft">Maiores gastos do mês</p>
          <ul className="space-y-2">
            {categories.slice(0, 3).map((category) => (
              <li key={category.category} className="flex items-center gap-3 text-sm">
                <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: category.color }} aria-hidden />
                <span className="min-w-0 flex-1 truncate text-fg-soft">{category.label}</span>
                <span className="vo-tabular text-xs text-muted">{formatPercent(category.share)}</span>
                <Money value={category.total} className="w-24 text-right font-semibold text-fg" />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-auto pt-5">
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="text-muted">Você gastou {formatPercent(spentRatio)} do que recebeu</span>
          <span className="font-semibold text-success-ink">{formatPercent(summary.savingsRate)} poupado</span>
        </div>
        <ProgressBar value={spentRatio} tone="auto-usage" size="md" label="Percentual da receita já gasto" />
      </div>
    </Card>
  )
}
