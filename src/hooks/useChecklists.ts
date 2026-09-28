import { useCallback, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { Checklist } from '@/types'
import { withFeedback } from '@/lib/feedback'
import { useChecklistsStore } from '@/stores/checklistsStore'
import { useGamificationStore } from '@/stores/gamificationStore'
import { MESSAGES, toast } from '@/stores/toastStore'

export function checklistProgress(checklist: Pick<Checklist, 'items'>) {
  const done = checklist.items.filter((i) => i.done).length
  const total = checklist.items.length
  return { done, total, percent: total ? (done / total) * 100 : 0, complete: total > 0 && done === total }
}

export function useChecklists() {
  const { checklists, status, error, load, toggleItem, addItem, removeItem, resetChecklist } = useChecklistsStore(
    useShallow((s) => ({
      checklists: s.checklists,
      status: s.status,
      error: s.error,
      load: s.load,
      toggleItem: s.toggleItem,
      addItem: s.addItem,
      removeItem: s.removeItem,
      resetChecklist: s.resetChecklist,
    })),
  )
  const award = useGamificationStore((s) => s.award)

  // Recarrega sempre que o store volta a "idle" (ex.: troca de usuário ou restauração de dados).
  useEffect(() => {
    if (status === 'idle') void load()
  }, [status, load])

  const toggle = useCallback(
    async (checklistId: string, itemId: string) => {
      try {
        const updated = await toggleItem(checklistId, itemId)
        if (checklistProgress(updated).complete) {
          const points = await award('checklist', `checklist:${updated.id}`, `Checklist concluído: ${updated.title}`)
          if (points === 0) toast.success('Checklist concluído!')
        }
      } catch {
        toast.error('Não foi possível atualizar o item.')
      }
    },
    [toggleItem, award],
  )

  return {
    checklists,
    status,
    error,
    isLoading: status === 'idle' || status === 'loading',
    isError: status === 'error',
    reload: () => load(true),
    toggle,
    addItem: (checklistId: string, label: string) => withFeedback(() => addItem(checklistId, label), 'Item adicionado.'),
    removeItem: (checklistId: string, itemId: string) => withFeedback(() => removeItem(checklistId, itemId), MESSAGES.deleted),
    resetChecklist: (checklistId: string) => withFeedback(() => resetChecklist(checklistId), 'Checklist reiniciado.'),
  }
}
