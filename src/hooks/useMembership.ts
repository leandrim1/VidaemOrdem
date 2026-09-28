import { useCallback, useMemo } from 'react'
import type { BillingPlan } from '@/types'
import { getPlan } from '@/data/plans'
import { withFeedback } from '@/lib/feedback'
import { PATHS } from '@/routes/paths'
import { billingService } from '@/services/billingService'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDate } from '@/utils/format'
import { getAccess, resolveMembership } from '@/utils/membership'

export function useMembership() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  const membership = useMemo(() => (user ? resolveMembership(user) : null), [user])
  const access = useMemo(() => (membership ? getAccess(membership) : null), [membership])

  const subscribe = useCallback(
    (planId: BillingPlan) =>
      withFeedback(async () => {
        const updated = await billingService.startCheckout(planId)
        setUser(updated)
        const plan = getPlan(planId)
        void useNotificationStore.getState().push({
          kind: 'billing',
          title: 'Assinatura ativada',
          message: `Plano ${plan.name} ativo. Garantia de 7 dias: se não gostar, devolvemos 100%.`,
          href: PATHS.plan,
        })
      }, 'Assinatura ativada! Obrigado por assinar o Vida em Ordem.'),
    [setUser],
  )

  const cancel = useCallback(
    () =>
      withFeedback(async () => {
        setUser(await billingService.cancel())
      }, 'Assinatura cancelada. Você mantém o acesso até o fim do período pago.'),
    [setUser],
  )

  const resume = useCallback(
    () =>
      withFeedback(async () => {
        setUser(await billingService.resume())
      }, 'Assinatura reativada.'),
    [setUser],
  )

  const statusLabel = useMemo(() => {
    if (!access) return ''
    if (access.state === 'trial') return `Teste grátis · termina em ${formatDate(access.endsAt, "d 'de' MMM")}`
    if (access.state === 'active') {
      const plan = access.plan ? getPlan(access.plan).name : ''
      return access.cancelAtPeriodEnd ? `Plano ${plan} · acesso até ${formatDate(access.endsAt, "d 'de' MMM")}` : `Plano ${plan} · renova em ${formatDate(access.endsAt, "d 'de' MMM")}`
    }
    return access.reason === 'trial' ? 'Teste grátis encerrado' : 'Assinatura encerrada'
  }, [access])

  return { membership, access, statusLabel, subscribe, cancel, resume }
}
