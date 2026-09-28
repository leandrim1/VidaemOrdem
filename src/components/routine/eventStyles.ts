import { Briefcase, ListChecks, PartyPopper, type LucideIcon } from 'lucide-react'
import type { RoutineEventType } from '@/types'

export const EVENT_STYLES: Record<RoutineEventType, { icon: LucideIcon; chip: string; dot: string; label: string }> = {
  compromisso: { icon: Briefcase, chip: 'border-primary/25 bg-primary-soft text-primary-ink', dot: 'bg-primary', label: 'Compromisso' },
  tarefa: { icon: ListChecks, chip: 'border-warning/30 bg-warning-soft text-warning-ink', dot: 'bg-warning', label: 'Tarefa' },
  evento: { icon: PartyPopper, chip: 'border-success/25 bg-success-soft text-success-ink', dot: 'bg-success', label: 'Evento' },
}
