import { ArrowRight, CircleCheck, Layers, Sparkles, Target } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Container } from './SectionHeading'

const STEPS = [
  { icon: Layers, title: 'Centralize', text: 'Finanças, contas, tarefas, metas, rotina e documentos em um só painel.' },
  { icon: Sparkles, title: 'Simplifique', text: 'Telas limpas, sem jargões. Você entende tudo em segundos — no celular ou no computador.' },
  { icon: Target, title: 'Evolua', text: 'Índice de organização, pontos e níveis mostram seu progresso a cada semana.' },
]

export function Solution() {
  return (
    <section aria-labelledby="solucao-title" className="bg-navy py-20 text-white sm:py-28 dark:border-y dark:border-line dark:bg-[#080d19]">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            <p className="text-sm font-semibold tracking-wide text-blue-300">A solução</p>
            <h2 id="solucao-title" className="mt-3 text-3xl leading-tight font-extrabold sm:text-4xl">
              Um único sistema.
              <br />
              Tudo em ordem.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-300">
              O Vida em Ordem reúne as áreas que mais pesam no dia a dia e transforma organização em um hábito leve — com um plano guiado para começar.
            </p>
            <ul className="mt-8 space-y-3 text-slate-200">
              {['Configure em menos de 5 minutos', 'Lembretes antes de cada vencimento', 'Seus dados protegidos e sob seu controle'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CircleCheck className="size-5 shrink-0 text-blue-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <ol className="grid gap-4">
            {STEPS.map((step, i) => (
              <Reveal as="li" variant="right" delay={i * 120} key={step.title}>
                <div className="flex gap-5 rounded-card border border-white/10 bg-white/[0.04] p-6 transition-colors hover:bg-white/[0.07]">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                  <step.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="flex items-center gap-2 text-lg font-bold">
                    <span className="text-sm font-semibold text-blue-300">0{i + 1}</span> {step.title}
                    {i < STEPS.length - 1 && <ArrowRight className="size-4 text-slate-500" aria-hidden />}
                  </p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-slate-300">{step.text}</p>
                </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
