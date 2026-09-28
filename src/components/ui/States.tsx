import type { ReactNode } from 'react'
import { CloudOff, Inbox, LoaderCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
  compact?: boolean
}

export function EmptyState({ icon, title, description, action, className, compact }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center', compact ? 'px-4 py-8' : 'px-6 py-14', className)}>
      <span className={cn('flex items-center justify-center rounded-2xl bg-primary-soft text-primary-ink', compact ? 'size-11 [&_svg]:size-5' : 'size-14 [&_svg]:size-6')}>
        {icon ?? <Inbox />}
      </span>
      <h3 className={cn('mt-4 font-bold text-fg', compact ? 'text-[15px]' : 'text-lg')}>{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-lg bg-surface-3', className)} aria-hidden />
}

interface LoadingStateProps {
  variant?: 'page' | 'cards' | 'list' | 'table' | 'spinner'
  label?: string
  className?: string
  count?: number
}

export function LoadingState({ variant = 'list', label = 'Carregando…', className, count = 4 }: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div role="status" className={cn('flex items-center justify-center gap-2 py-10 text-sm text-muted', className)}>
        <LoaderCircle className="size-5 animate-spin text-primary" aria-hidden />
        {label}
      </div>
    )
  }
  return (
    <div role="status" aria-label={label} className={className}>
      <span className="sr-only">{label}</span>
      {variant === 'page' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-28 rounded-card" />
            ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Skeleton className="h-72 rounded-card lg:col-span-2" />
            <Skeleton className="h-72 rounded-card" />
          </div>
        </div>
      )}
      {variant === 'cards' && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: count }, (_, i) => (
            <Skeleton key={i} className="h-44 rounded-card" />
          ))}
        </div>
      )}
      {variant === 'list' && (
        <div className="space-y-3">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-10 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}
      {variant === 'table' && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: count }, (_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      )}
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({ title = 'Não foi possível carregar', message = 'Verifique sua conexão e tente novamente.', onRetry, className }: ErrorStateProps) {
  return (
    <div role="alert" className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <span className="flex size-14 items-center justify-center rounded-2xl bg-danger-soft text-danger-ink">
        <CloudOff className="size-6" aria-hidden />
      </span>
      <h3 className="mt-4 text-lg font-bold text-fg">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-5" leftIcon={<RefreshCw className="size-4" />} onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
