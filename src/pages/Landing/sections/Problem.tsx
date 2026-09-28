import { CalendarX, FileSpreadsheet, Layers, TrendingDown } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Container, SectionHeading } from './SectionHeading'

const PAINS = [
  { icon: CalendarX, title: 'Contas esquecidas', text: 'Juros e multas porque o boleto ficou perdido no e-mail ou na gaveta.' },
  { icon: FileSpreadsheet, title: 'Planilhas abandonadas', text: 'Começa animado, mas em duas semanas a planilha já está desatualizada.' },
  { icon: Layers, title: 'Apps demais', text: 'Um app para tarefas, outro para gastos, outro para hábitos… e nada conversa.' },
  { icon: TrendingDown, title: 'Metas no papel', text: 'O ano passa e a reserva, a viagem e o curso continuam só na intenção.' },
]

export function Problem() {
  return (
    <section aria-labelledby="problema-title" className="py-20 sm:py-28">
      <Container>
        <SectionHeading id="problema-title" eyebrow="O problema" title="Sua vida está espalhada em mil lugares?" description="Não é falta de disciplina. É falta de um sistema simples que junte tudo o que importa." />
        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PAINS.map((pain, i) => (
            <Reveal as="li" key={pain.title} delay={i * 90}>
              <div className="group h-full rounded-card border border-line bg-surface p-6 shadow-card transition-[box-shadow,border-color,translate] duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-raised">
              <span className="flex size-11 items-center justify-center rounded-xl bg-danger-soft text-danger-ink transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <pain.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-bold text-fg">{pain.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{pain.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
