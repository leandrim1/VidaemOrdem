import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipContentProps } from 'recharts'
import { formatCompact, formatCurrency, formatNumber, formatPercent } from '@/utils/format'
import { ChartTooltipContent } from '@/components/ui/ChartCard'
import { CHART } from './chartTheme'

function SimpleTooltip({ active, payload, format, name }: TooltipContentProps & { format: (v: number) => string; name: string }) {
  const entry = payload?.[0]
  if (!active || !entry) return null
  const point = entry.payload as Record<string, string | number>
  const title = String(point.label ?? point.day ?? point.plan ?? '')
  return <ChartTooltipContent title={title} rows={[{ label: name, value: format(Number(entry.value)), color: CHART.income }]} />
}

export function RevenueChart({ data }: { data: Array<{ label: string; receita: number }> }) {
  return (
    <div className="-ml-2 h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART.grid} />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: CHART.grid }} tick={CHART.tick} dy={6} />
          <YAxis tickLine={false} axisLine={false} tick={CHART.tick} width={52} tickFormatter={(v: number) => formatCompact(v)} />
          <Tooltip content={(props) => <SimpleTooltip {...props} name="Receita" format={(v) => formatCurrency(v)} />} cursor={{ stroke: CHART.axis }} />
          <Area type="monotone" dataKey="receita" stroke={CHART.income} strokeWidth={2} fill={CHART.income} fillOpacity={0.1} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: CHART.surface }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SignupsChart({ data }: { data: Array<{ label: string; cadastros: number }> }) {
  return (
    <div className="-ml-2 h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART.grid} />
          <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: CHART.grid }} tick={CHART.tick} dy={6} interval="preserveStartEnd" />
          <YAxis tickLine={false} axisLine={false} tick={CHART.tick} width={40} />
          <Tooltip content={(props) => <SimpleTooltip {...props} name="Cadastros" format={(v) => formatNumber(v)} />} cursor={{ stroke: CHART.axis }} />
          <Line type="monotone" dataKey="cadastros" stroke={CHART.income} strokeWidth={2} dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: CHART.surface }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

/** Funil do desafio: barras horizontais em uma única cor (magnitude), com rótulo na ponta. */
export function FunnelChart({ data }: { data: Array<{ day: string; usuarios: number }> }) {
  const first = data[0]?.usuarios ?? 1
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 56, left: 0, bottom: 0 }} barCategoryGap={6}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="day" tickLine={false} axisLine={false} tick={CHART.tick} width={48} />
          <Tooltip content={(props) => <SimpleTooltip {...props} name="Usuários" format={(v) => `${formatNumber(v)} (${formatPercent((v / first) * 100)})`} />} cursor={{ fill: 'var(--vo-surface-2)' }} />
          <Bar
            dataKey="usuarios"
            fill={CHART.income}
            radius={[0, 4, 4, 0]}
            maxBarSize={22}
            label={{ position: 'right', fill: 'var(--vo-fg-soft)', fontSize: 12, formatter: (v: unknown) => formatNumber(Number(v)) }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PlanDonut({ data }: { data: Array<{ plan: string; value: number; color: string }> }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row xl:flex-col 2xl:flex-row">
      <div className="relative size-[160px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="plan" innerRadius={52} outerRadius={78} paddingAngle={1.5} stroke={CHART.surface} strokeWidth={2} startAngle={90} endAngle={-270}>
              {data.map((d) => (
                <Cell key={d.plan} fill={d.color} />
              ))}
            </Pie>
            <Tooltip content={(props) => <SimpleTooltip {...props} name="Usuários" format={(v) => `${formatNumber(v)} (${formatPercent((v / total) * 100)})`} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-muted">Assinantes</span>
          <span className="font-display text-lg font-bold text-fg">{formatCompact(total)}</span>
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {data.map((d) => (
          <li key={d.plan} className="flex items-center gap-2 text-sm">
            <span className="size-2.5 rounded-[3px]" style={{ background: d.color }} aria-hidden />
            <span className="flex-1 text-fg-soft">{d.plan}</span>
            <span className="vo-tabular font-semibold text-fg">{formatNumber(d.value)}</span>
            <span className="vo-tabular w-10 text-right text-xs text-muted">{formatPercent((d.value / total) * 100)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

