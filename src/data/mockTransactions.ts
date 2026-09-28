import { getDaysInMonth, startOfMonth, subMonths } from 'date-fns'
import type { PaymentMethod, Transaction, TransactionCategory, TransactionType } from '@/types'
import { createRandom, randomBetween } from '@/lib/random'
import { toISODate } from '@/utils/date'

interface TransactionTemplate {
  description: string
  type: TransactionType
  category: TransactionCategory
  amount: number
  day: number
  paymentMethod: PaymentMethod
}

/**
 * Mês atual da usuária demo — totaliza exatamente:
 * receitas R$ 5.200,00 · despesas R$ 3.840,00 · saldo R$ 1.360,00
 */
const CURRENT_MONTH: TransactionTemplate[] = [
  { description: 'Salário — Studio Atlas', type: 'income', category: 'salario', amount: 4500, day: 5, paymentMethod: 'transferencia' },
  { description: 'Projeto freelance — identidade visual', type: 'income', category: 'freelance', amount: 700, day: 12, paymentMethod: 'pix' },
  { description: 'Aluguel do apartamento', type: 'expense', category: 'moradia', amount: 1350, day: 5, paymentMethod: 'boleto' },
  { description: 'Conta de luz', type: 'expense', category: 'moradia', amount: 164.3, day: 8, paymentMethod: 'pix' },
  { description: 'Internet fibra', type: 'expense', category: 'moradia', amount: 99.9, day: 10, paymentMethod: 'debito' },
  { description: 'Supermercado do mês', type: 'expense', category: 'alimentacao', amount: 612.45, day: 6, paymentMethod: 'credito' },
  { description: 'Hortifruti da semana', type: 'expense', category: 'alimentacao', amount: 86.2, day: 14, paymentMethod: 'pix' },
  { description: 'Delivery — jantar', type: 'expense', category: 'alimentacao', amount: 142.8, day: 16, paymentMethod: 'credito' },
  { description: 'Combustível', type: 'expense', category: 'transporte', amount: 230, day: 9, paymentMethod: 'credito' },
  { description: 'Corridas de aplicativo', type: 'expense', category: 'transporte', amount: 68.4, day: 13, paymentMethod: 'credito' },
  { description: 'Farmácia', type: 'expense', category: 'saude', amount: 94.7, day: 11, paymentMethod: 'debito' },
  { description: 'Curso de inglês', type: 'expense', category: 'educacao', amount: 249, day: 7, paymentMethod: 'boleto' },
  { description: 'Cinema', type: 'expense', category: 'lazer', amount: 72, day: 15, paymentMethod: 'credito' },
  { description: 'Restaurante — aniversário da Carla', type: 'expense', category: 'lazer', amount: 138.5, day: 17, paymentMethod: 'credito' },
  { description: 'Roupas — troca de estação', type: 'expense', category: 'compras', amount: 179.9, day: 18, paymentMethod: 'credito' },
  { description: 'Presente de aniversário', type: 'expense', category: 'outros', amount: 78.55, day: 19, paymentMethod: 'pix' },
  { description: 'Netflix', type: 'expense', category: 'assinaturas', amount: 44.9, day: 3, paymentMethod: 'credito' },
  { description: 'Spotify Família', type: 'expense', category: 'assinaturas', amount: 34.9, day: 4, paymentMethod: 'credito' },
  { description: 'Amazon Prime', type: 'expense', category: 'assinaturas', amount: 19.9, day: 6, paymentMethod: 'credito' },
  { description: 'Disney+', type: 'expense', category: 'assinaturas', amount: 33.9, day: 8, paymentMethod: 'credito' },
  { description: 'iCloud+ 200 GB', type: 'expense', category: 'assinaturas', amount: 14.9, day: 2, paymentMethod: 'credito' },
  { description: 'Academia', type: 'expense', category: 'assinaturas', amount: 99.9, day: 1, paymentMethod: 'debito' },
  { description: 'YouTube Premium', type: 'expense', category: 'assinaturas', amount: 24.9, day: 9, paymentMethod: 'credito' },
]

/** Itens recorrentes com variação para os meses anteriores. */
function previousMonth(offset: number): TransactionTemplate[] {
  const random = createRandom(2026 + offset * 97)
  const freelance = [0, 1200, 450, 900, 300, 650][offset] ?? 0
  const items: TransactionTemplate[] = [
    { description: 'Salário — Studio Atlas', type: 'income', category: 'salario', amount: 4500, day: 5, paymentMethod: 'transferencia' },
    { description: 'Aluguel do apartamento', type: 'expense', category: 'moradia', amount: 1350, day: 5, paymentMethod: 'boleto' },
    { description: 'Conta de luz', type: 'expense', category: 'moradia', amount: randomBetween(random, 142, 198), day: 8, paymentMethod: 'pix' },
    { description: 'Internet fibra', type: 'expense', category: 'moradia', amount: 99.9, day: 10, paymentMethod: 'debito' },
    { description: 'Supermercado do mês', type: 'expense', category: 'alimentacao', amount: randomBetween(random, 540, 690), day: 6, paymentMethod: 'credito' },
    { description: 'Hortifruti', type: 'expense', category: 'alimentacao', amount: randomBetween(random, 70, 120), day: 15, paymentMethod: 'pix' },
    { description: 'Delivery', type: 'expense', category: 'alimentacao', amount: randomBetween(random, 90, 210), day: 20, paymentMethod: 'credito' },
    { description: 'Combustível', type: 'expense', category: 'transporte', amount: randomBetween(random, 190, 270), day: 9, paymentMethod: 'credito' },
    { description: 'Corridas de aplicativo', type: 'expense', category: 'transporte', amount: randomBetween(random, 35, 95), day: 18, paymentMethod: 'credito' },
    { description: 'Farmácia', type: 'expense', category: 'saude', amount: randomBetween(random, 30, 140), day: 12, paymentMethod: 'debito' },
    { description: 'Curso de inglês', type: 'expense', category: 'educacao', amount: 249, day: 7, paymentMethod: 'boleto' },
    { description: 'Lazer e passeios', type: 'expense', category: 'lazer', amount: randomBetween(random, 110, 290), day: 22, paymentMethod: 'credito' },
    { description: 'Assinaturas digitais', type: 'expense', category: 'assinaturas', amount: 273.3, day: 3, paymentMethod: 'credito' },
  ]
  if (freelance > 0) {
    items.push({ description: 'Projeto freelance', type: 'income', category: 'freelance', amount: freelance, day: 14, paymentMethod: 'pix' })
  }
  if (random() > 0.35) {
    items.push({ description: 'Compras diversas', type: 'expense', category: 'compras', amount: randomBetween(random, 80, 460), day: 24, paymentMethod: 'credito' })
  }
  if (offset === 3) {
    items.push({ description: 'Manutenção do carro', type: 'expense', category: 'transporte', amount: 680, day: 16, paymentMethod: 'credito' })
  }
  if (offset === 2) {
    items.push({ description: 'Rendimento da reserva', type: 'income', category: 'investimentos', amount: 86.4, day: 28, paymentMethod: 'transferencia' })
  }
  return items
}

function materialize(templates: TransactionTemplate[], month: Date, prefix: string, clampToDay?: number): Transaction[] {
  const days = getDaysInMonth(month)
  return templates.map((t, index) => {
    const day = Math.min(t.day, days, clampToDay ?? days)
    const date = new Date(month.getFullYear(), month.getMonth(), day)
    return {
      id: `${prefix}-${index + 1}`,
      createdAt: date.toISOString(),
      type: t.type,
      description: t.description,
      amount: t.amount,
      category: t.category,
      paymentMethod: t.paymentMethod,
      date: toISODate(date),
    }
  })
}

export function createMockTransactions(reference: Date = new Date()): Transaction[] {
  const current = startOfMonth(reference)
  const result = materialize(CURRENT_MONTH, current, 'tx-m0', reference.getDate())
  for (let offset = 1; offset <= 5; offset++) {
    const month = startOfMonth(subMonths(reference, offset))
    result.push(...materialize(previousMonth(offset), month, `tx-m${offset}`))
  }
  return result.sort((a, b) => b.date.localeCompare(a.date))
}
