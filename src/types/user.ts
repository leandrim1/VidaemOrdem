import type { ISODateTime } from './common'

export type UserRole = 'user' | 'admin'

export type OnboardingGoal = 'financas' | 'rotina' | 'metas' | 'vida' | 'tudo'
export type OrganizationLevel = 'caotica' | 'desorganizada' | 'razoavel' | 'organizada'
export type FirstFocus = 'financas' | 'tarefas' | 'metas' | 'rotina' | 'documentos' | 'digital'

export interface OnboardingAnswers {
  mainGoal: OnboardingGoal
  currentState: OrganizationLevel
  firstFocus: FirstFocus
  completedAt: ISODateTime
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
  createdAt: ISODateTime
  onboarding?: OnboardingAnswers
  isDemo?: boolean
}

export interface Credentials {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface Session {
  userId: string
  token: string
  expiresAt: ISODateTime
}
