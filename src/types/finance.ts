import type { Entity, ISODate } from './common'

export type TransactionType = 'income' | 'expense'

export type ExpenseCategory =
  | 'moradia'
  | 'alimentacao'
  | 'transporte'
  | 'saude'
  | 'educacao'
  | 'lazer'
  | 'compras'
  | 'assinaturas'
  | 'outros'

export type IncomeCategory = 'salario' | 'freelance' | 'investimentos' | 'outros'

export type TransactionCategory = ExpenseCategory | IncomeCategory

export type PaymentMethod = 'pix' | 'debito' | 'credito' | 'dinheiro' | 'boleto' | 'transferencia'

export interface Transaction extends Entity {
  type: TransactionType
  description: string
  amount: number
  date: ISODate
  category: TransactionCategory
  paymentMethod: PaymentMethod
}

/** Status persistido. "overdue" é derivado quando a conta pendente passa do vencimento. */
export type AccountStatus = 'paid' | 'pending' | 'overdue'

export type AccountCategory =
  | 'moradia'
  | 'energia'
  | 'agua'
  | 'internet'
  | 'telefone'
  | 'cartao'
  | 'educacao'
  | 'saude'
  | 'impostos'
  | 'seguros'
  | 'outros'

/** Conta a pagar (boletos, faturas e despesas com vencimento). */
export interface Account extends Entity {
  name: string
  category: AccountCategory
  dueDate: ISODate
  amount: number
  status: AccountStatus
  recurring: boolean
  paidAt?: ISODate
  notes?: string
}

export type CardBrand = 'visa' | 'mastercard' | 'elo' | 'amex' | 'hipercard'

export interface CreditCard extends Entity {
  name: string
  bank: string
  brand: CardBrand
  lastDigits: string
  limit: number
  used: number
  closingDay: number
  dueDay: number
  color: string
}

export type SubscriptionFrequency = 'semanal' | 'mensal' | 'trimestral' | 'anual'

export type SubscriptionCategory =
  | 'streaming'
  | 'musica'
  | 'software'
  | 'armazenamento'
  | 'saude'
  | 'educacao'
  | 'outros'

export interface Subscription extends Entity {
  name: string
  amount: number
  frequency: SubscriptionFrequency
  nextBillingDate: ISODate
  category: SubscriptionCategory
  active: boolean
}
