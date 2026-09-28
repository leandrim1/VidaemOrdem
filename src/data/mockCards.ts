import type { CreditCard } from '@/types'

export const CARD_COLORS = ['#5B21B6', '#EA580C', '#0F172A', '#1D4ED8', '#047857', '#BE123C'] as const

export function createMockCards(): CreditCard[] {
  const created = new Date().toISOString()
  return [
    { id: 'card-1', createdAt: created, name: 'Ultravioleta', bank: 'Nubank', brand: 'mastercard', lastDigits: '4821', limit: 8000, used: 3240, closingDay: 3, dueDay: 10, color: '#5B21B6' },
    { id: 'card-2', createdAt: created, name: 'Gold', bank: 'Banco Inter', brand: 'mastercard', lastDigits: '1157', limit: 4500, used: 1127.8, closingDay: 20, dueDay: 27, color: '#EA580C' },
    { id: 'card-3', createdAt: created, name: 'Visa Infinite', bank: 'XP Investimentos', brand: 'visa', lastDigits: '9034', limit: 6000, used: 4980, closingDay: 12, dueDay: 19, color: '#0F172A' },
  ]
}
