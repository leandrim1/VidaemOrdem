import { Link } from 'react-router-dom'
import { ArrowRight, Trophy } from 'lucide-react'
import { PATHS } from '@/routes/paths'
import { useInView } from '@/hooks/useInView'
import { buttonClasses } from '@/components/ui/Button'
import { Reveal } from '@/components/ui/Reveal'
import { Container, SectionHeading } from './SectionHeading'

const DAYS = ['Organize suas finanças', 'Organize suas contas', 'Organize sua rotina', 'Defina suas metas', 'Organize seus documentos', 'Organize sua vida digital', 'Crie seu sistema de manutenção']

export function ChallengeSection() {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <section id="desafio" aria-labelledby="desafio-title" className="scroll-mt-16 py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="desafio-title"
          eyebrow="Desafio de 7 dias"
          title="7 dias para colocar sua vida em ordem"
          description="Um passo por dia, com checklist, dicas práticas e pontos a cada conquista. Ao final, você terá um sistema que se mantém sozinho."
        />
        <div ref={ref} className="relative mt-14">
          {/* Linha de progresso que "percorre" os 7 dias ao aparecer. */}
          <div className="absolute top-10 right-8 left-8 hidden h-0.5 overflow-hidden rounded-full bg-line lg:block" aria-hidden>
            {inView && <div className="vo-grow-x h-full w-full bg-primary" style={{ animationDuration: '1.8s', animationDelay: '300ms' }} />}
          </div>
        <ol className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {DAYS.map((title, i) => (
            <Reveal as="li" delay={i * 90} key={title}>
              <div className="relative flex h-full flex-col rounded-card border border-line bg-surface p-5 shadow-card transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-raised lg:min-h-44">
              <span className={i === 6 ? 'flex size-10 items-center justify-center rounded-xl bg-warning text-white' : 'flex size-10 items-center justify-center rounded-xl bg-primary-soft font-display text-sm font-extrabold text-primary-ink'}>
                {i === 6 ? <Trophy className="size-5" aria-hidden /> : i + 1}
              </span>
              <p className="mt-4 text-xs font-semibold tracking-wide text-muted uppercase">Dia {i + 1}</p>
              <p className="mt-1 text-[15px] leading-snug font-bold text-fg">{title}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        </div>
        <div className="mt-10 text-center">
          <Link to={PATHS.register} className={buttonClasses('primary', 'lg', 'group')}>
            Começar o desafio grátis
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  )
}
