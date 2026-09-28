import { CalendarDays, ClipboardCheck, CreditCard, FileText, Flame, ListChecks, MonitorSmartphone, Receipt, Repeat, Target, Trophy, Wallet } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Container, SectionHeading } from './SectionHeading'

const FEATURES = [
  { icon: Wallet, title: 'Finanças', text: 'Receitas, despesas, categorias e evolução mensal.' },
  { icon: Receipt, title: 'Contas', text: 'Vencimentos organizados e alertas antes do prazo.' },
  { icon: CreditCard, title: 'Cartões', text: 'Limite, fatura, fechamento e uso de cada cartão.' },
  { icon: Repeat, title: 'Assinaturas', text: 'Descubra quanto os serviços recorrentes custam.' },
  { icon: Target, title: 'Metas', text: 'Objetivos com valor, prazo e progresso visual.' },
  { icon: ListChecks, title: 'Tarefas', text: 'Prioridades, datas e categorias. Nada esquecido.' },
  { icon: CalendarDays, title: 'Rotina', text: 'Planner por dia, semana e mês.' },
  { icon: Flame, title: 'Hábitos', text: 'Sequências, metas semanais e calendário visual.' },
  { icon: FileText, title: 'Documentos', text: 'Onde está cada documento e quando vence.' },
  { icon: MonitorSmartphone, title: 'Organização digital', text: 'Celular, e-mail, arquivos e fotos em ordem.' },
  { icon: ClipboardCheck, title: 'Checklists', text: 'Modelos prontos para casa, viagem e mudança.' },
  { icon: Trophy, title: 'Desafio 7 dias', text: 'Um passo a passo guiado e gamificado.' },
]

export function Features() {
  return (
    <section id="recursos" aria-labelledby="recursos-title" className="scroll-mt-20 py-20 sm:py-28">
      <Container>
        <SectionHeading id="recursos-title" eyebrow="Recursos" title="Tudo o que você precisa, nada que você não precisa" description="12 módulos integrados que conversam entre si e alimentam o seu painel." />
        <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <li key={feature.title} className="group bg-surface transition-colors hover:bg-surface-2/60">
              <Reveal variant="fade" delay={(i % 4) * 80 + Math.floor(i / 4) * 60} className="h-full p-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary-ink transition-[background-color,color,translate,scale] duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:bg-primary group-hover:text-white">
                  <feature.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold text-fg">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{feature.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
