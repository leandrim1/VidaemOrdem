import type { ReactNode } from 'react'
import { CircleCheck, Crosshair, Flame, ListChecks, Receipt } from 'lucide-react'
import { cn } from '@/lib/cn'
import { DigitalMockup, FinanceMockup, GoalsMockup, RoutineMockup } from '../mockups'
import { Reveal } from '@/components/ui/Reveal'
import { Container, SectionHeading } from './SectionHeading'

interface ShowcaseProps {
  id: string
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  visual: ReactNode
  reverse?: boolean
  tinted?: boolean
}

function ShowcaseRow({ id, eyebrow, title, description, bullets, visual, reverse, tinted }: ShowcaseProps) {
  return (
    <section aria-labelledby={`${id}-title`} className={cn('py-16 sm:py-24', tinted && 'bg-surface-2/50 dark:bg-surface/40')}>
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className={cn(reverse && 'lg:order-2')}>
            <SectionHeading id={`${id}-title`} align="left" eyebrow={eyebrow} title={title} description={description} />
            <ul className="mt-7 space-y-3">
              {bullets.map((bullet, i) => (
                <Reveal as="li" variant={reverse ? 'right' : 'left'} delay={150 + i * 80} key={bullet} className="flex items-start gap-3 text-[15px] text-fg-soft">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
                  {bullet}
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal variant={reverse ? 'left' : 'right'} delay={120} className={cn('mx-auto w-full max-w-md lg:max-w-none', reverse && 'lg:order-1')}>
            {visual}
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

function DashboardVisual() {
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-hidden>
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-raised sm:col-span-2">
        <p className="text-sm text-muted">Saldo do mês</p>
        <p className="mt-1 font-display text-3xl font-extrabold text-fg">R$ 1.360,00</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-surface-2/70 p-3">
            <p className="text-xs text-muted">Receitas</p>
            <p className="font-bold text-fg">R$ 5.200,00</p>
          </div>
          <div className="rounded-xl bg-surface-2/70 p-3">
            <p className="text-xs text-muted">Despesas</p>
            <p className="font-bold text-fg">R$ 3.840,00</p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <p className="flex items-center gap-2 text-sm font-bold text-fg">
          <Crosshair className="size-4 text-primary-ink" /> Foco de hoje
        </p>
        {[
          [Receipt, 'Pagar conta de luz'],
          [ListChecks, 'Enviar relatório'],
          [Flame, 'Registrar leitura'],
        ].map(([Icon, label], i) => {
          const I = Icon as typeof Receipt
          return (
            <p key={String(label)} className="mt-3 flex items-center gap-2 text-[13px] text-fg-soft">
              <span className="flex size-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white dark:bg-surface-3">{i + 1}</span>
              <I className="size-3.5 text-muted" />
              {String(label)}
            </p>
          )
        })}
      </div>
      <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
        <p className="text-sm font-bold text-fg">Hábitos</p>
        <p className="mt-2 font-display text-3xl font-extrabold text-fg">78%</p>
        <div className="mt-3 flex gap-1">
          {[1, 1, 1, 0, 1, 1, 0].map((done, i) => (
            <span key={i} className={cn('h-6 flex-1 rounded-md', done ? 'bg-success' : 'bg-surface-3')} />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">Sequência de 12 dias 🔥</p>
      </div>
    </div>
  )
}

export function Showcase() {
  return (
    <div id="plataforma" className="scroll-mt-16">
      <ShowcaseRow
        id="dashboard"
        eyebrow="Dashboard"
        title="Sua vida inteira em uma tela"
        description="Abra o app e saiba em segundos como está seu mês, o que vence em breve e o que fazer hoje."
        bullets={['Saldo, receitas e despesas do mês', 'Contas próximas e tarefas do dia', 'Índice de organização calculado com seus dados', '3 ações recomendadas para o seu dia']}
        visual={<DashboardVisual />}
        tinted
      />
      <ShowcaseRow
        id="financas"
        eyebrow="Finanças"
        title="Saiba exatamente para onde vai seu dinheiro"
        description="Registre em segundos, veja gastos por categoria e acompanhe a evolução mês a mês — sem planilhas."
        bullets={['Categorias claras e gráficos fáceis de entender', 'Contas a pagar com status e alertas', 'Cartões com limite e fatura sob controle', 'Assinaturas somadas: descubra o custo real']}
        visual={<FinanceMockup />}
        reverse
      />
      <ShowcaseRow
        id="metas"
        eyebrow="Metas"
        title="Tire seus planos do papel"
        description="Defina valor e prazo, registre cada aporte e veja o progresso crescer. Nós calculamos quanto guardar por mês."
        bullets={['Reserva de emergência, viagens, cursos e mais', 'Aportes e retiradas com histórico', '+50 pontos a cada meta concluída']}
        visual={<GoalsMockup />}
        tinted
      />
      <ShowcaseRow
        id="rotina"
        eyebrow="Rotina"
        title="Uma semana realista, com espaço para você"
        description="Planeje compromissos, tarefas e eventos por dia, semana ou mês e crie hábitos que realmente ficam."
        bullets={['Planner visual por dia, semana e mês', 'Tarefas com prioridade, data e categoria', 'Hábitos com sequências e calendário']}
        visual={<RoutineMockup />}
        reverse
      />
      <ShowcaseRow
        id="digital"
        eyebrow="Organização digital"
        title="Menos bagunça digital, mais foco"
        description="Um checklist guiado para deixar celular, computador, e-mail, arquivos e fotos em ordem — e mantê-los assim."
        bullets={['Progresso por área e geral', 'Documentos importantes sempre localizáveis', 'Checklists prontos para casa, viagem e mudança']}
        visual={<DigitalMockup />}
        tinted
      />
    </div>
  )
}
