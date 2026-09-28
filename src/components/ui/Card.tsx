import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface CardProps extends HTMLAttributes<HTMLElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
  as?: 'div' | 'section' | 'article'
}

const paddings = { none: '', sm: 'p-4', md: 'p-5 sm:p-6', lg: 'p-6 sm:p-8' }

export function Card({ padding = 'md', interactive, as: Tag = 'div', className, ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-card border border-line bg-surface shadow-card',
        paddings[padding],
        interactive && 'transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-raised',
        className,
      )}
      {...props}
    />
  )
}

interface CardHeaderProps {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  icon?: ReactNode
  className?: string
  titleAs?: 'h2' | 'h3'
}

export function CardHeader({ title, description, action, icon, className, titleAs: Title = 'h2' }: CardHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-start justify-between gap-3', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {icon && <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary-soft text-primary-ink [&_svg]:size-[18px]">{icon}</span>}
        <div className="min-w-0">
          <Title className="text-[15px] font-bold text-fg">{title}</Title>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
