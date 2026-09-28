import { addDays, parseISO } from 'date-fns'
import type { Membership, MembershipAccess, User } from '@/types'
import { getPlan, TRIAL_DAYS } from '@/data/plans'

const DAY_MS = 86_400_000

export function createTrialMembership(start: Date = new Date(), days = TRIAL_DAYS): Membership {
  return { trialEndsAt: addDays(start, days).toISOString(), plan: null, subscribedAt: null, currentPeriodEnd: null, cancelAtPeriodEnd: false }
}

/** Contas criadas antes do controle de planos ganham o teste a partir do cadastro. */
export function resolveMembership(user: Pick<User, 'membership' | 'createdAt'>): Membership {
  return user.membership ?? createTrialMembership(parseISO(user.createdAt))
}

function daysUntil(end: number, now: number): number {
  return Math.max(0, Math.ceil((end - now) / DAY_MS))
}

export function getAccess(membership: Membership, now: Date = new Date()): MembershipAccess {
  const t = now.getTime()

  if (membership.plan && membership.currentPeriodEnd) {
    let end = new Date(membership.currentPeriodEnd).getTime()
    if (end <= t && membership.cancelAtPeriodEnd) {
      return { state: 'expired', daysLeft: 0, endsAt: membership.currentPeriodEnd, plan: membership.plan, cancelAtPeriodEnd: true, reason: 'subscription' }
    }
    // Sem cancelamento a assinatura renova sozinha: calcula a próxima renovação.
    const period = getPlan(membership.plan).periodDays * DAY_MS
    while (end <= t) end += period
    return {
      state: 'active',
      daysLeft: daysUntil(end, t),
      endsAt: new Date(end).toISOString(),
      plan: membership.plan,
      cancelAtPeriodEnd: membership.cancelAtPeriodEnd,
      reason: 'subscription',
    }
  }

  const trialEnd = new Date(membership.trialEndsAt).getTime()
  if (trialEnd > t) {
    return { state: 'trial', daysLeft: daysUntil(trialEnd, t), endsAt: membership.trialEndsAt, plan: null, cancelAtPeriodEnd: false, reason: 'trial' }
  }
  return { state: 'expired', daysLeft: 0, endsAt: membership.trialEndsAt, plan: null, cancelAtPeriodEnd: false, reason: 'trial' }
}

export function formatDaysLeft(days: number): string {
  if (days <= 0) return 'hoje'
  return days === 1 ? '1 dia' : `${days} dias`
}
