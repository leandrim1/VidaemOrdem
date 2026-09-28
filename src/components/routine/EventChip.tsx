import type { RoutineEvent } from '@/types'
import { cn } from '@/lib/cn'
import { EVENT_STYLES } from './eventStyles'

interface EventChipProps {
  event: RoutineEvent
  onClick: (event: RoutineEvent) => void
  variant?: 'full' | 'compact'
}

export function EventChip({ event, onClick, variant = 'full' }: EventChipProps) {
  const style = EVENT_STYLES[event.type]
  const Icon = style.icon
  return (
    <button
      type="button"
      onClick={() => onClick(event)}
      className={cn(
        'w-full rounded-lg border text-left transition-[filter] hover:brightness-95 dark:hover:brightness-125',
        style.chip,
        variant === 'full' ? 'p-2.5' : 'px-1.5 py-1',
      )}
      aria-label={`${style.label}: ${event.title}, ${event.startTime}${event.endTime ? ` às ${event.endTime}` : ''}`}
    >
      {variant === 'full' ? (
        <>
          <span className="vo-tabular flex items-center gap-1.5 text-[11px] font-semibold opacity-90">
            <Icon className="size-3 shrink-0" aria-hidden />
            {event.startTime}
            {event.endTime && `–${event.endTime}`}
          </span>
          <span className="mt-0.5 block text-[13px] leading-snug font-semibold text-fg">{event.title}</span>
          {event.location && <span className="mt-0.5 block truncate text-[11px] text-muted">{event.location}</span>}
        </>
      ) : (
        <span className="flex items-center gap-1 truncate text-[11px] font-semibold">
          <span className="vo-tabular shrink-0 opacity-80">{event.startTime}</span>
          <span className="truncate text-fg">{event.title}</span>
        </span>
      )}
    </button>
  )
}
