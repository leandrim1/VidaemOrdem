import { Briefcase, GraduationCap, HeartPulse, House, PiggyBank, Plane, Star, type LucideIcon } from 'lucide-react'
import type { GoalCategory } from '@/types'

export const GOAL_ICONS: Record<GoalCategory, LucideIcon> = {
  financeira: PiggyBank,
  viagem: Plane,
  educacao: GraduationCap,
  saude: HeartPulse,
  carreira: Briefcase,
  casa: House,
  pessoal: Star,
}
