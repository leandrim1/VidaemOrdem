import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export const fieldClasses = cn(
  'w-full rounded-[10px] border border-line bg-surface text-[15px] text-fg shadow-xs transition-[border-color,box-shadow] sm:text-sm',
  'placeholder:text-subtle',
  'hover:border-line-strong',
  'focus:border-primary focus:ring-3 focus:ring-primary-ring focus:outline-none',
  'disabled:cursor-not-allowed disabled:bg-surface-2 disabled:opacity-70',
  'aria-invalid:border-danger aria-invalid:focus:ring-danger/25',
)

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode
  rightSlot?: ReactNode
  invalid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { leftIcon, rightSlot, invalid, className, ...props },
  ref,
) {
  return (
    <div className="relative">
      {leftIcon && (
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-subtle [&_svg]:size-[18px]" aria-hidden>
          {leftIcon}
        </span>
      )}
      <input
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(fieldClasses, 'h-11 px-3.5 sm:h-10', leftIcon && 'pl-10', rightSlot && 'pr-11', className)}
        {...props}
      />
      {rightSlot && <div className="absolute top-1/2 right-1.5 -translate-y-1/2">{rightSlot}</div>}
    </div>
  )
})

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ invalid, className, rows = 3, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(fieldClasses, 'min-h-20 resize-y px-3.5 py-2.5 leading-relaxed', className)}
      {...props}
    />
  )
})
