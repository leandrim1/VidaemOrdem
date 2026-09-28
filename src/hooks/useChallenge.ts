import { useCallback, useEffect, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { getErrorMessage } from '@/services/errors'
import { useChallengeStore } from '@/stores/challengeStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { toast } from '@/stores/toastStore'

export function useChallenge() {
  const { challenge, status, error, load, toggleItem, completeDay, restart } = useChallengeStore(
    useShallow((s) => ({
      challenge: s.challenge,
      status: s.status,
      error: s.error,
      load: s.load,
      toggleItem: s.toggleItem,
      completeDay: s.completeDay,
      restart: s.restart,
    })),
  )
  const award = useGamificationStore((s) => s.award)

  // Recarrega sempre que o store volta a "idle" (ex.: troca de usuário ou restauração de dados).
  useEffect(() => {
    if (status === 'idle') void load()
  }, [status, load])

  const summary = useMemo(() => {
    const days = challenge?.days ?? []
    const completedDays = days.filter((d) => d.completedAt).length
    const currentDay = days.find((d) => !d.completedAt)?.day ?? days.length
    return {
      completedDays,
      totalDays: days.length,
      currentDay,
      progress: days.length ? (completedDays / days.length) * 100 : 0,
      finished: days.length > 0 && completedDays === days.length,
    }
  }, [challenge])

  const toggle = useCallback(
    async (day: number, itemId: string) => {
      try {
        await toggleItem(day, itemId)
      } catch {
        toast.error('Não foi possível atualizar o item.')
      }
    },
    [toggleItem],
  )

  /** Conclui o dia; retorna `'day' | 'challenge'` conforme o que foi concluído, ou `null` em caso de erro. */
  const finishDay = useCallback(
    async (day: number): Promise<'day' | 'challenge' | null> => {
      try {
        const updated = await completeDay(day)
        const target = updated.days.find((d) => d.day === day)
        await award('checklist', `challenge-day:${day}:${updated.startedAt}`, `Desafio — Dia ${day} concluído`)
        if (updated.completedAt) {
          await award('challenge', `challenge:${updated.startedAt}`, 'Desafio de 7 dias concluído!')
          void useNotificationStore.getState().push({
            kind: 'achievement',
            title: 'Desafio concluído',
            message: 'Você completou os 7 dias para colocar sua vida em ordem. Parabéns!',
            href: '/app/desafio',
          })
          return 'challenge'
        }
        return target ? 'day' : null
      } catch (error) {
        toast.error('Não foi possível concluir o dia', getErrorMessage(error))
        return null
      }
    },
    [completeDay, award],
  )

  const restartChallenge = useCallback(async () => {
    try {
      await restart()
      toast.success('Desafio reiniciado. Bora de novo!')
    } catch {
      toast.error('Não foi possível reiniciar o desafio.')
    }
  }, [restart])

  return {
    challenge,
    summary,
    status,
    error,
    isLoading: status === 'idle' || status === 'loading',
    isError: status === 'error',
    reload: () => load(true),
    toggle,
    finishDay,
    restartChallenge,
  }
}
