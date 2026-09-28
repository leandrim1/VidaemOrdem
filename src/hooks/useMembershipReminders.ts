import { useEffect } from 'react'
import type { MembershipAccess } from '@/types'
import { PATHS } from '@/routes/paths'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatDaysLeft } from '@/utils/membership'

/** Avisa (uma única vez) quando o teste está acabando e quando ele termina. */
export function useMembershipReminders(access: MembershipAccess | null) {
  const pushOnce = useNotificationStore((s) => s.pushOnce)
  const state = access?.state
  const daysLeft = access?.daysLeft ?? 0
  const endsAt = access?.endsAt
  const reason = access?.reason

  useEffect(() => {
    if (!state || !endsAt) return
    if (state === 'trial' && daysLeft <= 2) {
      void pushOnce(`trial-ending:${endsAt}`, {
        kind: 'billing',
        title: 'Teste grátis terminando',
        message: `Seu teste grátis termina ${daysLeft <= 0 ? 'hoje' : `em ${formatDaysLeft(daysLeft)}`}. Nada será cobrado automaticamente.`,
        href: PATHS.plan,
      })
    }
    if (state === 'expired') {
      void pushOnce(`access-ended:${endsAt}`, {
        kind: 'billing',
        title: reason === 'trial' ? 'Teste grátis encerrado' : 'Assinatura encerrada',
        message: 'Seus dados continuam salvos. Escolha um plano para voltar a usar todos os recursos.',
        href: PATHS.plan,
      })
    }
  }, [state, daysLeft, endsAt, reason, pushOnce])
}
