import type { Subscription } from '@/types'
import { daysFromToday } from '@/utils/date'

/** 8 assinaturas — total mensal equivalente de R$ 287,00. */
export function createMockSubscriptions(): Subscription[] {
  const created = new Date().toISOString()
  return [
    { id: 'sub-1', createdAt: created, name: 'Netflix', amount: 44.9, frequency: 'mensal', nextBillingDate: daysFromToday(6), category: 'streaming', active: true },
    { id: 'sub-2', createdAt: created, name: 'Spotify Família', amount: 34.9, frequency: 'mensal', nextBillingDate: daysFromToday(7), category: 'musica', active: true },
    { id: 'sub-3', createdAt: created, name: 'Amazon Prime', amount: 19.9, frequency: 'mensal', nextBillingDate: daysFromToday(9), category: 'streaming', active: true },
    { id: 'sub-4', createdAt: created, name: 'Disney+', amount: 33.9, frequency: 'mensal', nextBillingDate: daysFromToday(11), category: 'streaming', active: true },
    { id: 'sub-5', createdAt: created, name: 'iCloud+ 200 GB', amount: 14.9, frequency: 'mensal', nextBillingDate: daysFromToday(3), category: 'armazenamento', active: true },
    { id: 'sub-6', createdAt: created, name: 'Academia', amount: 99.9, frequency: 'mensal', nextBillingDate: daysFromToday(2), category: 'saude', active: true },
    { id: 'sub-7', createdAt: created, name: 'YouTube Premium', amount: 24.9, frequency: 'mensal', nextBillingDate: daysFromToday(12), category: 'streaming', active: true },
    { id: 'sub-8', createdAt: created, name: 'Duolingo Super', amount: 164.4, frequency: 'anual', nextBillingDate: daysFromToday(143), category: 'educacao', active: true },
  ]
}
