import { format, parseISO, startOfMonth, subMonths } from 'date-fns'
import type { Account, AccountStatus, CreditCard, ExpenseCategory, Subscription, Transaction } from '@/types'
import { EXPENSE_CATEGORIES } from '@/data/categories'
import { daysUntil, locale, capitalize } from './date'
import { roundMoney } from './format'

export interface MonthSummary {
  income: number
  expense: number
  balance: number
  /** Percentual da receita que sobrou no mês. */
  savingsRate: number
}

export function monthKey(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'yyyy-MM')
}

export function summarize(transactions: Transaction[]): MonthSummary {
  let income = 0
  let expense = 0
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount
    else expense += t.amount
  }
  income = roundMoney(income)
  expense = roundMoney(expense)
  const balance = roundMoney(income - expense)
  return { income, expense, balance, savingsRate: income > 0 ? Math.max(0, (balance / income) * 100) : 0 }
}

export function transactionsInMonth(transactions: Transaction[], month: Date = new Date()): Transaction[] {
  const key = monthKey(month)
  return transactions.filter((t) => t.date.startsWith(key))
}

export interface CategoryTotal {
  category: ExpenseCategory
  label: string
  color: string
  total: number
  share: number
}

export function expensesByCategory(transactions: Transaction[]): CategoryTotal[] {
  const totals = new Map<string, number>()
  let sum = 0
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount)
    sum += t.amount
  }
  return EXPENSE_CATEGORIES.map((c) => {
    const total = roundMoney(totals.get(c.value) ?? 0)
    return { category: c.value, label: c.label, color: c.color, total, share: sum > 0 ? (total / sum) * 100 : 0 }
  })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)
}

export interface MonthlyPoint {
  key: string
  label: string
  income: number
  expense: number
  balance: number
}

/** Série dos últimos `months` meses (inclui o mês atual). */
export function monthlySeries(transactions: Transaction[], months = 6, reference: Date = new Date()): MonthlyPoint[] {
  const points: MonthlyPoint[] = []
  for (let i = months - 1; i >= 0; i--) {
    const month = startOfMonth(subMonths(reference, i))
    const summary = summarize(transactionsInMonth(transactions, month))
    points.push({
      key: monthKey(month),
      label: capitalize(format(month, 'MMM', { locale }).replace('.', '')),
      income: summary.income,
      expense: summary.expense,
      balance: summary.balance,
    })
  }
  return points
}

/** Status efetivo: uma conta pendente com vencimento passado é "atrasada". */
export function resolveAccountStatus(account: Pick<Account, 'status' | 'dueDate'>): AccountStatus {
  if (account.status === 'paid') return 'paid'
  return daysUntil(account.dueDate) < 0 ? 'overdue' : 'pending'
}

export function monthlyEquivalent(subscription: Pick<Subscription, 'amount' | 'frequency'>): number {
  switch (subscription.frequency) {
    case 'semanal':
      return roundMoney((subscription.amount * 52) / 12)
    case 'trimestral':
      return roundMoney(subscription.amount / 3)
    case 'anual':
      return roundMoney(subscription.amount / 12)
    default:
      return subscription.amount
  }
}

export function cardUsage(card: Pick<CreditCard, 'limit' | 'used'>): { available: number; percent: number } {
  const available = roundMoney(Math.max(0, card.limit - card.used))
  const percent = card.limit > 0 ? Math.min(100, (card.used / card.limit) * 100) : 0
  return { available, percent }
}
