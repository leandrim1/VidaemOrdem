import type { ISODateTime } from './common'

export type BillingPlan = 'semanal' | 'mensal' | 'anual'

/**
 * Plano do usuário. O período de teste é sem cartão e sem cobrança automática:
 * ao fim dele o acesso fica limitado até o usuário escolher um plano.
 */
export interface Membership {
  trialEndsAt: ISODateTime
  plan: BillingPlan | null
  subscribedAt: ISODateTime | null
  currentPeriodEnd: ISODateTime | null
  /** Assinatura cancelada: continua ativa até `currentPeriodEnd` e não renova. */
  cancelAtPeriodEnd: boolean
}

export type AccessState = 'trial' | 'active' | 'expired'

export interface MembershipAccess {
  state: AccessState
  /** Dias restantes do teste, até a renovação ou até o fim do acesso. */
  daysLeft: number
  endsAt: ISODateTime
  plan: BillingPlan | null
  cancelAtPeriodEnd: boolean
  reason: 'trial' | 'subscription'
}

export interface PlanOption {
  id: BillingPlan
  name: string
  /** Valor cobrado por período. */
  price: number
  /** Preço exibido em destaque (no anual, o equivalente mensal). */
  priceLabel: string
  periodLabel: string
  periodDays: number
  renewalLabel: string
  billingNote: string
  featured?: boolean
}
