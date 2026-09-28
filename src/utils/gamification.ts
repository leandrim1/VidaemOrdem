import type { Level, PointAction } from '@/types'

export const POINTS: Record<PointAction, number> = {
  task: 10,
  habit: 5,
  checklist: 20,
  goal: 50,
  challenge: 100,
}

export const POINT_LABELS: Record<PointAction, string> = {
  task: 'Completar tarefa',
  habit: 'Completar hábito',
  checklist: 'Completar checklist',
  goal: 'Completar meta',
  challenge: 'Completar desafio',
}

export const LEVELS: Level[] = [
  { level: 1, name: 'Começando', minPoints: 0 },
  { level: 2, name: 'Em organização', minPoints: 150 },
  { level: 3, name: 'Organizado', minPoints: 400 },
  { level: 4, name: 'Consistente', minPoints: 800 },
  { level: 5, name: 'Vida em Ordem', minPoints: 1500 },
]

export function getLevel(points: number): Level {
  let current = LEVELS[0]
  for (const level of LEVELS) {
    if (points >= level.minPoints) current = level
  }
  return current
}

export function getNextLevel(points: number): Level | null {
  return LEVELS.find((level) => level.minPoints > points) ?? null
}

/** Progresso (0–100) dentro do nível atual. */
export function getLevelProgress(points: number): number {
  const current = getLevel(points)
  const next = getNextLevel(points)
  if (!next) return 100
  return Math.min(100, Math.round(((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100))
}
