import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useGamificationStore } from '@/stores/gamificationStore'
import { getLevel, getLevelProgress, getNextLevel } from '@/utils/gamification'

export function useGamification() {
  const { data, status, load } = useGamificationStore(useShallow((s) => ({ data: s.data, status: s.status, load: s.load })))

  // Recarrega sempre que o store volta a "idle" (ex.: troca de usuário ou restauração de dados).
  useEffect(() => {
    if (status === 'idle') void load()
  }, [status, load])

  return {
    points: data.points,
    history: data.history,
    level: getLevel(data.points),
    nextLevel: getNextLevel(data.points),
    progress: getLevelProgress(data.points),
    isLoading: status === 'idle' || status === 'loading',
  }
}
