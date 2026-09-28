import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card } from './Card'

export type StatTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral'

interface StatCardProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  tone?: StatTone
  delta?: { value: number; label: string; positiveIsGood?: boolean }
  footer?: ReactNode
  className?: string
}

const iconTones: Record<StatTone, string> = {
  primary: 'bg-primary-soft text-primary-ink',
  success: 'bg-success-soft text-success-ink',
  warning: 'bg-warning-soft text-warning-ink',
  danger: 'bg-danger-soft text-danger-ink',
  neutral: 'bg-surface-2 text-fg-soft',
}

export function StatCard({ label, value, icon, tone = 'primary', delta, footer, className }: StatCardProps) {
  const up = (delta?.value ?? 0) >= 0
  const good = delta ? (delta.positiveIsGood ?? true) === up : true
  return (
    <Card className={cn('flex flex-col', className)} padding="sm">
      <div className="flex items-start justify-between gap-3 p-1">
        <p className="text-sm font-medium text-muted">{label}</p>
        {icon && <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-[10px] [&_svg]:size-[18px]', iconTones[tone])}>{icon}</span>}
      </div>
      <div className="px-1 font-display text-xl font-bold tracking-tight break-words text-fg sm:text-[26px]">{value}</div>
      {(delta || footer) && (
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 px-1 pb-1 text-[13px]">
          {delta && (
            <span className={cn('inline-flex items-center gap-0.5 font-semibold', good ? 'text-success-ink' : 'text-danger-ink')}>
              {up ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}
              <span className="sr-only">{up ? 'Aumento de' : 'Redução de'}</span>
              {Math.abs(delta.value).toFixed(1).replace('.', ',')}%
            </span>
          )}
          {delta && <span className="text-muted">{delta.label}</span>}
          {footer && <span className="text-muted">{footer}</span>}
        </div>
      )}
    </Card>
  )
}
