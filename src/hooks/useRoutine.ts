import { useCallback, useMemo } from 'react'
import type { EntityInput, RoutineEvent } from '@/types'
import { withFeedback } from '@/lib/feedback'
import { useRoutineStore } from '@/stores/dataStores'
import { MESSAGES } from '@/stores/toastStore'
import { useCollectionResource } from './useCollectionResource'

export type RoutineEventInput = EntityInput<RoutineEvent>

export function useRoutine() {
  const resource = useCollectionResource(useRoutineStore)
  const { items, create, update, remove } = resource

  const events = useMemo(
    () => [...items].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)),
    [items],
  )

  /** Eventos agrupados por data (`yyyy-MM-dd`). */
  const byDate = useMemo(() => {
    const map = new Map<string, RoutineEvent[]>()
    for (const event of events) {
      const list = map.get(event.date) ?? []
      list.push(event)
      map.set(event.date, list)
    }
    return map
  }, [events])

  const addEvent = useCallback((input: RoutineEventInput) => withFeedback(() => create(input), MESSAGES.saved), [create])
  const updateEvent = useCallback(
    (id: string, input: Partial<RoutineEventInput>) => withFeedback(() => update(id, input), MESSAGES.saved),
    [update],
  )
  const deleteEvent = useCallback((id: string) => withFeedback(() => remove(id), MESSAGES.deleted), [remove])

  return { ...resource, events, byDate, addEvent, updateEvent, deleteEvent }
}
