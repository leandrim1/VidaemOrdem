import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { fieldClasses } from './Input'

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number | undefined
  onChange: (value: number) => void
  invalid?: boolean
}

const formatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/**
 * Campo monetário no padrão brasileiro: o usuário digita apenas números e o
 * valor é formatado automaticamente (ex.: 12345 → 123,45).
 */
export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(function CurrencyInput(
  { value, onChange, invalid, className, ...props },
  ref,
) {
  const display = value !== undefined && Number.isFinite(value) && value > 0 ? formatter.format(value) : ''
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-medium text-muted" aria-hidden>
        R$
      </span>
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="0,00"
        value={display}
        aria-invalid={invalid || undefined}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, '').slice(0, 11)
          onChange(digits ? Number(digits) / 100 : 0)
        }}
        className={cn(fieldClasses, 'vo-tabular h-11 pr-3.5 pl-10 sm:h-10', className)}
        {...props}
      />
    </div>
  )
})
