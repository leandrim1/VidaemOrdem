import { Link } from 'react-router-dom'
import { ArrowRight, Target } from 'lucide-react'
import type { Goal } from '@/types'
import { PATHS } from '@/routes/paths'
import { buttonClasses } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/States'
import { GoalProgress } from '@/components/goals/GoalProgress'

export function GoalsSummaryCard({ goals }: { goals: Goal[] }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title="Metas"
        description="Seus objetivos em andamento"
        icon={<Target />}
        action={
          <Link to={PATHS.goals} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] font-semibold text-primary-ink hover:bg-primary-soft">
            Ver todas <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        }
      />
      {goals.length === 0 ? (
        <EmptyState
          compact
          icon={<Target />}
          title="Nenhuma meta ainda"
          description="Defina um objetivo com valor e prazo."
          action={
            <Link to={`${PATHS.goals}?novo=1`} className={buttonClasses('soft', 'sm')}>
              Criar meta
            </Link>
          }
        />
      ) : (
        <ul className="space-y-5">
          {goals.slice(0, 2).map((goal) => (
            <li key={goal.id}>
              <GoalProgress goal={goal} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
