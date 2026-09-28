import { cn } from '@/lib/cn'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { formatCurrency } from '@/utils/format'

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
