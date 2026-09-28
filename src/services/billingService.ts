import { addDays } from 'date-fns'
import type { BillingPlan, User } from '@/types'
import { getPlan } from '@/data/plans'
import { delay } from '@/lib/delay'
import { resolveMembership } from '@/utils/membership'
import { authService } from './authService'
import { ServiceError } from './errors'

async function currentUser(): Promise<User> {
  const user = await authService.getCurrentUser()
  if (!user) throw new ServiceError('unauthenticated', 'Sua sessão expirou. Entre novamente.')
  return user
}

/**
 * Assinaturas (modo demonstração — nenhum pagamento é processado).
 *
 * Com um gateway real (Stripe, Mercado Pago, Pagar.me…):
 * - `startCheckout` chama o backend (ex.: POST /api/billing/checkout), que cria
 *   a sessão de checkout hospedada pelo gateway e devolve a URL para redirecionar.
 *   Dados de cartão nunca passam pelo frontend.
 * - `cancel`/`resume` chamam o backend, que atualiza a assinatura no gateway.
 * - O plano do usuário é atualizado pelo webhook do gateway no banco de dados.
 */
export const billingService = {
  async startCheckout(planId: BillingPlan): Promise<User> {
    await delay(900)
    const user = await currentUser()
    const plan = getPlan(planId)
    const now = new Date()
    return authService.setMembership({
      ...resolveMembership(user),
      plan: plan.id,
      subscribedAt: now.toISOString(),
      currentPeriodEnd: addDays(now, plan.periodDays).toISOString(),
      cancelAtPeriodEnd: false,
    })
  },

  async cancel(): Promise<User> {
    await delay(500)
    const membership = resolveMembership(await currentUser())
    if (!membership.plan) throw new ServiceError('validation', 'Você não tem uma assinatura ativa.')
    return authService.setMembership({ ...membership, cancelAtPeriodEnd: true })
  },

  async resume(): Promise<User> {
    await delay(500)
    const membership = resolveMembership(await currentUser())
    if (!membership.plan) throw new ServiceError('validation', 'Você não tem uma assinatura para reativar.')
    return authService.setMembership({ ...membership, cancelAtPeriodEnd: false })
  },
}
