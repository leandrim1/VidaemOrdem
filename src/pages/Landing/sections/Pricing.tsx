import { Link } from 'react-router-dom'
import { Check, CircleCheck, ShieldCheck } from 'lucide-react'
import { PLAN_FEATURES, PLANS } from '@/data/plans'
import { cn } from '@/lib/cn'
import { PATHS } from '@/routes/paths'
import { buttonClasses } from '@/components/ui/Button'
import { Container, SectionHeading } from './SectionHeading'

export function Pricing() {
  return (
    <section id="precos" aria-labelledby="precos-title" className="scroll-mt-16 bg-surface-2/50 py-20 sm:py-28 dark:bg-surface/40">
      <Container>
        <SectionHeading id="precos-title" eyebrow="Oferta" title="Menos que um lanche por mês para ter a vida em ordem" description="Teste grátis por 7 dias, sem cartão e sem cobrança automática." />
        <div className="mx-auto mt-14 grid max-w-md grid-cols-1 gap-5 lg:max-w-5xl lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn('relative flex flex-col rounded-card border bg-surface p-7 shadow-card sm:p-8', plan.featured ? 'border-primary ring-1 ring-primary shadow-raised' : 'border-line')}
            >
              {plan.featured && <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">Mais escolhido</span>}
              <h3 className="text-lg font-bold text-fg">Plano {plan.name}</h3>
              <p className="mt-4 flex flex-wrap items-baseline gap-x-1">
                <span className="text-lg font-semibold text-muted">R$</span>
                <span className="font-display text-5xl font-extrabold tracking-tight text-fg">{plan.priceLabel}</span>
                <span className="text-muted">{plan.periodLabel}</span>
              </p>
              <p className="mt-2 text-sm text-muted">{plan.billingNote}</p>
              <ul className="mt-7 flex-1 space-y-3">
                {PLAN_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[15px] text-fg-soft">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-success-ink">
                      <Check className="size-3" strokeWidth={3} aria-hidden />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to={PATHS.register} className={buttonClasses(plan.featured ? 'primary' : 'outline', 'lg', 'mt-8 w-full')}>
                Começar 7 dias grátis
              </Link>
            </div>
          ))}
        </div>
        <ul className="mt-8 flex flex-col items-center justify-center gap-x-8 gap-y-2 text-center text-sm text-muted sm:flex-row">
          <li className="flex items-center gap-2">
            <CircleCheck className="size-4 shrink-0 text-success" aria-hidden />
            Sem cobrança automática: ao fim dos 7 dias, você decide se quer assinar.
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck className="size-4 shrink-0 text-success" aria-hidden />
            Garantia de 7 dias após a assinatura: não gostou, devolvemos 100%.
          </li>
        </ul>
      </Container>
    </section>
  )
}
