import { Link } from 'react-router-dom'
import { ChevronRight, Crosshair, Flame, ListChecks, Receipt, Target, Trophy, Wallet, type LucideIcon } from 'lucide-react'
import type { FocusAction } from '@/hooks/useDashboard'
import { Card, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/States'

const icons: Record<FocusAction['kind'], { icon: LucideIcon; className: string }> = {
  bill: { icon: Receipt, className: 'bg-warning-soft text-warning-ink' },
  task: { icon: ListChecks, className: 'bg-primary-soft text-primary-ink' },
  challenge: { icon: Trophy, className: 'bg-success-soft text-success-ink' },
  habit: { icon: Flame, className: 'bg-danger-soft text-danger-ink' },
  goal: { icon: Target, className: 'bg-success-soft text-success-ink' },
  finance: { icon: Wallet, className: 'bg-primary-soft text-primary-ink' },
}

export function TodayFocusCard({ actions }: { actions: FocusAction[] }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Foco de hoje" description="3 ações recomendadas para você" icon={<Crosshair />} />
      {actions.length === 0 ? (
        <EmptyState compact title="Tudo em dia!" description="Nenhuma ação pendente. Aproveite o dia." />
      ) : (
        <ol className="space-y-2">
          {actions.map((action, index) => {
            const { icon: Icon, className } = icons[action.kind]
            return (
              <li key={action.id}>
                <Link
                  to={action.href}
                  className="group flex items-center gap-3 rounded-xl border border-line p-3 transition-colors hover:border-line-strong hover:bg-surface-2/60"
                >
                  <span className="relative">
                    <span className={`flex size-10 items-center justify-center rounded-xl ${className}`}>
                      <Icon className="size-[18px]" aria-hidden />
                    </span>
                    <span className="absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white ring-2 ring-surface dark:bg-surface-3">
                      {index + 1}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 block text-sm leading-snug font-semibold text-fg">{action.title}</span>
                    <span className="block truncate text-[13px] text-muted">{action.description}</span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
                </Link>
              </li>
            )
          })}
        </ol>
      )}
    </Card>
  )
}
