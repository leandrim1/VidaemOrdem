import { memo } from 'react'
import { ChevronRight, CircleCheck } from 'lucide-react'
import type { Checklist } from '@/types'
import { cn } from '@/lib/cn'
import { checklistProgress } from '@/hooks/useChecklists'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { CHECKLIST_ICONS } from './icons'

export const ChecklistCard = memo(function ChecklistCard({ checklist, onOpen }: { checklist: Checklist; onOpen: (checklist: Checklist) => void }) {
  const Icon = CHECKLIST_ICONS[checklist.icon]
  const { done, total, percent, complete } = checklistProgress(checklist)
  return (
    <button
      type="button"
      onClick={() => onOpen(checklist)}
      className="group flex h-full w-full flex-col rounded-card border border-line bg-surface p-5 text-left shadow-card transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-raised sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn('flex size-11 items-center justify-center rounded-xl', complete ? 'bg-success text-white' : 'bg-primary-soft text-primary-ink')}>
          <Icon className="size-5" aria-hidden />
        </span>
        {complete ? (
          <Badge tone="success" icon={<CircleCheck />}>
            Concluído
          </Badge>
        ) : (
          <ChevronRight className="size-5 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
        )}
      </div>
      <h2 className="mt-4 text-base font-bold text-fg">{checklist.title}</h2>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-muted">{checklist.description}</p>
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="vo-tabular font-semibold text-fg-soft">
            {done}/{total} concluídos
          </span>
          <span className="vo-tabular text-muted">{Math.round(percent)}%</span>
        </div>
        <ProgressBar value={percent} tone={complete ? 'success' : 'primary'} size="sm" label={`Progresso: ${checklist.title}`} />
      </div>
    </button>
  )
})
