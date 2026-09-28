import { memo } from 'react'
import { format, parseISO } from 'date-fns'
import { Check, Flame, Trophy } from 'lucide-react'
import type { Habit, ISODate } from '@/types'
import type { HabitWithStats } from '@/hooks/useHabits'
import { cn } from '@/lib/cn'
import { locale } from '@/utils/date'
import { lastSevenDays } from '@/utils/habits'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RowActions } from '@/components/ui/RowActions'
import { HABIT_ICONS } from './icons'

interface HabitCardProps {
  habit: HabitWithStats
  onToggle: (habit: Habit, date?: ISODate) => void
  onEdit: (habit: HabitWithStats) => void
  onDelete: (habit: HabitWithStats) => void
}

export const HabitCard = memo(function HabitCard({ habit, onToggle, onEdit, onDelete }: HabitCardProps) {
  const Icon = HABIT_ICONS[habit.icon].icon
  const { stats } = habit
  const days = lastSevenDays()

  return (
    <Card as="article" className="flex flex-col">
      <div className="flex items-start gap-3">
        <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', stats.doneToday ? 'bg-success text-white' : 'bg-primary-soft text-primary-ink')}>
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-fg">{habit.name}</h2>
          <p className="text-[13px] text-muted">
            Meta: {habit.targetPerWeek}× por semana
          </p>
        </div>
        <RowActions label={habit.name} onEdit={() => onEdit(habit)} onDelete={() => onDelete(habit)} />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-surface-2/70 p-3">
          <dt className="flex items-center gap-1 text-[11px] font-medium text-muted">
            <Flame className="size-3.5 text-warning" aria-hidden /> Sequência
          </dt>
          <dd className="vo-tabular mt-1 font-display text-lg font-bold text-fg">
            {stats.currentStreak} <span className="text-xs font-medium text-muted">dia{stats.currentStreak === 1 ? '' : 's'}</span>
          </dd>
        </div>
        <div className="rounded-xl bg-surface-2/70 p-3">
          <dt className="flex items-center gap-1 text-[11px] font-medium text-muted">
            <Trophy className="size-3.5 text-primary-ink" aria-hidden /> Melhor
          </dt>
          <dd className="vo-tabular mt-1 font-display text-lg font-bold text-fg">
            {stats.bestStreak} <span className="text-xs font-medium text-muted">dia{stats.bestStreak === 1 ? '' : 's'}</span>
          </dd>
        </div>
        <div className="rounded-xl bg-surface-2/70 p-3">
          <dt className="text-[11px] font-medium text-muted">Semana</dt>
          <dd className="vo-tabular mt-1 font-display text-lg font-bold text-fg">
            {stats.weekCount}/{habit.targetPerWeek}
          </dd>
        </div>
      </dl>

      <ProgressBar value={stats.weekProgress} tone={stats.weekProgress >= 100 ? 'success' : 'primary'} size="sm" label={`Progresso semanal de ${habit.name}`} className="mt-4" />

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-muted">Últimos 7 dias</p>
        <ul className="grid grid-cols-7 gap-1.5">
          {days.map((date) => {
            const done = habit.dates.has(date)
            const parsed = parseISO(date)
            return (
              <li key={date} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-muted">{format(parsed, 'EEE', { locale }).replace('.', '')}</span>
                <button
                  type="button"
                  onClick={() => onToggle(habit, date)}
                  aria-pressed={done}
                  aria-label={`${habit.name} em ${format(parsed, "EEEE, d 'de' MMMM", { locale })}: ${done ? 'feito' : 'não feito'}`}
                  className={cn(
                    'flex aspect-square w-full max-w-9 items-center justify-center rounded-lg border text-xs font-semibold transition-colors',
                    done ? 'border-success bg-success text-white' : 'border-line text-muted hover:border-success hover:text-success-ink',
                  )}
                >
                  {done ? <Check className="size-4" strokeWidth={3} aria-hidden /> : format(parsed, 'd')}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <Button
        variant={stats.doneToday ? 'outline' : 'primary'}
        className="mt-5"
        fullWidth
        leftIcon={<Check className="size-4" />}
        onClick={() => onToggle(habit)}
        aria-pressed={stats.doneToday}
      >
        {stats.doneToday ? 'Feito hoje · desfazer' : 'Marcar como feito hoje'}
      </Button>
    </Card>
  )
})
