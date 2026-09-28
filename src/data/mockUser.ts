import { subDays, subHours } from 'date-fns'
import type { GamificationState, User } from '@/types'
import { createTrialMembership } from '@/utils/membership'

export const DEMO_USER_ID = 'demo-mariana'

export function createMockUser(): User {
  return {
    id: DEMO_USER_ID,
    name: 'Mariana Oliveira',
    email: 'mariana@vidaemordem.app',
    role: 'admin',
    isDemo: true,
    // Demonstração no meio do teste grátis (5 dias restantes).
    membership: createTrialMembership(new Date(), 5),
    createdAt: subDays(new Date(), 94).toISOString(),
    onboarding: {
      mainGoal: 'tudo',
      currentState: 'razoavel',
      firstFocus: 'financas',
      completedAt: subDays(new Date(), 94).toISOString(),
    },
  }
}

export function createMockGamification(): GamificationState {
  const at = (days: number, hours = 0) => subHours(subDays(new Date(), days), hours).toISOString()
  return {
    points: 620,
    awardedKeys: [],
    history: [
      { id: 'pe-1', action: 'task', points: 10, label: 'Tarefa concluída: Lavar o carro', createdAt: at(1, 2) },
      { id: 'pe-2', action: 'habit', points: 5, label: 'Hábito: Beber 2L de água', createdAt: at(1, 1) },
      { id: 'pe-3', action: 'task', points: 10, label: 'Tarefa concluída: Cancelar assinatura que não uso', createdAt: at(2, 3) },
      { id: 'pe-4', action: 'checklist', points: 20, label: 'Desafio — Dia 2 concluído', createdAt: at(3, 4) },
      { id: 'pe-5', action: 'task', points: 10, label: 'Tarefa concluída: Pagar aluguel', createdAt: at(3, 1) },
      { id: 'pe-6', action: 'checklist', points: 20, label: 'Desafio — Dia 1 concluído', createdAt: at(4, 5) },
      { id: 'pe-7', action: 'habit', points: 5, label: 'Hábito: Caminhar 30 minutos', createdAt: at(4, 2) },
      { id: 'pe-8', action: 'goal', points: 50, label: 'Meta concluída: Quitar cartão de crédito', createdAt: at(12, 3) },
    ],
  }
}
