import { format as formatFns, parseISO } from 'date-fns'
import { daysUntil, locale } from './date'

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const currencyNoCents = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
const compactFormatter = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 })
const numberFormatter = new Intl.NumberFormat('pt-BR')

export function formatCurrency(value: number, options: { cents?: boolean } = {}): string {
  const { cents = true } = options
  const safe = Number.isFinite(value) ? value : 0
  return (cents ? currencyFormatter : currencyNoCents).format(safe)
}

/** "R$ 12,5 mil" — para eixos de gráfico e números grandes. */
export function formatCurrencyCompact(value: number): string {
  if (Math.abs(value) < 1000) return formatCurrency(value, { cents: false })
  return `R$ ${compactFormatter.format(value)}`
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatCompact(value: number): string {
  return compactFormatter.format(value)
}

export function formatPercent(value: number, digits = 0): string {
  return `${value.toFixed(digits).replace('.', ',')}%`
}

export function formatDate(iso: string, pattern = "dd 'de' MMM"): string {
  try {
    return formatFns(parseISO(iso), pattern, { locale })
  } catch {
    return iso
  }
}

export function formatShortDate(iso: string): string {
  return formatDate(iso, 'dd/MM/yyyy')
}

/** "Hoje", "Amanhã", "Em 3 dias", "Há 2 dias". */
export function formatRelativeDay(iso: string): string {
  const diff = daysUntil(iso)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Amanhã'
  if (diff === -1) return 'Ontem'
  if (diff > 1) return `Em ${diff} dias`
  return `Há ${Math.abs(diff)} dias`
}

export function formatRelativeTime(isoDateTime: string): string {
  const date = parseISO(isoDateTime)
  const diffMs = Date.now() - date.getTime()
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `há ${hours} h`
  const days = Math.round(hours / 24)
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days} dias`
  return formatFns(date, "dd 'de' MMM", { locale })
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (first + last).toUpperCase()
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`
}

/** Arredonda valores monetários em 2 casas, evitando erros de ponto flutuante. */
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}
