import { Check } from 'lucide-react'
import type { BillingPlan, PlanOption } from '@/types'
import { cn } from '@/lib/cn'
import { PLAN_FEATURES, PLANS } from '@/data/plans'
import { Button } from '@/components/ui/Button'

interface PlanCardsProps {
  currentPlan?: BillingPlan | null
  onSelect: (plan: PlanOption) => void
  compact?: boolean
}

/** Cards de planos usados na página "Meu plano" e na tela de fim do teste. */
export function PlanCards({ currentPlan, onSelect, compact }: PlanCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {PLANS.map((plan) => {
        const current = plan.id === currentPlan
        return (
          <div
            key={plan.id}
            className={cn(
              'relative flex flex-col rounded-card border bg-surface p-5 shadow-card sm:p-6',
              plan.featured ? 'border-primary ring-1 ring-primary' : 'border-line',
            )}
          >
            {plan.featured && <span className="absolute -top-3 left-5 rounded-full bg-primary px-2.5 py-0.5 text-xs font-bold text-white">Mais escolhido</span>}
            <h3 className="text-base font-bold text-fg">Plano {plan.name}</h3>
            <p className="mt-3 flex flex-wrap items-baseline gap-x-1">
              <span className="text-sm font-semibold text-muted">R$</span>
              <span className="font-display text-4xl font-extrabold tracking-tight text-fg">{plan.priceLabel}</span>
              <span className="text-sm text-muted">{plan.periodLabel}</span>
            </p>
            <p className="mt-1.5 text-[13px] text-muted">{plan.billingNote}</p>
            {!compact && (
              <ul className="mt-5 flex-1 space-y-2.5">
                {PLAN_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-fg-soft">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            <Button className={compact ? 'mt-5' : 'mt-6'} fullWidth variant={plan.featured ? 'primary' : 'outline'} disabled={current} onClick={() => onSelect(plan)}>
              {current ? 'Plano atual' : `Assinar plano ${plan.name.toLowerCase()}`}
            </Button>
          </div>
        )
      })}
    </div>
  )
}
