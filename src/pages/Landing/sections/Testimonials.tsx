import { Quote, Star } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Container, SectionHeading } from './SectionHeading'

const TESTIMONIALS = [
  { name: 'Juliana Castro', role: 'Designer · São Paulo', initials: 'JC', color: 'bg-blue-600', text: 'Em uma semana descobri para onde ia meu dinheiro e parei de esquecer contas. Hoje tenho uma reserva e uma rotina que funciona.' },
  { name: 'Rafael Monteiro', role: 'Engenheiro · Belo Horizonte', initials: 'RM', color: 'bg-emerald-600', text: 'Já tinha testado vários apps. O Vida em Ordem foi o primeiro que eu continuei usando depois de um mês. É simples e bonito.' },
  { name: 'Ana Luíza Prado', role: 'Professora · Recife', initials: 'AP', color: 'bg-amber-600', text: 'O desafio de 7 dias me fez organizar documentos que eu adiava há anos. Os checklists de mudança salvaram minha vida!' },
]

export function Testimonials() {
  return (
    <section aria-labelledby="depoimentos-title" className="py-20 sm:py-28">
      <Container>
        <SectionHeading id="depoimentos-title" eyebrow="Depoimentos" title="Quem usa, recomenda" />
        <ul className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal as="li" delay={i * 120} key={t.name}>
              <figure className="flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-card transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-raised">
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-warning" aria-label="Avaliação: 5 de 5 estrelas">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className="size-4 fill-current" aria-hidden />
                    ))}
                  </div>
                  <Quote className="size-6 text-line-strong" aria-hidden />
                </div>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-fg-soft">“{t.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className={`flex size-10 items-center justify-center rounded-full text-sm font-bold text-white ${t.color}`} aria-hidden>
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-fg">{t.name}</span>
                    <span className="block text-xs text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
