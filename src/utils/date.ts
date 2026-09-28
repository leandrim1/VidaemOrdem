import { addDays, differenceInCalendarDays, format, isValid, parseISO, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { ISODate } from '@/types'

export const locale = ptBR

/** Converte uma data para `yyyy-MM-dd` no fuso local. */
export function toISODate(date: Date): ISODate {
  return format(date, 'yyyy-MM-dd')
}

export function todayISO(): ISODate {
  return toISODate(new Date())
}

export function parseDate(iso: string): Date {
  return parseISO(iso)
}

/** Data relativa a hoje (`offset` em dias). */
export function daysFromToday(offset: number): ISODate {
  return toISODate(addDays(startOfDay(new Date()), offset))
}

export function daysUntil(iso: ISODate, from: Date = new Date()): number {
  return differenceInCalendarDays(parseISO(iso), startOfDay(from))
}

export function isValidISODate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && isValid(parseISO(value))
}

export function greeting(date: Date = new Date()): string {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) return 'Bom dia'
  if (hour >= 12 && hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
