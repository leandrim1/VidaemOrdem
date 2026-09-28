import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, type TooltipContentProps } from 'recharts'
import type { CategoryTotal } from '@/utils/finance'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { formatCurrency, formatPercent } from '@/utils/format'
import { ChartTooltipContent } from '@/components/ui/ChartCard'
import { Money } from '@/components/ui/Money'
import { CHART } from './chartTheme'

function TooltipBody({ active, payload }: TooltipContentProps) {
  const hidden = usePreferencesStore((s) => s.hideValues)
  const item = payload?.[0]?.payload as CategoryTotal | undefined
  if (!active || !item) return null
  return (
    <ChartTooltipContent
      title={item.label}
      rows={[
        { label: 'Total', value: hidden ? 'R$ •••••' : formatCurrency(item.total), color: item.color },
        { label: 'Participação', value: formatPercent(item.share, 1) },
      ]}
    />
  )
}

/**
 * Despesas por categoria: rosca + lista rotulada (a lista funciona como
 * legenda e tabela, então a identificação nunca depende só da cor).
 */
export function CategoryDonut({ data, total }: { data: CategoryTotal[]; total: number }) {
  return (
    <div className="@container">
    <div className="grid grid-cols-1 items-center gap-6 @md:grid-cols-[180px_minmax(0,1fr)]">
      <div className="relative mx-auto size-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="label"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={data.length > 1 ? 1.5 : 0}
              stroke={CHART.surface}
              strokeWidth={2}
              startAngle={90}
              endAngle={-270}
              isAnimationActive
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={(props) => <TooltipBody {...props} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-muted">Total</span>
          <Money value={total} cents={false} className="font-display text-lg font-bold text-fg" />
        </div>
      </div>
      <ul className="space-y-2.5">
        {data.map((item) => (
          <li key={item.category} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span className="size-2.5 shrink-0 rounded-[3px]" style={{ background: item.color }} aria-hidden />
              <span className="truncate text-fg-soft">{item.label}</span>
            </span>
            <span className="flex items-center gap-2">
              <Money value={item.total} className="font-semibold text-fg" />
              <span className="vo-tabular w-11 text-right text-xs text-muted">{formatPercent(item.share)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
    </div>
  )
}
