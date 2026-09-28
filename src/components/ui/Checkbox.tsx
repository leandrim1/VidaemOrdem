import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode
  description?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  tone?: 'primary' | 'success'
  labelClassName?: string
}

const boxSizes = { sm: 'size-4 rounded-[5px]', md: 'size-5 rounded-md', lg: 'size-6 rounded-[7px]' }
const iconSizes = { sm: 'size-3', md: 'size-3.5', lg: 'size-4' }

/** Checkbox nativo (acessível por teclado) com aparência customizada. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, size = 'md', tone = 'primary', className, labelClassName, checked, ...props },
  ref,
) {
  const box = (
    <span className={cn('relative inline-flex shrink-0 items-center justify-center', label ? 'mt-0.5' : undefined)}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        className={cn(
          'peer appearance-none border-[1.5px] border-line-strong bg-surface transition-colors',
          'hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          tone === 'success' ? 'checked:border-success checked:bg-success' : 'checked:border-primary checked:bg-primary',
          'disabled:cursor-not-allowed disabled:opacity-50',
          boxSizes[size],
        )}
        {...props}
      />
      <Check
        className={cn('pointer-events-none absolute text-white opacity-0 transition-opacity peer-checked:opacity-100', iconSizes[size])}
        strokeWidth={3.5}
        aria-hidden
      />
    </span>
  )

  if (!label) return <span className={className}>{box}</span>

  return (
    <label className={cn('flex cursor-pointer items-start gap-3', className)}>
      {box}
      <span className={cn('min-w-0', labelClassName)}>
        <span className="block text-sm text-fg">{label}</span>
        {description && <span className="mt-0.5 block text-[13px] text-muted">{description}</span>}
      </span>
    </label>
  )
})
