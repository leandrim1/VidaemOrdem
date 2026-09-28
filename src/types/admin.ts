import type { ISODate } from './common'

export type PlanType = 'semanal' | 'mensal' | 'anual' | 'trial'
export type AdminUserStatus = 'ativo' | 'inativo' | 'trial' | 'cancelado'

export interface AdminUser {
  id: string
  name: string
  email: string
  plan: PlanType
  status: AdminUserStatus
  joinedAt: ISODate
  lastActiveAt: ISODate
  challengeProgress: number
}

export interface AdminMetric {
  label: string
  value: number
  delta: number
  format: 'number' | 'currency' | 'percent'
}
