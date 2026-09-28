import { delay } from '@/lib/delay'
import {
  ADMIN_METRICS,
  CHALLENGE_FUNNEL,
  PLAN_DISTRIBUTION,
  createAdminUsers,
  createRevenueSeries,
  createSignupSeries,
} from '@/data/mockAdmin'

/** Dados agregados do painel administrativo (mock). */
export const adminService = {
  async getOverview() {
    await delay(350)
    return {
      metrics: ADMIN_METRICS,
      revenue: createRevenueSeries(),
      signups: createSignupSeries(),
      plans: PLAN_DISTRIBUTION,
      funnel: CHALLENGE_FUNNEL,
      users: createAdminUsers(),
    }
  },
}

export type AdminOverview = Awaited<ReturnType<typeof adminService.getOverview>>
