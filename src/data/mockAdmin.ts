import { format, subDays, subMonths, subWeeks } from 'date-fns'
import type { AdminMetric, AdminUser, AdminUserStatus, PlanType } from '@/types'
import { createRandom } from '@/lib/random'
import { capitalize, locale, toISODate } from '@/utils/date'

export const ADMIN_METRICS: AdminMetric[] = [
  { label: 'Usuários', value: 12847, delta: 8.2, format: 'number' },
  { label: 'Usuários ativos', value: 8932, delta: 5.4, format: 'number' },
  { label: 'Novos usuários (30 dias)', value: 1284, delta: 12.6, format: 'number' },
  { label: 'Receita (mês)', value: 184320, delta: 9.8, format: 'currency' },
  { label: 'Vendas (mês)', value: 3412, delta: 6.1, format: 'number' },
  { label: 'Conclusão do desafio', value: 64, delta: 3.2, format: 'percent' },
]

export function createRevenueSeries(): Array<{ label: string; receita: number }> {
  const values = [98400, 104200, 112900, 118300, 126700, 131800, 139500, 147200, 155900, 163400, 171800, 184320]
  return values.map((receita, index) => ({
    label: capitalize(format(subMonths(new Date(), values.length - 1 - index), 'MMM', { locale }).replace('.', '')),
    receita,
  }))
}

export function createSignupSeries(): Array<{ label: string; cadastros: number }> {
  const values = [212, 238, 225, 261, 274, 259, 298, 312, 287, 331, 346, 362]
  return values.map((cadastros, index) => ({
    label: format(subWeeks(new Date(), values.length - 1 - index), 'dd/MM'),
    cadastros,
  }))
}

export const PLAN_DISTRIBUTION = [
  { plan: 'Anual', value: 6128, color: 'var(--vo-chart-1)' },
  { plan: 'Mensal', value: 3624, color: 'var(--vo-chart-2)' },
  { plan: 'Semanal', value: 587, color: 'var(--vo-chart-3)' },
  { plan: 'Teste grátis', value: 2508, color: 'var(--vo-chart-4)' },
]

export const CHALLENGE_FUNNEL = [
  { day: 'Dia 1', usuarios: 4820 },
  { day: 'Dia 2', usuarios: 4390 },
  { day: 'Dia 3', usuarios: 4012 },
  { day: 'Dia 4', usuarios: 3710 },
  { day: 'Dia 5', usuarios: 3455 },
  { day: 'Dia 6', usuarios: 3268 },
  { day: 'Dia 7', usuarios: 3085 },
]

const FIRST_NAMES = ['Ana', 'Bruno', 'Camila', 'Diego', 'Eduarda', 'Felipe', 'Gabriela', 'Henrique', 'Isabela', 'João', 'Larissa', 'Marcos', 'Natália', 'Otávio', 'Paula', 'Rafael', 'Sofia', 'Thiago', 'Vanessa', 'Yuri', 'Beatriz', 'Caio', 'Débora', 'Lucas']
const LAST_NAMES = ['Souza', 'Almeida', 'Costa', 'Ferreira', 'Ribeiro', 'Carvalho', 'Gomes', 'Martins', 'Rocha', 'Barbosa', 'Pereira', 'Lima', 'Araújo', 'Mendes', 'Nunes', 'Teixeira']

function slug(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

export function createAdminUsers(count = 48): AdminUser[] {
  const random = createRandom(4242)
  const statuses: AdminUserStatus[] = ['ativo', 'ativo', 'ativo', 'trial', 'inativo', 'cancelado']
  return Array.from({ length: count }, (_, index) => {
    const first = FIRST_NAMES[Math.floor(random() * FIRST_NAMES.length)]
    const last = LAST_NAMES[Math.floor(random() * LAST_NAMES.length)]
    const status = statuses[Math.floor(random() * statuses.length)]
    const roll = random()
    const plan: PlanType = status === 'trial' ? 'trial' : roll < 0.5 ? 'anual' : roll < 0.88 ? 'mensal' : 'semanal'
    const daysAgo = Math.floor(random() * 300) + 1
    const joined = subDays(new Date(), daysAgo)
    const inactiveFor = Math.min(daysAgo, Math.floor(random() * (status === 'ativo' || status === 'trial' ? 6 : 60)))
    return {
      id: `usr-${index + 1}`,
      name: `${first} ${last}`,
      email: `${slug(first)}.${slug(last)}${index}@email.com`,
      plan,
      status,
      joinedAt: toISODate(joined),
      lastActiveAt: toISODate(subDays(new Date(), inactiveFor)),
      challengeProgress: Math.min(7, Math.floor(random() * 8)),
    }
  }).sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
}
