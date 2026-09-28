import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Card, CardHeader } from './Card'

interface LegendItem {
  label: string
  color: string
}

interface ChartCardProps {
  title: string
  description?: string
  action?: ReactNode
  legend?: LegendItem[]
  children: ReactNode
  className?: string
  /** Resumo textual do gráfico para leitores de tela. */
  summary?: string
}

export function ChartCard({ title, description, action, legend, children, className, summary }: ChartCardProps) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader title={title} description={description} action={action} className="mb-3" />
      {legend && legend.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Legenda">
          {legend.map((item) => (
            <li key={item.label} className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-soft">
              <span className="size-2.5 rounded-[3px]" style={{ background: item.color }} aria-hidden />
              {item.label}
            </li>
          ))}
        </ul>
      )}
      <figure className="min-h-0 flex-1">
        {children}
        {summary && <figcaption className="sr-only">{summary}</figcaption>}
      </figure>
    </Card>
  )
}

/** Conteúdo padrão do tooltip dos gráficos (tokens do tema, não cores da série). */
export function ChartTooltipContent({ title, rows }: { title: string; rows: Array<{ label: string; value: string; color?: string }> }) {
  return (
    <div className="min-w-40 rounded-xl border border-line bg-surface px-3 py-2.5 text-xs shadow-overlay">
      <p className="mb-1.5 font-semibold text-fg">{title}</p>
      <ul className="space-y-1">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-1.5 text-muted">
              {row.color && <span className="size-2 rounded-full" style={{ background: row.color }} aria-hidden />}
              {row.label}
            </span>
            <span className="vo-tabular font-semibold text-fg">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
