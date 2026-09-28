import type { Goal } from '@/types'
import { daysFromToday } from '@/utils/date'

export function createMockGoals(): Goal[] {
  const created = new Date().toISOString()
  return [
    { id: 'goal-1', createdAt: created, name: 'Reserva de emergência', category: 'financeira', targetAmount: 10000, currentAmount: 3200, deadline: daysFromToday(240) },
    { id: 'goal-2', createdAt: created, name: 'Viagem para Lisboa', category: 'viagem', targetAmount: 6000, currentAmount: 4320, deadline: daysFromToday(120) },
    { id: 'goal-3', createdAt: created, name: 'Curso de UX Design', category: 'educacao', targetAmount: 3500, currentAmount: 1400, deadline: daysFromToday(150) },
    { id: 'goal-4', createdAt: created, name: 'Notebook novo', category: 'pessoal', targetAmount: 5200, currentAmount: 4680, deadline: daysFromToday(60) },
    { id: 'goal-5', createdAt: created, name: 'Quitar cartão de crédito', category: 'financeira', targetAmount: 2400, currentAmount: 2400, deadline: daysFromToday(-5), completedAt: daysFromToday(-12) },
  ]
}
