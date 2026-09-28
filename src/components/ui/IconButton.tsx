import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Rótulo acessível obrigatório (botões só com ícone). */
  label: string
  icon: ReactNode
  size?: 'sm' | 'md'
  tone?: 'default' | 'danger'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, size = 'md', tone = 'default', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors',
        'hover:bg-surface-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:pointer-events-none disabled:opacity-50',
        tone === 'danger' && 'hover:bg-danger-soft hover:text-danger-ink',
        size === 'sm' ? 'size-8 [&_svg]:size-4' : 'size-10 [&_svg]:size-[18px]',
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  )
})
