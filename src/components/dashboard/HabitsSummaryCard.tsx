import { Link } from 'react-router-dom'
import { ArrowRight, Check, Flame } from 'lucide-react'
import type { HabitWithStats } from '@/hooks/useHabits'
import { cn } from '@/lib/cn'
import { PATHS } from '@/routes/paths'
import { buttonClasses } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/States'
import { HABIT_ICONS } from '@/components/habits/icons'

interface HabitsSummaryCardProps {
  habits: HabitWithStats[]
  weeklyProgress: number
  onToggle: (habit: HabitWithStats) => void
}

export function HabitsSummaryCard({ habits, weeklyProgress, onToggle }: HabitsSummaryCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Hábitos"
        description="Progresso dos últimos 7 dias"
        icon={<Flame />}
        action={
          <Link to={PATHS.habits} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-semibold text-primary-ink hover:bg-primary-soft">
            Ver todos <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        }
      />
      {habits.length === 0 ? (
        <EmptyState
          compact
          icon={<Flame />}
          title="Nenhum hábito"
          description="Crie hábitos simples e acompanhe sua sequência."
          action={
            <Link to={`${PATHS.habits}?novo=1`} className={buttonClasses('soft', 'sm')}>
              Criar hábito
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex items-end justify-between gap-3">
            <p className="font-display text-3xl font-extrabold text-fg">{weeklyProgress}%</p>
            <p className="pb-1 text-[13px] text-muted">{habits.filter((h) => h.stats.doneToday).length} de {habits.length} feitos hoje</p>
          </div>
          <ProgressBar value={weeklyProgress} size="md" label="Progresso semanal dos hábitos" className="mt-2" />
          <ul className="mt-4 space-y-1">
            {habits.slice(0, 5).map((habit) => {
              const Icon = HABIT_ICONS[habit.icon].icon
              const done = habit.stats.doneToday
              return (
                <li key={habit.id} className="flex items-center gap-3 rounded-lg py-1.5">
                  <Icon className="size-4 shrink-0 text-muted" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-sm text-fg-soft">{habit.name}</span>
                  {habit.stats.currentStreak > 1 && (
                    <span className="vo-tabular inline-flex items-center gap-0.5 text-xs font-semibold text-warning-ink">
                      <Flame className="size-3.5" aria-hidden />
                      {habit.stats.currentStreak}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onToggle(habit)}
                    aria-pressed={done}
                    aria-label={done ? `Desmarcar ${habit.name} hoje` : `Marcar ${habit.name} como feito hoje`}
                    className={cn(
                      'flex size-7 items-center justify-center rounded-lg border transition-colors',
                      done ? 'border-success bg-success text-white' : 'border-line-strong text-transparent hover:border-success hover:text-success',
                    )}
                  >
                    <Check className="size-4" strokeWidth={3} aria-hidden />
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </Card>
  )
}
