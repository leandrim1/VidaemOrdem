import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PATHS } from '@/routes/paths'
import { buttonClasses } from '@/components/ui/Button'
import { Container } from './SectionHeading'

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="pb-20 sm:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-[24px] bg-navy px-6 py-14 text-center text-white sm:px-12 sm:py-20 dark:border dark:border-line dark:bg-surface">
          <div className="pointer-events-none absolute -top-32 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" aria-hidden />
          <div className="relative">
            <h2 id="cta-title" className="mx-auto max-w-2xl text-3xl leading-tight font-extrabold sm:text-5xl dark:text-fg">
              Comece hoje a colocar sua vida em ordem.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-300 dark:text-muted">Crie sua conta em menos de um minuto e faça o primeiro dia do desafio agora mesmo.</p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to={PATHS.register} className={buttonClasses('primary', 'lg', 'px-7')}>
                Começar agora
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link to={PATHS.login} className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-7 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 dark:border-line dark:text-fg dark:hover:bg-surface-2">
                Ver demonstração
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
