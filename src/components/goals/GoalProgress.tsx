import type { Goal } from '@/types'
import { goalProgress } from '@/hooks/useGoals'
import { formatPercent } from '@/utils/format'
import { Money } from '@/components/ui/Money'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { GOAL_ICONS } from './icons'

/** Linha compacta de meta (usada no dashboard). */
export function GoalProgress({ goal }: { goal: Goal }) {
  const Icon = GOAL_ICONS[goal.category]
  const progress = goalProgress(goal)
  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success-ink">
          <Icon className="size-[18px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-fg">{goal.name}</p>
          <p className="text-[13px] text-muted">
            <Money value={goal.currentAmount} cents={false} className="font-medium text-fg-soft" /> / <Money value={goal.targetAmount} cents={false} />
          </p>
        </div>
        <span className="vo-tabular font-display text-lg font-bold text-fg">{formatPercent(progress)}</span>
      </div>
      <ProgressBar value={progress} tone="success" size="md" label={`Progresso da meta ${goal.name}`} className="mt-3" />
    </div>
  )
}
