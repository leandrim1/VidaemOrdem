import { subDays } from 'date-fns'
import type { Task, TaskCategory, TaskPriority } from '@/types'
import { daysFromToday } from '@/utils/date'

type Seed = [title: string, category: TaskCategory, priority: TaskPriority, dueOffset: number, completedOffset?: number]

const SEEDS: Seed[] = [
  // Hoje (5 pendentes)
  ['Pagar conta de luz', 'financas', 'high', 0],
  ['Enviar relatório mensal para o gestor', 'trabalho', 'high', 0],
  ['Revisar orçamento da semana', 'financas', 'medium', 0],
  ['Agendar consulta no dentista', 'saude', 'medium', 0],
  ['Separar roupas para doação', 'casa', 'low', 0],
  // Próximas
  ['Estudar módulo 3 do curso de UX', 'estudos', 'medium', 1],
  ['Reunião de planejamento trimestral', 'trabalho', 'high', 2],
  ['Organizar pasta de documentos', 'casa', 'medium', 3],
  ['Comprar presente da Ana', 'pessoal', 'low', 4],
  ['Renovar CNH', 'pessoal', 'high', 12],
  // Concluídas
  ['Lavar o carro', 'casa', 'low', -1, 1],
  ['Cancelar assinatura que não uso', 'financas', 'medium', -2, 2],
  ['Pagar aluguel', 'financas', 'high', -3, 3],
  ['Fazer compras do mês', 'casa', 'medium', -4, 4],
  ['Pagar fatura do cartão XP', 'financas', 'high', -5, 5],
  ['Atualizar currículo', 'trabalho', 'medium', -6, 6],
  ['Levar notebook para manutenção', 'pessoal', 'low', -7, 7],
  ['Marcar check-up anual', 'saude', 'medium', -8, 8],
  ['Organizar gaveta de cabos', 'casa', 'low', -9, 9],
  ['Ligar para a operadora de internet', 'casa', 'low', -10, 10],
]

export function createMockTasks(): Task[] {
  const now = new Date()
  return SEEDS.map(([title, category, priority, dueOffset, completedOffset], index) => ({
    id: `task-${index + 1}`,
    createdAt: subDays(now, Math.max(1, (completedOffset ?? 0) + 2)).toISOString(),
    title,
    category,
    priority,
    dueDate: daysFromToday(dueOffset),
    completed: completedOffset !== undefined,
    completedAt: completedOffset !== undefined ? subDays(now, completedOffset).toISOString() : undefined,
  }))
}
