import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'navy'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  icon?: ReactNode
  dot?: boolean
  size?: 'sm' | 'md'
}

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-surface-2 text-fg-soft ring-line',
  primary: 'bg-primary-soft text-primary-ink ring-primary/15',
  success: 'bg-success-soft text-success-ink ring-success/20',
  warning: 'bg-warning-soft text-warning-ink ring-warning/25',
  danger: 'bg-danger-soft text-danger-ink ring-danger/20',
  navy: 'bg-navy text-white ring-navy dark:bg-surface-3',
}

const dots: Record<BadgeTone, string> = {
  neutral: 'bg-muted',
  primary: 'bg-primary-ink',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  navy: 'bg-white',
}

export function Badge({ tone = 'neutral', icon, dot, size = 'sm', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap ring-1 ring-inset',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-[13px]',
        '[&_svg]:size-3.5',
        tones[tone],
        className,
      )}
      {...props}
    >
      {dot && <span className={cn('size-1.5 rounded-full', dots[tone])} aria-hidden />}
      {icon}
      {children}
    </span>
  )
}
