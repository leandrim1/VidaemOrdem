/**
 * Mockups visuais da landing page, feitos em HTML/CSS/SVG (sem imagens e sem
 * a biblioteca de gráficos), para manter a página inicial leve e nítida em
 * qualquer resolução e tema.
 */
import { Bell, Check, CircleCheck, Flame, LayoutDashboard, ListChecks, Mail, Receipt, Smartphone, Target, Wallet, Camera, FolderOpen, Laptop, CalendarDays, Trophy } from 'lucide-react'
import { cn } from '@/lib/cn'
import { LogoMark } from '@/components/ui/Logo'

function Bar({ value, className = 'bg-primary', track = 'bg-primary-soft' }: { value: number; className?: string; track?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full', track)}>
      <div className={cn('h-full rounded-full', className)} style={{ width: `${value}%` }} />
    </div>
  )
}

function Ring({ value, size = 76 }: { value: number; size?: number }) {
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={8} className="stroke-primary-soft" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={8} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} className="stroke-primary" />
    </svg>
  )
}

const AREA_INCOME = 'M0,52 C30,50 50,56 80,48 C110,40 130,44 160,38 C190,32 210,40 240,30 L240,90 L0,90 Z'
const LINE_INCOME = 'M0,52 C30,50 50,56 80,48 C110,40 130,44 160,38 C190,32 210,40 240,30'
const AREA_EXPENSE = 'M0,66 C30,62 50,70 80,64 C110,58 130,56 160,60 C190,64 210,58 240,56 L240,90 L0,90 Z'
const LINE_EXPENSE = 'M0,66 C30,62 50,70 80,64 C110,58 130,56 160,60 C190,64 210,58 240,56'

export function DashboardMockup({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-line bg-surface shadow-overlay', className)} aria-hidden>
      <div className="flex items-center gap-2 border-b border-line bg-surface-2/60 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-amber-400" />
        <span className="size-2.5 rounded-full bg-green-400" />
        <span className="ml-3 hidden h-5 flex-1 max-w-64 rounded-md bg-surface px-2 text-[10px] leading-5 text-subtle sm:block">vidaemordem.app/app</span>
      </div>
      <div className="flex">
        <div className="hidden w-40 shrink-0 border-r border-line p-3 md:block">
          <div className="mb-4 flex items-center gap-1.5">
            <LogoMark className="size-5" />
            <span className="font-display text-[11px] font-extrabold text-fg">Vida em Ordem</span>
          </div>
          {[
            { icon: LayoutDashboard, label: 'Visão geral', active: true },
            { icon: Wallet, label: 'Finanças' },
            { icon: Receipt, label: 'Contas' },
            { icon: Target, label: 'Metas' },
            { icon: ListChecks, label: 'Tarefas' },
            { icon: CalendarDays, label: 'Rotina' },
            { icon: Flame, label: 'Hábitos' },
            { icon: Trophy, label: 'Desafio' },
          ].map((item) => (
            <div key={item.label} className={cn('mb-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] font-medium', item.active ? 'bg-primary-soft text-primary-ink' : 'text-muted')}>
              <item.icon className="size-3" />
              {item.label}
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1 bg-canvas p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-display text-[13px] font-extrabold text-fg sm:text-sm">Bom dia, Mariana! 👋</p>
              <p className="text-[10px] text-muted">Vamos colocar sua vida em ordem?</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex size-6 items-center justify-center rounded-md border border-line bg-surface text-muted">
                <Bell className="size-3" />
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-danger" />
              </span>
              <span className="flex size-6 items-center justify-center rounded-full bg-rose-600 text-[8px] font-bold text-white">MO</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Receitas', value: 'R$ 5.200', tone: 'text-success-ink' },
              { label: 'Despesas', value: 'R$ 3.840', tone: 'text-danger-ink' },
              { label: 'Saldo', value: 'R$ 1.360', tone: 'text-fg' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg border border-line bg-surface p-2 sm:p-2.5">
                <p className="text-[9px] text-muted sm:text-[10px]">{stat.label}</p>
                <p className={cn('mt-0.5 font-display text-[11px] font-bold sm:text-sm', stat.tone)}>{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-5 gap-2">
            <div className="col-span-3 rounded-lg border border-line bg-surface p-2.5">
              <p className="text-[10px] font-semibold text-fg">Evolução financeira</p>
              <svg viewBox="0 0 240 90" className="mt-1 h-20 w-full" preserveAspectRatio="none">
                {[22, 44, 66].map((y) => (
                  <line key={y} x1="0" x2="240" y1={y} y2={y} className="stroke-line" strokeWidth="1" />
                ))}
                <path d={AREA_INCOME} fill="var(--vo-chart-1)" fillOpacity="0.1" />
                <path d={LINE_INCOME} fill="none" stroke="var(--vo-chart-1)" strokeWidth="2" />
                <path d={AREA_EXPENSE} fill="var(--vo-chart-2)" fillOpacity="0.1" />
                <path d={LINE_EXPENSE} fill="none" stroke="var(--vo-chart-2)" strokeWidth="2" />
              </svg>
            </div>
            <div className="col-span-2 flex flex-col items-center justify-center rounded-lg border border-line bg-surface p-2">
              <p className="self-start text-[10px] font-semibold text-fg">Organização</p>
              <div className="relative mt-1">
                <Ring value={72} size={64} />
                <span className="absolute inset-0 flex items-center justify-center font-display text-xs font-extrabold text-fg">72%</span>
              </div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-line bg-surface p-2.5">
              <p className="mb-1.5 text-[10px] font-semibold text-fg">Tarefas de hoje</p>
              {['Pagar conta de luz', 'Enviar relatório', 'Agendar dentista'].map((task, i) => (
                <div key={task} className="flex items-center gap-1.5 py-0.5">
                  <span className={cn('flex size-3 items-center justify-center rounded-[3px] border', i === 0 ? 'border-success bg-success text-white' : 'border-line-strong')}>{i === 0 && <Check className="size-2" strokeWidth={4} />}</span>
                  <span className={cn('truncate text-[9px] sm:text-[10px]', i === 0 ? 'text-muted line-through' : 'text-fg-soft')}>{task}</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-line bg-surface p-2.5">
              <p className="mb-1.5 text-[10px] font-semibold text-fg">Metas</p>
              <p className="flex justify-between text-[9px] text-fg-soft sm:text-[10px]">
                Reserva de emergência <span className="font-semibold">32%</span>
              </p>
              <Bar value={32} className="bg-success" track="bg-success-soft" />
              <p className="mt-1.5 flex justify-between text-[9px] text-fg-soft sm:text-[10px]">
                Viagem <span className="font-semibold">72%</span>
              </p>
              <Bar value={72} className="bg-success" track="bg-success-soft" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FinanceMockup() {
  const cats = [
    { label: 'Moradia', value: 42, color: 'var(--vo-chart-1)', amount: 'R$ 1.614' },
    { label: 'Alimentação', value: 22, color: 'var(--vo-chart-2)', amount: 'R$ 841' },
    { label: 'Transporte', value: 8, color: 'var(--vo-chart-3)', amount: 'R$ 298' },
    { label: 'Assinaturas', value: 7, color: 'var(--vo-chart-8)', amount: 'R$ 273' },
    { label: 'Educação', value: 6, color: 'var(--vo-chart-5)', amount: 'R$ 249' },
  ]
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-raised" aria-hidden>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-fg">Despesas por categoria</p>
        <span className="rounded-md bg-surface-2 px-2 py-1 text-[11px] font-medium text-muted">Setembro</span>
      </div>
      <div className="mt-4 flex h-3 overflow-hidden rounded-full">
        {cats.map((c) => (
          <span key={c.label} style={{ width: `${c.value}%`, background: c.color }} className="border-r-2 border-surface last:border-r-0" />
        ))}
        <span className="flex-1 bg-surface-3" />
      </div>
      <ul className="mt-4 space-y-2.5">
        {cats.map((c) => (
          <li key={c.label} className="flex items-center gap-2.5 text-[13px]">
            <span className="size-2.5 rounded-[3px]" style={{ background: c.color }} />
            <span className="flex-1 text-fg-soft">{c.label}</span>
            <span className="text-xs text-muted">{c.value}%</span>
            <span className="w-16 text-right font-semibold text-fg">{c.amount}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-3 rounded-xl bg-warning-soft p-3 text-[12px] text-warning-ink">
        <Receipt className="size-4 shrink-0" />
        Conta de luz vence amanhã — R$ 164,30
      </div>
    </div>
  )
}

export function GoalsMockup() {
  const goals = [
    { name: 'Reserva de emergência', current: 'R$ 3.200', target: 'R$ 10.000', value: 32 },
    { name: 'Viagem para Lisboa', current: 'R$ 4.320', target: 'R$ 6.000', value: 72 },
    { name: 'Notebook novo', current: 'R$ 4.680', target: 'R$ 5.200', value: 90 },
  ]
  return (
    <div className="space-y-3" aria-hidden>
      {goals.map((g) => (
        <div key={g.name} className="rounded-2xl border border-line bg-surface p-4 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-success-soft text-success-ink">
              <Target className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">{g.name}</p>
              <p className="text-xs text-muted">
                {g.current} / {g.target}
              </p>
            </div>
            <span className="font-display text-lg font-extrabold text-fg">{g.value}%</span>
          </div>
          <div className="mt-3">
            <Bar value={g.value} className="bg-success" track="bg-success-soft" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function RoutineMockup() {
  const days = [
    { d: 'Seg', n: 28, items: [['07:00', 'Treino', 'p'], ['09:30', 'Reunião', 'p']] },
    { d: 'Ter', n: 29, items: [['08:00', 'Estudar UX', 'w'], ['18:00', 'Pilates', 'p']] },
    { d: 'Qua', n: 30, items: [['10:00', 'Planejamento', 'p']] },
    { d: 'Qui', n: 1, items: [['09:00', 'Dentista', 'p'], ['15:00', 'Documentos', 'w']] },
    { d: 'Sex', n: 2, items: [['20:00', 'Aniversário', 's']] },
  ] as const
  const tone = { p: 'bg-primary-soft text-primary-ink border-primary/20', w: 'bg-warning-soft text-warning-ink border-warning/25', s: 'bg-success-soft text-success-ink border-success/25' }
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-raised" aria-hidden>
      <p className="mb-3 text-sm font-bold text-fg">Sua semana</p>
      <div className="grid grid-cols-5 gap-1.5">
        {days.map((day, i) => (
          <div key={day.d} className={cn('min-h-36 rounded-lg border p-1.5', i === 0 ? 'border-primary/40 bg-primary-soft/40' : 'border-line bg-surface-2/40')}>
            <p className="mb-1.5 flex items-center justify-between text-[10px] font-semibold text-muted uppercase">
              {day.d}
              <span className={cn('flex size-5 items-center justify-center rounded-full text-[10px]', i === 0 ? 'bg-primary text-white' : 'text-fg')}>{day.n}</span>
            </p>
            <div className="space-y-1">
              {day.items.map(([time, title, t]) => (
                <div key={title} className={cn('rounded-md border p-1', tone[t])}>
                  <p className="text-[9px] font-semibold opacity-80">{time}</p>
                  <p className="truncate text-[10px] font-semibold text-fg">{title}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DigitalMockup() {
  const areas = [
    { icon: Smartphone, label: 'Celular', value: 100 },
    { icon: Laptop, label: 'Computador', value: 80 },
    { icon: Mail, label: 'E-mail', value: 80 },
    { icon: FolderOpen, label: 'Arquivos', value: 60 },
    { icon: Camera, label: 'Fotos', value: 40 },
  ]
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-raised" aria-hidden>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Ring value={72} size={72} />
          <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-extrabold text-fg">72%</span>
        </div>
        <div>
          <p className="text-sm font-bold text-fg">Organização digital</p>
          <p className="text-xs text-muted">18 de 25 itens concluídos</p>
        </div>
      </div>
      <ul className="mt-4 space-y-3">
        {areas.map((a) => (
          <li key={a.label} className="flex items-center gap-3">
            <span className={cn('flex size-8 items-center justify-center rounded-lg', a.value === 100 ? 'bg-success text-white' : 'bg-primary-soft text-primary-ink')}>
              {a.value === 100 ? <CircleCheck className="size-4" /> : <a.icon className="size-4" />}
            </span>
            <div className="flex-1">
              <p className="mb-1 flex justify-between text-xs font-medium text-fg-soft">
                {a.label} <span className="text-muted">{a.value}%</span>
              </p>
              <Bar value={a.value} className={a.value === 100 ? 'bg-success' : 'bg-primary'} track={a.value === 100 ? 'bg-success-soft' : 'bg-primary-soft'} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
