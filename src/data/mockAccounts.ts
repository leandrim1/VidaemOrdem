import type { Account } from '@/types'
import { daysFromToday } from '@/utils/date'

/** Contas a pagar da usuária demo (3 próximas, 1 atrasada). */
export function createMockAccounts(): Account[] {
  const created = new Date().toISOString()
  return [
    { id: 'acc-1', createdAt: created, name: 'Conta de luz', category: 'energia', dueDate: daysFromToday(1), amount: 164.3, status: 'pending', recurring: true },
    { id: 'acc-2', createdAt: created, name: 'Internet fibra', category: 'internet', dueDate: daysFromToday(4), amount: 99.9, status: 'pending', recurring: true },
    { id: 'acc-3', createdAt: created, name: 'Fatura Nubank', category: 'cartao', dueDate: daysFromToday(9), amount: 1284.6, status: 'pending', recurring: true },
    { id: 'acc-4', createdAt: created, name: 'Conta de água', category: 'agua', dueDate: daysFromToday(-2), amount: 78.4, status: 'pending', recurring: true },
    { id: 'acc-5', createdAt: created, name: 'Aluguel do apartamento', category: 'moradia', dueDate: daysFromToday(-3), amount: 1350, status: 'paid', recurring: true, paidAt: daysFromToday(-3) },
    { id: 'acc-6', createdAt: created, name: 'Plano de celular', category: 'telefone', dueDate: daysFromToday(-6), amount: 59.9, status: 'paid', recurring: true, paidAt: daysFromToday(-7) },
    { id: 'acc-7', createdAt: created, name: 'Curso de inglês', category: 'educacao', dueDate: daysFromToday(-10), amount: 249, status: 'paid', recurring: true, paidAt: daysFromToday(-10) },
    { id: 'acc-8', createdAt: created, name: 'IPVA — parcela 3/3', category: 'impostos', dueDate: daysFromToday(18), amount: 412.35, status: 'pending', recurring: false },
    { id: 'acc-9', createdAt: created, name: 'Seguro do carro', category: 'seguros', dueDate: daysFromToday(22), amount: 186, status: 'pending', recurring: true },
    { id: 'acc-10', createdAt: created, name: 'Plano de saúde', category: 'saude', dueDate: daysFromToday(26), amount: 289, status: 'pending', recurring: true },
  ]
}
