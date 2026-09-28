import { Clock, HeartHandshake, Lock, PiggyBank, Smartphone, TrendingUp } from 'lucide-react'
import { Container, SectionHeading } from './SectionHeading'

const BENEFITS = [
  { icon: PiggyBank, title: 'Clareza financeira', text: 'Pare de se surpreender no fim do mês e comece a guardar com intenção.' },
  { icon: Clock, title: 'Mais tempo livre', text: 'Menos tempo procurando papéis, lembrando prazos e decidindo o que fazer.' },
  { icon: HeartHandshake, title: 'Menos estresse', text: 'A tranquilidade de saber que nada importante vai passar despercebido.' },
  { icon: TrendingUp, title: 'Constância', text: 'Pontos, níveis e sequências transformam organização em hábito.' },
  { icon: Smartphone, title: 'Em qualquer tela', text: 'Experiência pensada para o celular, o tablet e o computador.' },
  { icon: Lock, title: 'Privacidade de verdade', text: 'Senhas criptografadas, modo “ocultar valores” e exportação dos seus dados.' },
]

export function Benefits() {
  return (
    <section aria-labelledby="beneficios-title" className="bg-surface-2/50 py-20 sm:py-28 dark:bg-surface/40">
      <Container>
        <SectionHeading id="beneficios-title" eyebrow="Benefícios" title="Organização que muda o seu dia a dia" />
        <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-primary-ink shadow-xs">
                <benefit.icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-base font-bold text-fg">{benefit.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{benefit.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
