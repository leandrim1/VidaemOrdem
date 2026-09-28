import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from 'recharts'
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

/** Evolução de receitas e despesas (linhas de 2px com área em 10% de opacidade). */
export function IncomeExpenseAreaChart({ data, height = 260 }: { data: MonthlyPoint[]; height?: number }) {
  const hidden = usePreferencesStore((s) => s.hideValues)
  return (
    <div style={{ height }} className="-ml-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART.grid} strokeDasharray="0" />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: CHART.grid }} tick={CHART.tick} dy={6} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={CHART.tick}
            width={hidden ? 16 : 52}
            tickFormatter={(v: number) => (hidden ? '' : formatCompact(v))}
          />
          <Tooltip content={(props) => <TooltipBody {...props} />} cursor={{ stroke: CHART.axis, strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="income"
            name="Receitas"
            stroke={CHART.income}
            strokeWidth={2}
            fill={CHART.income}
            fillOpacity={0.1}
            activeDot={{ r: 5, strokeWidth: 2, stroke: CHART.surface }}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="expense"
            name="Despesas"
            stroke={CHART.expense}
            strokeWidth={2}
            fill={CHART.expense}
            fillOpacity={0.1}
            activeDot={{ r: 5, strokeWidth: 2, stroke: CHART.surface }}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
