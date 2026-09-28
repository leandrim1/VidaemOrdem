import type { Entity } from './common'

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
}

export type ChecklistIcon = 'finance' | 'calendar' | 'home' | 'travel' | 'moving' | 'digital' | 'documents'

export interface Checklist extends Entity {
  title: string
  description: string
  icon: ChecklistIcon
  items: ChecklistItem[]
}

export type DigitalArea = 'celular' | 'computador' | 'email' | 'arquivos' | 'fotos'

export interface DigitalItem extends ChecklistItem {
  area: DigitalArea
}
