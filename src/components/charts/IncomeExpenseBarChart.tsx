import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from 'recharts'
import type { MonthlyPoint } from '@/utils/finance'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { formatCompact, formatCurrency } from '@/utils/format'
import { ChartTooltipContent } from '@/components/ui/ChartCard'
import { CHART } from './chartTheme'

function TooltipBody({ active, payload }: TooltipContentProps) {
  const hidden = usePreferencesStore((s) => s.hideValues)
  const point = payload?.[0]?.payload as MonthlyPoint | undefined
  if (!active || !point) return null
  const money = (v: number) => (hidden ? 'R$ •••••' : formatCurrency(v))
  return (
    <ChartTooltipContent
      title={point.label}
      rows={[
        { label: 'Receitas', value: money(point.income), color: CHART.income },
        { label: 'Despesas', value: money(point.expense), color: CHART.expense },
        { label: 'Saldo', value: money(point.balance) },
      ]}
    />
  )
}

/** Colunas agrupadas por mês (máx. 20px, cantos de 4px na ponta, 2px de respiro entre barras). */
export function IncomeExpenseBarChart({ data, height = 280 }: { data: MonthlyPoint[]; height?: number }) {
  const hidden = usePreferencesStore((s) => s.hideValues)
  return (
    <div style={{ height }} className="-ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke={CHART.grid} />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: CHART.grid }} tick={CHART.tick} dy={6} />
          <YAxis tickLine={false} axisLine={false} tick={CHART.tick} width={hidden ? 16 : 52} tickFormatter={(v: number) => (hidden ? '' : formatCompact(v))} />
          <Tooltip content={(props) => <TooltipBody {...props} />} cursor={{ fill: 'var(--vo-surface-2)' }} />
          <Bar dataKey="income" name="Receitas" fill={CHART.income} radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="expense" name="Despesas" fill={CHART.expense} radius={[4, 4, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
