import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck, Receipt, Sparkles, Target } from 'lucide-react'
import { PATHS } from '@/routes/paths'
import { buttonClasses } from '@/components/ui/Button'
import { CountUp } from '@/components/ui/CountUp'
import { DashboardMockup } from '../mockups'
import { Container } from './SectionHeading'

const AVATARS = [
  ['JC', 'bg-blue-600'],
  ['RM', 'bg-emerald-600'],
  ['AL', 'bg-amber-600'],
  ['PS', 'bg-rose-600'],
] as const

/** Cards que "flutuam" ao redor do mockup (apenas em telas largas). */
function FloatingCards() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden xl:block" aria-hidden>
      <div className="absolute top-24 -left-32 animate-fade-up" style={{ animationDelay: '1.1s' }}>
        <div className="flex animate-float items-center gap-3 rounded-2xl border border-line bg-surface p-3 pr-4 shadow-overlay">
          <span className="flex size-9 items-center justify-center rounded-xl bg-warning-soft text-warning-ink">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-[13px] font-bold text-fg">+10 pontos</p>
            <p className="text-[11px] text-muted">Tarefa concluída</p>
          </div>
        </div>
      </div>
      <div className="absolute top-1/3 -right-20 animate-fade-up" style={{ animationDelay: '1.35s' }}>
        <div className="flex animate-float-slow items-center gap-3 rounded-2xl border border-line bg-surface p-3 pr-4 shadow-overlay" style={{ animationDelay: '1.5s' }}>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary-ink">
            <Receipt className="size-4" />
          </span>
          <div>
            <p className="text-[13px] font-bold text-fg">Conta de luz</p>
            <p className="text-[11px] text-muted">Vence amanhã · R$ 164,30</p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-12 -left-16 animate-fade-up" style={{ animationDelay: '1.6s' }}>
        <div className="w-56 animate-float rounded-2xl border border-line bg-surface p-3.5 shadow-overlay" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-success-soft text-success-ink">
              <Target className="size-4" />
            </span>
            <p className="flex-1 text-[13px] font-bold text-fg">Viagem para Lisboa</p>
            <span className="text-[13px] font-bold text-fg">72%</span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-success-soft">
            <div className="vo-grow-x h-full w-[72%] rounded-full bg-success" style={{ animationDelay: '1.9s' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(60%_50%_at_50%_0%,var(--vo-primary-soft),transparent)]" aria-hidden />
      <div className="pointer-events-none absolute top-24 left-1/2 -z-10 size-[520px] -translate-x-1/2" aria-hidden>
        <div className="size-full animate-drift rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(var(--vo-line)_1px,transparent_1px),linear-gradient(90deg,var(--vo-line)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_65%)]"
        aria-hidden
      />
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <a href="#desafio" className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-fg-soft shadow-xs transition-colors hover:border-line-strong">
            <span className="flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary-ink">
              <Sparkles className="size-3" aria-hidden /> Novo
            </span>
            Desafio de 7 dias<span className="hidden sm:inline"> para organizar tudo</span>
            <ArrowRight className="size-3.5 text-muted" aria-hidden />
          </a>
          <h1 id="hero-title" className="mt-7 animate-fade-up text-[40px] leading-[1.05] font-extrabold tracking-tight text-fg [animation-delay:60ms] sm:text-6xl lg:text-[68px]">
            Organize sua vida.
            <br />
            <span className="text-primary-ink">Simplifique sua rotina.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-muted [animation-delay:120ms] sm:text-xl">
            Finanças, tarefas, metas e organização pessoal em um único sistema simples e fácil de usar.
          </p>
          <div className="mt-9 flex animate-fade-up flex-col justify-center gap-3 [animation-delay:180ms] sm:flex-row">
            <Link to={PATHS.register} className={buttonClasses('primary', 'lg', 'group px-7')}>
              Começar agora
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <a href="#plataforma" className={buttonClasses('outline', 'lg', 'px-7')}>
              Conhecer a plataforma
            </a>
          </div>
          <div className="mt-8 flex animate-fade-up flex-col items-center justify-center gap-4 text-sm text-muted [animation-delay:240ms] sm:flex-row sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2" aria-hidden>
                {AVATARS.map(([initials, color]) => (
                  <span key={initials} className={`flex size-8 items-center justify-center rounded-full text-[11px] font-bold text-white ring-2 ring-canvas ${color}`}>
                    {initials}
                  </span>
                ))}
              </div>
              <span>
                <strong className="font-semibold text-fg">
                  <CountUp value={12} duration={1800} format={(v) => `+${Math.round(v)} mil pessoas`} />
                </strong>{' '}
                já organizadas
              </span>
            </div>
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              {['7 dias grátis', 'Sem cartão de crédito'].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <CircleCheck className="size-4 text-success" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="relative mx-auto mt-14 max-w-5xl sm:mt-20">
          <div className="pointer-events-none absolute -inset-x-10 -bottom-10 top-10 -z-10 animate-glow rounded-[40px] bg-primary/10 blur-3xl" aria-hidden />
          <div className="vo-tilt-in" style={{ animationDelay: '300ms' }}>
            <DashboardMockup />
          </div>
          <FloatingCards />
        </div>
      </Container>
    </section>
  )
}
