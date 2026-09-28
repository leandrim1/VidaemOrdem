import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface TooltipProps {
  content: ReactNode
  children: ReactElement<{ 'aria-describedby'?: string }>
  side?: 'top' | 'bottom'
  className?: string
}

/** Tooltip leve em CSS: aparece no hover e no foco por teclado. */
export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  const id = useId()
  const trigger = isValidElement(children) ? cloneElement(children, { 'aria-describedby': id }) : children
  return (
    <span className={cn('group/tooltip relative inline-flex', className)}>
      {trigger}
      <span
        id={id}
        role="tooltip"
        className={cn(
          'pointer-events-none absolute left-1/2 z-50 w-max max-w-60 -translate-x-1/2 rounded-lg bg-navy px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-raised transition-opacity duration-150 dark:bg-surface-3 dark:text-fg',
          'group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100',
          side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
        )}
      >
        {content}
      </span>
    </span>
  )
}
