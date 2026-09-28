import { useState } from 'react'
import { ChevronDown, CircleCheck, Lightbulb, Lock } from 'lucide-react'
import type { ChallengeDay } from '@/types'
import { cn } from '@/lib/cn'
import { formatDate } from '@/utils/format'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface ChallengeDayCardProps {
  day: ChallengeDay
  state: 'done' | 'current' | 'locked'
  onToggle: (day: number, itemId: string) => void
  onComplete: (day: number) => Promise<void>
}

export function ChallengeDayCard({ day, state, onToggle, onComplete }: ChallengeDayCardProps) {
  const [expanded, setExpanded] = useState(state === 'current')
  const [completing, setCompleting] = useState(false)
  const done = day.items.filter((i) => i.done).length
  const allDone = done === day.items.length
  const open = state === 'current' || (state === 'done' && expanded)
  const panelId = `challenge-day-${day.day}`

  return (
    <article
      className={cn(
        'rounded-card border bg-surface shadow-card transition-colors',
        state === 'current' ? 'border-primary ring-1 ring-primary' : 'border-line',
        state === 'locked' && 'bg-surface-2/40 shadow-none',
      )}
    >
      <header className="flex items-center gap-4 p-5 sm:p-6">
        <span
          className={cn(
            'flex size-12 shrink-0 flex-col items-center justify-center rounded-xl font-display leading-none',
            state === 'done' && 'bg-success text-white',
            state === 'current' && 'bg-primary text-white',
            state === 'locked' && 'bg-surface-3 text-subtle',
          )}
        >
          {state === 'done' ? (
            <CircleCheck className="size-6" aria-hidden />
          ) : state === 'locked' ? (
            <Lock className="size-5" aria-hidden />
          ) : (
            <>
              <span className="text-[10px] font-semibold uppercase opacity-80">Dia</span>
              <span className="text-lg font-extrabold">{day.day}</span>
            </>
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className={cn('text-base font-bold sm:text-lg', state === 'locked' ? 'text-muted' : 'text-fg')}>
            Dia {day.day} — {day.title}
          </h2>
          <p className="mt-0.5 text-[13px] text-muted">
            {state === 'done' && day.completedAt ? `Concluído em ${formatDate(day.completedAt, "d 'de' MMMM")}` : state === 'locked' ? 'Conclua o dia anterior para desbloquear' : `${done}/${day.items.length} itens concluídos`}
          </p>
        </div>
        {state === 'done' && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={panelId}
            aria-label={expanded ? 'Recolher detalhes' : 'Ver detalhes'}
            className="flex size-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-fg"
          >
            <ChevronDown className={cn('size-5 transition-transform', expanded && 'rotate-180')} />
          </button>
        )}
      </header>

      {open && (
        <div id={panelId} className="animate-fade-in border-t border-line px-5 pt-5 pb-6 sm:px-6">
          <p className="text-[15px] leading-relaxed text-fg-soft">{day.description}</p>
          <div className="mt-4 flex gap-2.5 rounded-xl bg-warning-soft p-3.5 text-[13px] text-warning-ink">
            <Lightbulb className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>
              <strong>Dica:</strong> {day.tip}
            </p>
          </div>
          {state === 'current' && <ProgressBar value={(done / day.items.length) * 100} tone="success" size="sm" label={`Progresso do dia ${day.day}`} className="mt-5" />}
          <ul className="mt-4 space-y-1">
            {day.items.map((item) => (
              <li key={item.id}>
                <Checkbox
                  checked={item.done}
                  disabled={state !== 'current'}
                  onChange={() => onToggle(day.day, item.id)}
                  label={<span className={cn(item.done && 'text-muted line-through decoration-line-strong')}>{item.label}</span>}
                  tone="success"
                  size="lg"
                  className="rounded-xl px-2 py-2.5 hover:bg-surface-2/70"
                />
              </li>
            ))}
          </ul>
          {state === 'current' && (
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] text-muted">{allDone ? 'Tudo pronto! Conclua o dia para ganhar seus pontos.' : 'Marque todos os itens para concluir o dia.'}</p>
              <Button
                size="lg"
                disabled={!allDone}
                loading={completing}
                leftIcon={<CircleCheck className="size-4" />}
                onClick={async () => {
                  setCompleting(true)
                  try {
                    await onComplete(day.day)
                  } finally {
                    setCompleting(false)
                  }
                }}
              >
                Concluir dia {day.day}
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  )
}
