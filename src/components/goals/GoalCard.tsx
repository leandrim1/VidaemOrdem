import { memo } from 'react'
import { CalendarDays, CircleCheck, Plus } from 'lucide-react'
import { differenceInCalendarMonths, parseISO } from 'date-fns'
import type { Goal } from '@/types'
import { goalCategoryLabel } from '@/data/categories'
import { goalProgress } from '@/hooks/useGoals'
import { daysUntil } from '@/utils/date'
import { formatCurrency, formatDate, formatPercent } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Money } from '@/components/ui/Money'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { RowActions } from '@/components/ui/RowActions'
import { GOAL_ICONS } from './icons'

interface GoalCardProps {
  goal: Goal
  onContribute: (goal: Goal) => void
  onEdit: (goal: Goal) => void
  onDelete: (goal: Goal) => void
}

export const GoalCard = memo(function GoalCard({ goal, onContribute, onEdit, onDelete }: GoalCardProps) {
  const Icon = GOAL_ICONS[goal.category]
  const progress = goalProgress(goal)
  const done = goal.currentAmount >= goal.targetAmount
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount)
  const days = daysUntil(goal.deadline)
  const months = Math.max(1, differenceInCalendarMonths(parseISO(goal.deadline), new Date()))
  const monthly = remaining / months

  return (
    <Card as="article" interactive className="flex flex-col">
      <div className="flex items-start gap-3">
        <span className={done ? 'flex size-11 shrink-0 items-center justify-center rounded-xl bg-success text-white' : 'flex size-11 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success-ink'}>
          {done ? <CircleCheck className="size-5" aria-hidden /> : <Icon className="size-5" aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold text-fg">{goal.name}</h2>
          <p className="text-[13px] text-muted">{goalCategoryLabel(goal.category)}</p>
        </div>
        <RowActions label={goal.name} onEdit={() => onEdit(goal)} onDelete={() => onDelete(goal)} />
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <p className="text-sm text-muted">
          <Money value={goal.currentAmount} className="font-display text-xl font-bold text-fg" />
          <span className="mx-1">/</span>
          <Money value={goal.targetAmount} />
        </p>
        <span className="vo-tabular font-display text-2xl font-extrabold text-fg">{formatPercent(progress)}</span>
      </div>
      <ProgressBar value={progress} tone="success" size="lg" label={`Progresso da meta ${goal.name}`} className="mt-3" />

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px]">
        {done ? (
          <Badge tone="success" icon={<CircleCheck />}>
            Meta concluída{goal.completedAt ? ` em ${formatDate(goal.completedAt, 'dd/MM/yyyy')}` : ''}
          </Badge>
        ) : (
          <>
            <span className="inline-flex items-center gap-1.5 text-muted">
              <CalendarDays className="size-3.5" aria-hidden />
              {days >= 0 ? `Prazo: ${formatDate(goal.deadline, "MMM 'de' yyyy")}` : 'Prazo vencido'}
            </span>
            {days >= 0 && <span className="text-muted">· {formatCurrency(monthly)}/mês para chegar lá</span>}
          </>
        )}
      </div>

      {!done && (
        <Button variant="soft" className="mt-5" fullWidth leftIcon={<Plus className="size-4" />} onClick={() => onContribute(goal)}>
          Adicionar valor
        </Button>
      )}
    </Card>
  )
})
