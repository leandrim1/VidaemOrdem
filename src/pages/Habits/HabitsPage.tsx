import { useCallback, useMemo, useState } from 'react'
import { CalendarCheck, Flame, Plus, Trophy } from 'lucide-react'
import type { HabitWithStats } from '@/hooks/useHabits'
import { useEditor } from '@/hooks/useDisclosure'
import { useHabits } from '@/hooks/useHabits'
import { useQueryAction } from '@/hooks/useQueryAction'
import { confirm } from '@/stores/confirmStore'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { Select } from '@/components/ui/Select'
import { StatCard } from '@/components/ui/StatCard'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States'
import { HabitCalendar } from '@/components/habits/HabitCalendar'
import { HabitCard } from '@/components/habits/HabitCard'
import { HabitFormModal } from '@/components/habits/HabitFormModal'

export default function HabitsPage() {
  const { habits, weeklyProgress, doneToday, status, error, isLoading, reload, toggle, addHabit, updateHabit, deleteHabit } = useHabits()
  const editor = useEditor<HabitWithStats>()
  useQueryAction(editor.openNew)
  const [calendarHabit, setCalendarHabit] = useState('')

  const best = useMemo(() => habits.reduce<HabitWithStats | null>((top, h) => (!top || h.stats.currentStreak > top.stats.currentStreak ? h : top), null), [habits])

  const handleDelete = useCallback(
    async (habit: HabitWithStats) => {
      if (await confirm({ title: 'Tem certeza?', description: `O hábito "${habit.name}" e todo o histórico de check-ins serão excluídos.`, confirmLabel: 'Excluir hábito' })) await deleteHabit(habit.id)
    },
    [deleteHabit],
  )

  return (
    <>
      <PageHeader
        title="Hábitos"
        description="Construa consistência um dia de cada vez — e acompanhe suas sequências."
        actions={
          <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
            Novo hábito
          </Button>
        }
      />
      {status === 'error' ? (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      ) : isLoading ? (
        <LoadingState variant="cards" count={3} />
      ) : habits.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Flame />}
            title="Comece com um hábito simples"
            description="Beber água, ler 10 minutos, caminhar… O importante é a constância, não a intensidade."
            action={
              <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
                Criar primeiro hábito
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="animate-fade-in space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <Card className="flex items-center gap-5">
              <ProgressRing value={weeklyProgress} size={96} stroke={9} label="Progresso semanal dos hábitos">
                <span className="font-display text-xl font-extrabold text-fg">{weeklyProgress}%</span>
              </ProgressRing>
              <div>
                <p className="text-sm font-medium text-muted">Progresso semanal</p>
                <p className="mt-1 font-display text-lg font-bold text-fg">{weeklyProgress >= 75 ? 'Semana excelente!' : weeklyProgress >= 50 ? 'No caminho certo' : 'Bora retomar o ritmo'}</p>
                <p className="mt-0.5 text-[13px] text-muted">Check-ins dos últimos 7 dias vs. suas metas</p>
              </div>
            </Card>
            <StatCard label="Feitos hoje" value={`${doneToday}/${habits.length}`} icon={<CalendarCheck />} tone="success" footer={doneToday === habits.length ? 'Todos concluídos 🎉' : 'Continue marcando'} />
            <StatCard label="Maior sequência atual" value={`${best?.stats.currentStreak ?? 0} dias`} icon={<Trophy />} tone="warning" footer={best?.name} />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onToggle={toggle} onEdit={editor.openEdit} onDelete={handleDelete} />
            ))}
          </div>

          <Card>
            <CardHeader
              title="Calendário de hábitos"
              description="Sua constância nas últimas semanas"
              icon={<CalendarCheck />}
              action={
                <Select
                  aria-label="Hábito exibido no calendário"
                  size="sm"
                  className="w-44 sm:w-56"
                  value={calendarHabit}
                  onChange={(e) => setCalendarHabit(e.target.value)}
                  options={[{ value: '', label: 'Todos os hábitos' }, ...habits.map((h) => ({ value: h.id, label: h.name }))]}
                />
              }
            />
            <HabitCalendar habits={habits} selectedId={calendarHabit || null} />
          </Card>
        </div>
      )}
      <HabitFormModal open={editor.isOpen} onClose={editor.close} habit={editor.editing} onSubmit={(input) => (editor.editing ? updateHabit(editor.editing.id, input) : addHabit(input))} />
    </>
  )
}
