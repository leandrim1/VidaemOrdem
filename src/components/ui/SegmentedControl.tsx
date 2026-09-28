import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SegmentedOption<T extends string> {
  value: T
  label: string
  icon?: ReactNode
  activeClassName?: string
}

interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<SegmentedOption<T>>
  className?: string
}

/** Grupo de rádio com aparência segmentada (setas do teclado funcionam nativamente). */
export function SegmentedControl<T extends string>({ label, value, onChange, options, className }: SegmentedControlProps<T>) {
  const name = useId()
  return (
    <div role="radiogroup" aria-label={label} className={cn('grid gap-1 rounded-xl bg-surface-2 p-1', className)} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((option) => {
        const checked = option.value === value
        return (
          <label
            key={option.value}
            className={cn(
              'flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors has-focus-visible:ring-2 has-focus-visible:ring-primary [&_svg]:size-4',
              checked ? cn('bg-surface shadow-card', option.activeClassName ?? 'text-fg') : 'text-muted hover:text-fg',
            )}
          >
            <input type="radio" name={name} value={option.value} checked={checked} onChange={() => onChange(option.value)} className="sr-only" />
            {option.icon}
            {option.label}
          </label>
        )
      })}
    </div>
  )
}
