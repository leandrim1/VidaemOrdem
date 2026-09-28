import { useCallback, useMemo, useState } from 'react'
import {
  addDays,
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import type { RoutineEvent, RoutineViewMode } from '@/types'
import { cn } from '@/lib/cn'
import { useEditor } from '@/hooks/useDisclosure'
import { useQueryAction } from '@/hooks/useQueryAction'
import { useRoutine } from '@/hooks/useRoutine'
import { confirm } from '@/stores/confirmStore'
import { capitalize, locale, toISODate } from '@/utils/date'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States'
import { Tabs } from '@/components/ui/Tabs'
import { EventChip } from '@/components/routine/EventChip'
import { RoutineEventFormModal } from '@/components/routine/RoutineEventFormModal'
import { EVENT_STYLES } from '@/components/routine/eventStyles'

const WEEK_OPTIONS = { weekStartsOn: 1 as const, locale }

function rangeLabel(view: RoutineViewMode, cursor: Date) {
  if (view === 'day') return capitalize(format(cursor, "EEEE, d 'de' MMMM", { locale }))
  if (view === 'month') return capitalize(format(cursor, 'MMMM yyyy', { locale }))
  const start = startOfWeek(cursor, WEEK_OPTIONS)
  const end = endOfWeek(cursor, WEEK_OPTIONS)
  return isSameMonth(start, end)
    ? `${format(start, 'd')} – ${format(end, "d 'de' MMMM", { locale })}`
    : `${format(start, "d 'de' MMM", { locale })} – ${format(end, "d 'de' MMM", { locale })}`
}

export default function RoutinePage() {
  const { byDate, events, status, error, isLoading, reload, addEvent, updateEvent, deleteEvent } = useRoutine()
  const editor = useEditor<RoutineEvent>()
  useQueryAction(editor.openNew)
  const [view, setView] = useState<RoutineViewMode>('week')
  const [cursor, setCursor] = useState(() => new Date())
  const [newDate, setNewDate] = useState(() => toISODate(new Date()))

  const move = (direction: 1 | -1) => {
    setCursor((current) => (view === 'day' ? addDays(current, direction) : view === 'week' ? addWeeks(current, direction) : addMonths(current, direction)))
  }

  const openNewAt = useCallback(
    (date: Date) => {
      setNewDate(toISODate(date))
      editor.openNew()
    },
    [editor],
  )

  const handleDelete = useCallback(
    async (event: RoutineEvent) => {
      if (!(await confirm({ title: 'Tem certeza?', description: `"${event.title}" será removido da sua rotina.`, confirmLabel: 'Excluir' }))) return false
      return deleteEvent(event.id)
    },
    [deleteEvent],
  )

  const weekDays = useMemo(() => eachDayOfInterval({ start: startOfWeek(cursor, WEEK_OPTIONS), end: endOfWeek(cursor, WEEK_OPTIONS) }), [cursor])
  const monthDays = useMemo(
    () => eachDayOfInterval({ start: startOfWeek(startOfMonth(cursor), WEEK_OPTIONS), end: endOfWeek(endOfMonth(cursor), WEEK_OPTIONS) }),
    [cursor],
  )
  const eventsOn = (date: Date) => byDate.get(toISODate(date)) ?? []
  const weekCount = weekDays.reduce((sum, d) => sum + eventsOn(d).length, 0)

  return (
    <>
      <PageHeader
        title="Rotina"
        description="Seu planner semanal: compromissos, tarefas e eventos em um só lugar."
        actions={
          <Button leftIcon={<Plus className="size-4" />} onClick={() => openNewAt(view === 'day' ? cursor : new Date())}>
            Adicionar
          </Button>
        }
      />

      {status === 'error' ? (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      ) : isLoading ? (
        <LoadingState variant="cards" count={6} />
      ) : (
        <Card padding="none" className="animate-fade-in">
          <div className="flex flex-col gap-3 border-b border-line p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center rounded-[10px] border border-line bg-surface shadow-xs">
                <button type="button" onClick={() => move(-1)} aria-label="Período anterior" className="flex size-10 items-center justify-center rounded-l-[10px] text-muted hover:bg-surface-2 hover:text-fg">
                  <ChevronLeft className="size-4" />
                </button>
                <button type="button" onClick={() => setCursor(new Date())} className="h-10 border-x border-line px-3 text-sm font-semibold text-fg hover:bg-surface-2">
                  Hoje
                </button>
                <button type="button" onClick={() => move(1)} aria-label="Próximo período" className="flex size-10 items-center justify-center rounded-r-[10px] text-muted hover:bg-surface-2 hover:text-fg">
                  <ChevronRight className="size-4" />
                </button>
              </div>
              <h2 className="text-base font-bold text-fg sm:text-lg" aria-live="polite">
                {rangeLabel(view, cursor)}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ul className="flex flex-wrap gap-3" aria-label="Legenda">
                {(Object.keys(EVENT_STYLES) as Array<keyof typeof EVENT_STYLES>).map((type) => (
                  <li key={type} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted">
                    <span className={cn('size-2 rounded-full', EVENT_STYLES[type].dot)} aria-hidden />
                    {EVENT_STYLES[type].label}
                  </li>
                ))}
              </ul>
              <Tabs
                label="Visualização"
                value={view}
                onChange={setView}
                panelId="routine-panel"
                items={[
                  { value: 'day', label: 'Dia' },
                  { value: 'week', label: 'Semana' },
                  { value: 'month', label: 'Mês' },
                ]}
              />
            </div>
          </div>

          <div id="routine-panel" role="tabpanel" className="p-4 sm:p-5">
            {events.length === 0 && (
              <EmptyState
                compact
                icon={<CalendarDays />}
                title="Sua rotina está vazia"
                description="Adicione compromissos, tarefas e eventos para visualizar sua semana."
                action={
                  <Button variant="soft" leftIcon={<Plus className="size-4" />} onClick={() => openNewAt(new Date())}>
                    Adicionar primeiro item
                  </Button>
                }
                className="mb-4"
              />
            )}

            {view === 'week' && (
              <>
                <p className="mb-3 text-sm text-muted">{weekCount} itens nesta semana</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7 lg:gap-2">
                  {weekDays.map((day) => {
                    const items = eventsOn(day)
                    const today = isToday(day)
                    return (
                      <section key={day.toISOString()} aria-label={format(day, "EEEE, d 'de' MMMM", { locale })} className={cn('flex min-h-40 flex-col rounded-xl border p-2', today ? 'border-primary/40 bg-primary-soft/40' : 'border-line bg-surface-2/40')}>
                        <header className="mb-2 flex items-center justify-between px-1">
                          <span className="text-xs font-semibold text-muted uppercase">{format(day, 'EEE', { locale }).replace('.', '')}</span>
                          <span className={cn('vo-tabular flex size-7 items-center justify-center rounded-full text-sm font-bold', today ? 'bg-primary text-white' : 'text-fg')}>{format(day, 'd')}</span>
                        </header>
                        <div className="flex flex-1 flex-col gap-1.5">
                          {items.map((event) => (
                            <EventChip key={event.id} event={event} onClick={editor.openEdit} />
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => openNewAt(day)}
                          aria-label={`Adicionar em ${format(day, "d 'de' MMMM", { locale })}`}
                          className="mt-2 flex h-8 items-center justify-center gap-1 rounded-lg text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-primary-ink"
                        >
                          <Plus className="size-3.5" aria-hidden /> Adicionar
                        </button>
                      </section>
                    )
                  })}
                </div>
              </>
            )}

            {view === 'day' && (
              <div className="mx-auto max-w-2xl">
                {eventsOn(cursor).length === 0 ? (
                  <EmptyState
                    icon={<CalendarPlus />}
                    title="Dia livre"
                    description="Nenhum compromisso para este dia."
                    action={
                      <Button variant="soft" leftIcon={<Plus className="size-4" />} onClick={() => openNewAt(cursor)}>
                        Adicionar neste dia
                      </Button>
                    }
                  />
                ) : (
                  <ol className="relative space-y-3 border-l-2 border-line pl-6">
                    {eventsOn(cursor).map((event) => (
                      <li key={event.id} className="relative">
                        <span className={cn('absolute top-3 -left-[31px] size-3 rounded-full ring-4 ring-surface', EVENT_STYLES[event.type].dot)} aria-hidden />
                        <EventChip event={event} onClick={editor.openEdit} />
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            )}

            {view === 'month' && (
              <div>
                <div className="grid grid-cols-7 gap-1 pb-2 text-center text-[11px] font-semibold tracking-wide text-muted uppercase sm:text-xs" aria-hidden>
                  {weekDays.map((d) => (
                    <span key={d.toISOString()}>{format(d, 'EEEEEE', { locale })}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((day) => {
                    const items = eventsOn(day)
                    const inMonth = isSameMonth(day, cursor)
                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => {
                          setCursor(day)
                          setView('day')
                        }}
                        aria-label={`${format(day, "d 'de' MMMM", { locale })}: ${items.length} ite${items.length === 1 ? 'm' : 'ns'}`}
                        className={cn(
                          'flex min-h-16 flex-col items-stretch gap-1 rounded-lg border p-1.5 text-left transition-colors hover:border-line-strong sm:min-h-24',
                          inMonth ? 'border-line bg-surface' : 'border-transparent bg-surface-2/40 text-subtle',
                          isToday(day) && 'border-primary/50',
                        )}
                      >
                        <span className={cn('vo-tabular flex size-6 items-center justify-center self-end rounded-full text-xs font-semibold sm:self-start', isToday(day) ? 'bg-primary text-white' : inMonth ? 'text-fg' : 'text-subtle')}>
                          {format(day, 'd')}
                        </span>
                        <span className="hidden flex-col gap-0.5 sm:flex">
                          {items.slice(0, 2).map((event) => (
                            <span key={event.id} className={cn('truncate rounded px-1 py-0.5 text-[11px] font-medium', EVENT_STYLES[event.type].chip)}>
                              {event.startTime} {event.title}
                            </span>
                          ))}
                          {items.length > 2 && <span className="px-1 text-[11px] text-muted">+{items.length - 2} mais</span>}
                        </span>
                        {items.length > 0 && (
                          <span className="flex flex-wrap gap-0.5 sm:hidden" aria-hidden>
                            {items.slice(0, 3).map((event) => (
                              <span key={event.id} className={cn('size-1.5 rounded-full', EVENT_STYLES[event.type].dot)} />
                            ))}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <RoutineEventFormModal
        open={editor.isOpen}
        onClose={editor.close}
        event={editor.editing}
        defaultDate={newDate}
        onSubmit={(input) => (editor.editing ? updateEvent(editor.editing.id, input) : addEvent(input))}
        onDelete={handleDelete}
      />
    </>
  )
}

