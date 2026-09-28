import type { ISODateTime } from './common'

export type NotificationKind = 'bill' | 'task' | 'goal' | 'habit' | 'achievement' | 'billing' | 'system'

export interface Notification {
  id: string
  kind: NotificationKind
  title: string
  message: string
  createdAt: ISODateTime
  read: boolean
  /** Rota interna para onde a notificação leva. */
  href?: string
}
