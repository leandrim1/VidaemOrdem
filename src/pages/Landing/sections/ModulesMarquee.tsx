import { CalendarDays, ClipboardCheck, CreditCard, FileText, Flame, ListChecks, MonitorSmartphone, Receipt, Repeat, Target, Trophy, Wallet } from 'lucide-react'

const MODULES = [
  { icon: Wallet, label: 'Finanças' },
  { icon: Receipt, label: 'Contas' },
  { icon: CreditCard, label: 'Cartões' },
  { icon: Repeat, label: 'Assinaturas' },
  { icon: Target, label: 'Metas' },
  { icon: ListChecks, label: 'Tarefas' },
  { icon: CalendarDays, label: 'Rotina' },
  { icon: Flame, label: 'Hábitos' },
  { icon: FileText, label: 'Documentos' },
  { icon: MonitorSmartphone, label: 'Organização digital' },
  { icon: ClipboardCheck, label: 'Checklists' },
  { icon: Trophy, label: 'Desafio 7 dias' },
]

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={hidden || undefined}>
      {MODULES.map((module) => (
        <li key={module.label} className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium whitespace-nowrap text-fg-soft shadow-xs">
          <module.icon className="size-4 text-primary-ink" aria-hidden />
          {module.label}
        </li>
      ))}
    </ul>
  )
}

/** Faixa contínua com os módulos (pausa ao passar o mouse). */
export function ModulesMarquee() {
  return (
    <section aria-label="Módulos do Vida em Ordem" className="py-6">
      <p className="mb-5 text-center text-sm font-medium text-muted">Tudo o que você precisa, em um só lugar</p>
      <div className="vo-marquee-host relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="vo-marquee flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  )
}
