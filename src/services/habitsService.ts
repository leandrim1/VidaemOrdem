import type { Habit, HabitLog, ISODate } from '@/types'
import { delay } from '@/lib/delay'
import { createCollectionService, readCollection, writeCollection } from './collection'
import { COLLECTIONS } from './collections'

const base = createCollectionService<Habit>(COLLECTIONS.habits)

export const habitsService = {
  ...base,

  async remove(id: string) {
    await base.remove(id)
    writeCollection(
      COLLECTIONS.habitLogs,
      readCollection<HabitLog>(COLLECTIONS.habitLogs).filter((log) => log.habitId !== id),
    )
  },

  async listLogs(): Promise<HabitLog[]> {
    await delay()
    return readCollection<HabitLog>(COLLECTIONS.habitLogs)
  },

  /** Marca/desmarca o hábito em uma data. Retorna `true` se ficou concluído. */
  async toggleLog(habitId: string, date: ISODate): Promise<boolean> {
    await delay(60)
    const logs = readCollection<HabitLog>(COLLECTIONS.habitLogs)
    const exists = logs.some((log) => log.habitId === habitId && log.date === date)
    const next = exists
      ? logs.filter((log) => !(log.habitId === habitId && log.date === date))
      : [...logs, { id: `${habitId}-${date}`, habitId, date }]
    writeCollection(COLLECTIONS.habitLogs, next)
    return !exists
  },
}
