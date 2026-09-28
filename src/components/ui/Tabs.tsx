import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export interface TabItem<T extends string> {
  value: T
  label: string
  count?: number
  icon?: ReactNode
}

interface TabsProps<T extends string> {
  items: ReadonlyArray<TabItem<T>>
  value: T
  onChange: (value: T) => void
  label: string
  variant?: 'underline' | 'segmented'
  /** Id do painel controlado pelas abas (role="tabpanel"). */
  panelId?: string
  className?: string
  fullWidth?: boolean
}

export function Tabs<T extends string>({ items, value, onChange, label, variant = 'segmented', panelId, className, fullWidth }: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null)

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % items.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else return
    event.preventDefault()
    onChange(items[next].value)
    listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      className={cn(
        'vo-scrollbar flex max-w-full overflow-x-auto',
        variant === 'segmented' ? 'gap-1 rounded-xl bg-surface-2 p-1' : 'gap-5 border-b border-line',
        fullWidth ? 'w-full' : 'w-fit',
        className,
      )}
    >
      {items.map((item, index) => {
        const selected = item.value === value
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              'inline-flex shrink-0 items-center justify-center gap-2 text-sm font-semibold whitespace-nowrap transition-colors [&_svg]:size-4',
              fullWidth && 'flex-1',
              variant === 'segmented'
                ? cn('h-9 rounded-lg px-3.5', selected ? 'bg-surface text-fg shadow-card' : 'text-muted hover:text-fg')
                : cn('-mb-px h-11 border-b-2 px-0.5', selected ? 'border-primary text-fg' : 'border-transparent text-muted hover:text-fg'),
            )}
          >
            {item.icon}
            {item.label}
            {item.count !== undefined && (
              <span
                className={cn(
                  'vo-tabular min-w-5 rounded-full px-1.5 text-center text-[11px] leading-5',
                  selected ? 'bg-primary-soft text-primary-ink' : 'bg-surface-3 text-muted',
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
