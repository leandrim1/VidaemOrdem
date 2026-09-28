import type { ISODateTime } from './common'
import type { ChecklistItem } from './checklists'

export interface ChallengeDay {
  day: number
  title: string
  description: string
  tip: string
  items: ChecklistItem[]
  completedAt?: ISODateTime
}

export interface Challenge {
  id: string
  title: string
  startedAt: ISODateTime
  days: ChallengeDay[]
  completedAt?: ISODateTime
}
