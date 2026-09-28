import { subDays, subHours } from 'date-fns'
import type { Notification } from '@/types'

export function createMockNotifications(): Notification[] {
  const now = new Date()
  return [
    { id: 'ntf-1', kind: 'bill', title: 'Conta vencendo', message: 'Uma conta vence amanhã: Conta de luz — R$ 164,30.', createdAt: subHours(now, 1).toISOString(), read: false, href: '/app/contas' },
    { id: 'ntf-2', kind: 'task', title: 'Tarefas do dia', message: 'Você tem 5 tarefas hoje.', createdAt: subHours(now, 3).toISOString(), read: false, href: '/app/tarefas' },
    { id: 'ntf-3', kind: 'goal', title: 'Meta avançando', message: 'Sua meta está 72% concluída: Viagem para Lisboa.', createdAt: subDays(now, 1).toISOString(), read: false, href: '/app/metas' },
    { id: 'ntf-4', kind: 'habit', title: 'Sequência incrível', message: 'Você completou seu hábito por 7 dias seguidos: Beber 2L de água.', createdAt: subDays(now, 1).toISOString(), read: true, href: '/app/habitos' },
    { id: 'ntf-5', kind: 'bill', title: 'Conta atrasada', message: 'A conta de água venceu há 2 dias. Que tal resolver hoje?', createdAt: subDays(now, 2).toISOString(), read: true, href: '/app/contas' },
    { id: 'ntf-6', kind: 'achievement', title: 'Novo nível', message: 'Você alcançou o nível 3 — Organizado. Continue assim!', createdAt: subDays(now, 5).toISOString(), read: true, href: '/app/perfil' },
  ]
}

export function createWelcomeNotifications(name: string): Notification[] {
  return [
    {
      id: 'ntf-welcome',
      kind: 'system',
      title: 'Boas-vindas',
      message: `Olá, ${name}! Comece pelo Desafio de 7 dias para organizar tudo passo a passo.`,
      createdAt: new Date().toISOString(),
      read: false,
      href: '/app/desafio',
    },
  ]
}
