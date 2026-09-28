import { addMonths, format, isSameMonth } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { capitalize, locale } from '@/utils/date'

interface MonthSwitcherProps {
  month: Date
  onChange: (month: Date) => void
  min?: Date
}

export function MonthSwitcher({ month, onChange, min }: MonthSwitcherProps) {
  const isCurrent = isSameMonth(month, new Date())
  const atMin = min ? isSameMonth(month, min) : false
  return (
    <div className="inline-flex items-center rounded-[10px] border border-line bg-surface shadow-xs">
      <button
        type="button"
        onClick={() => onChange(addMonths(month, -1))}
        disabled={atMin}
        aria-label="Mês anterior"
        className="flex size-10 items-center justify-center rounded-l-[10px] text-muted hover:bg-surface-2 hover:text-fg disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="min-w-36 px-2 text-center text-sm font-semibold text-fg" aria-live="polite">
        {capitalize(format(month, 'MMMM yyyy', { locale }))}
      </span>
      <button
        type="button"
        onClick={() => onChange(addMonths(month, 1))}
        disabled={isCurrent}
        aria-label="Próximo mês"
        className="flex size-10 items-center justify-center rounded-r-[10px] text-muted hover:bg-surface-2 hover:text-fg disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}
