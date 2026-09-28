import type { BillingPlan, PlanOption } from '@/types'

export const TRIAL_DAYS = 7

/** Catálogo único de planos: usado na landing, na página "Meu plano" e no checkout. */
export const PLANS: PlanOption[] = [
  {
    id: 'semanal',
    name: 'Semanal',
    price: 6.9,
    priceLabel: '6,90',
    periodLabel: '/semana',
    periodDays: 7,
    renewalLabel: 'toda semana',
    billingNote: 'Cobrado toda semana. Ideal para experimentar sem compromisso.',
  },
  {
    id: 'mensal',
    name: 'Mensal',
    price: 19.9,
    priceLabel: '19,90',
    periodLabel: '/mês',
    periodDays: 30,
    renewalLabel: 'todo mês',
    billingNote: 'Cobrado mensalmente. Cancele quando quiser.',
  },
  {
    id: 'anual',
    name: 'Anual',
    price: 178.8,
    priceLabel: '14,90',
    periodLabel: '/mês',
    periodDays: 365,
    renewalLabel: 'todo ano',
    billingNote: 'R$ 178,80 cobrados uma vez por ano. Economize 25%.',
    featured: true,
  },
]

export const PLAN_FEATURES = [
  'Todos os 12 módulos',
  'Desafio de 7 dias guiado',
  'Checklists prontos e personalizáveis',
  'Tema claro e escuro',
  'Exportação dos seus dados',
  'Suporte por e-mail',
]

export function getPlan(id: BillingPlan): PlanOption {
  return PLANS.find((plan) => plan.id === id) ?? PLANS[1]
}
