import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface FormFieldProps {
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  /** Recebe o id do campo e os ids de descrição para ligar label/erro ao input. */
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
  labelAction?: ReactNode
}

export function FormField({ label, error, hint, required, className, children, labelAction }: FormFieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-fg-soft">
          {label}
          {required && (
            <span className="ml-0.5 text-danger-ink" aria-hidden>
              *
            </span>
          )}
        </label>
        {labelAction}
      </div>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {error ? (
        <p id={errorId} role="alert" className="text-[13px] font-medium text-danger-ink">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-[13px] text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
