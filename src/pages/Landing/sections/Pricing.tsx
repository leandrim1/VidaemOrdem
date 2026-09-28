import { Link } from 'react-router-dom'
import { Check, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import { PATHS } from '@/routes/paths'
import { buttonClasses } from '@/components/ui/Button'
import { Container, SectionHeading } from './SectionHeading'

const FEATURES = ['Todos os 12 módulos', 'Desafio de 7 dias guiado', 'Checklists prontos e personalizáveis', 'Tema claro e escuro', 'Exportação dos seus dados', 'Suporte por e-mail']

const PLANS = [
  { name: 'Mensal', price: '19,90', period: '/mês', note: 'Cobrado mensalmente. Cancele quando quiser.', featured: false },
  { name: 'Anual', price: '14,90', period: '/mês', note: 'R$ 178,80 cobrados uma vez por ano. Economize 25%.', featured: true },
]

export function Pricing() {
  return (
    <section id="precos" aria-labelledby="precos-title" className="scroll-mt-16 bg-surface-2/50 py-20 sm:py-28 dark:bg-surface/40">
      <Container>
        <SectionHeading id="precos-title" eyebrow="Oferta" title="Menos que um lanche por mês para ter a vida em ordem" description="Comece com 7 dias grátis. Sem cartão de crédito." />
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn('relative flex flex-col rounded-card border bg-surface p-7 shadow-card sm:p-8', plan.featured ? 'border-primary ring-1 ring-primary shadow-raised' : 'border-line')}
            >
              {plan.featured && <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">Mais escolhido</span>}
              <h3 className="text-lg font-bold text-fg">Plano {plan.name}</h3>
              <p className="mt-4 flex items-baseline gap-1">
                <span className="text-lg font-semibold text-muted">R$</span>
                <span className="font-display text-5xl font-extrabold tracking-tight text-fg">{plan.price}</span>
                <span className="text-muted">{plan.period}</span>
              </p>
              <p className="mt-2 text-sm text-muted">{plan.note}</p>
              <ul className="mt-7 flex-1 space-y-3">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-[15px] text-fg-soft">
                    <span className="flex size-5 items-center justify-center rounded-full bg-success-soft text-success-ink">
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
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-muted">
          <ShieldCheck className="size-4 shrink-0 text-success" aria-hidden />
          Garantia incondicional de 7 dias: não gostou, devolvemos 100%.
        </p>
      </Container>
    </section>
  )
}
