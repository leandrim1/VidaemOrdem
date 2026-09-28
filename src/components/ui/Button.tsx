import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'soft'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-xs hover:bg-primary-dark active:bg-primary-dark',
  secondary: 'bg-navy text-white hover:bg-navy/90 dark:bg-surface-3 dark:hover:bg-line-strong',
  outline: 'border border-line bg-surface text-fg shadow-xs hover:bg-surface-2 hover:border-line-strong',
  ghost: 'text-fg-soft hover:bg-surface-2 hover:text-fg',
  danger: 'bg-danger text-white shadow-xs hover:brightness-95 dark:bg-red-600 dark:hover:bg-red-500',
  soft: 'bg-primary-soft text-primary-ink hover:bg-primary-soft/70',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1.5 rounded-[10px] px-3 text-sm',
  md: 'h-10 gap-2 rounded-[10px] px-4 text-sm',
  lg: 'h-12 gap-2 rounded-xl px-6 text-[15px]',
  icon: 'size-10 rounded-[10px]',
  'icon-sm': 'size-8 rounded-lg',
}

export function buttonClasses(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra?: string) {
  return cn(
    'inline-flex shrink-0 select-none items-center justify-center font-semibold whitespace-nowrap transition-[background-color,border-color,color,box-shadow,filter] duration-150',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
    'disabled:pointer-events-none disabled:opacity-55',
    variants[variant],
    sizes[size],
    extra,
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, leftIcon, rightIcon, fullWidth, className, children, disabled, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses(variant, size, cn(fullWidth && 'w-full', className))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  )
})
