import { useEffect, useMemo, useRef } from 'react'
import { addDays, format, startOfWeek, subWeeks } from 'date-fns'
import type { ISODate } from '@/types'
import type { HabitWithStats } from '@/hooks/useHabits'
import { cn } from '@/lib/cn'
import { capitalize, locale, toISODate } from '@/utils/date'

interface HabitCalendarProps {
  habits: HabitWithStats[]
  /** `null` = todos os hábitos (intensidade por quantidade concluída). */
  selectedId: string | null
  weeks?: number
}

/* Escala sequencial de um único matiz (azul da marca), do claro ao escuro. */
const LEVELS = ['bg-surface-3', 'bg-blue-200 dark:bg-blue-950', 'bg-blue-400 dark:bg-blue-800', 'bg-blue-600 dark:bg-blue-600', 'bg-blue-800 dark:bg-blue-400']

export function HabitCalendar({ habits, selectedId, weeks = 26 }: HabitCalendarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const todayISO = toISODate(new Date())

  const { columns, activeDays, total } = useMemo(() => {
    const scope = selectedId ? habits.filter((h) => h.id === selectedId) : habits
    const start = startOfWeek(subWeeks(new Date(), weeks - 1), { weekStartsOn: 1 })
    let activeDays = 0
    const columns = Array.from({ length: weeks }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => {
        const date = addDays(start, w * 7 + d)
        const iso: ISODate = toISODate(date)
        const count = scope.filter((h) => h.dates.has(iso)).length
        if (count > 0 && iso <= todayISO) activeDays++
        const ratio = scope.length ? count / scope.length : 0
        const level = count === 0 ? 0 : selectedId ? 4 : Math.max(1, Math.ceil(ratio * 4))
        return { date, iso, count, level, future: iso > todayISO }
      }),
    )
    return { columns, activeDays, total: scope.length }
  }, [habits, selectedId, weeks, todayISO])

  // Em telas estreitas, começa mostrando as semanas mais recentes.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [])

  return (
    <div>
      <div ref={scrollRef} className="vo-scrollbar overflow-x-auto pb-2">
        <div
          role="img"
          aria-label={`Calendário de hábitos: ${activeDays} dias com pelo menos um hábito concluído nas últimas ${weeks} semanas.`}
          className="inline-flex gap-1"
        >
          <div className="mr-1 grid grid-rows-7 gap-1 pt-5 text-[10px] text-subtle" aria-hidden>
            {['Seg', '', 'Qua', '', 'Sex', '', 'Dom'].map((label, i) => (
              <span key={i} className="flex h-3.5 items-center leading-none sm:h-4">
                {label}
              </span>
            ))}
          </div>
          {columns.map((column, w) => (
            <div key={w} className="flex flex-col gap-1">
              <span className="h-4 text-[10px] whitespace-nowrap text-subtle" aria-hidden>
                {column[0].date.getDate() <= 7 ? capitalize(format(column[0].date, 'MMM', { locale }).replace('.', '')) : ''}
              </span>
              {column.map((cell) => (
                <span
                  key={cell.iso}
                  title={cell.future ? undefined : `${format(cell.date, "d 'de' MMM", { locale })}: ${cell.count}/${total} concluído${cell.count === 1 ? '' : 's'}`}
                  className={cn(
                    'size-3.5 rounded-[4px] sm:size-4',
                    cell.future ? 'bg-transparent ring-1 ring-line ring-inset' : LEVELS[cell.level],
                    cell.iso === todayISO && 'ring-2 ring-primary ring-offset-1 ring-offset-surface',
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <span>
          <strong className="vo-tabular text-fg">{activeDays}</strong> dias ativos nas últimas {weeks} semanas
        </span>
        <span className="inline-flex items-center gap-1" aria-hidden>
          Menos
          {LEVELS.map((level) => (
            <span key={level} className={cn('size-3 rounded-[3px]', level)} />
          ))}
          Mais
        </span>
      </div>
    </div>
  )
}
