import { cn } from '@/lib/cn'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { formatCurrency } from '@/utils/format'
import { CountUp } from './CountUp'

interface MoneyProps {
  value: number
  className?: string
  /** Exibe sinal +/− (ex.: movimentações). */
  signed?: boolean
  cents?: boolean
}

/** Valor monetário que respeita a preferência "Ocultar valores" (privacidade). */
export function Money({ value, className, signed, cents = true }: MoneyProps) {
  const hidden = usePreferencesStore((s) => s.hideValues)
  if (hidden) {
    return (
      <span className={cn('vo-tabular', className)} aria-label="Valor oculto">
        R$ •••••
      </span>
    )
  }
  const formatted = formatCurrency(Math.abs(value), { cents })
  const sign = signed ? (value < 0 ? '− ' : '+ ') : value < 0 ? '− ' : ''
  return <span className={cn('vo-tabular whitespace-nowrap', className)}>{sign + formatted}</span>
}

/** Valor monetário que "conta" até o valor final ao aparecer (respeita "Ocultar valores"). */
export function AnimatedMoney({ value, className, cents = true }: Omit<MoneyProps, 'signed'>) {
  const hidden = usePreferencesStore((s) => s.hideValues)
  if (hidden) return <Money value={value} className={className} cents={cents} />
  return (
    <CountUp
      value={value}
      duration={1100}
      format={(v) => (v < 0 ? '− ' : '') + formatCurrency(Math.abs(v), { cents })}
      className={cn('vo-tabular whitespace-nowrap', className)}
    />
  )
}
