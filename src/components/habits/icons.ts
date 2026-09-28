import { BookOpen, Brain, Droplets, Dumbbell, Footprints, GraduationCap, Heart, Moon, type LucideIcon } from 'lucide-react'
import type { HabitIcon } from '@/types'

export const HABIT_ICONS: Record<HabitIcon, { icon: LucideIcon; label: string }> = {
  book: { icon: BookOpen, label: 'Leitura' },
  walk: { icon: Footprints, label: 'Caminhada' },
  water: { icon: Droplets, label: 'Água' },
  study: { icon: GraduationCap, label: 'Estudo' },
  dumbbell: { icon: Dumbbell, label: 'Exercício' },
  brain: { icon: Brain, label: 'Meditação' },
  sleep: { icon: Moon, label: 'Sono' },
  heart: { icon: Heart, label: 'Bem-estar' },
}
