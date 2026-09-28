import { useCallback, useEffect, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import type { DigitalArea } from '@/types'
import { DIGITAL_AREAS } from '@/data/mockChecklists'
import { withFeedback } from '@/lib/feedback'
import { useDigitalStore } from '@/stores/checklistsStore'
import { toast } from '@/stores/toastStore'

export function useDigitalOrganization() {
  const { items, status, error, load, toggle, resetProgress } = useDigitalStore(
    useShallow((s) => ({ items: s.items, status: s.status, error: s.error, load: s.load, toggle: s.toggle, resetProgress: s.resetProgress })),
  )

  // Recarrega sempre que o store volta a "idle" (ex.: troca de usuário ou restauração de dados).
  useEffect(() => {
    if (status === 'idle') void load()
  }, [status, load])

  const areas = useMemo(
    () =>
      DIGITAL_AREAS.map((area) => {
        const areaItems = items.filter((i) => i.area === area.value)
        const done = areaItems.filter((i) => i.done).length
        return { ...area, items: areaItems, done, total: areaItems.length, progress: areaItems.length ? (done / areaItems.length) * 100 : 0 }
      }),
    [items],
  )
  const done = items.filter((i) => i.done).length
  const progress = items.length ? Math.round((done / items.length) * 100) : 0

  const toggleItem = useCallback(
    async (id: string, area: DigitalArea) => {
      try {
        await toggle(id)
        const areaItems = useDigitalStore.getState().items.filter((i) => i.area === area)
        const item = areaItems.find((i) => i.id === id)
        if (item?.done && areaItems.every((i) => i.done)) {
          toast.success('Área concluída!', `${DIGITAL_AREAS.find((a) => a.value === area)?.label} está em ordem.`)
        }
      } catch {
        toast.error('Não foi possível atualizar o item.')
      }
    },
    [toggle],
  )

  const reset = useCallback(() => withFeedback(resetProgress, 'Progresso reiniciado.'), [resetProgress])

  return {
    items,
    areas,
    done,
    total: items.length,
    progress,
    status,
    error,
    isLoading: status === 'idle' || status === 'loading',
    isError: status === 'error',
    reload: () => load(true),
    toggleItem,
    reset,
  }
}
