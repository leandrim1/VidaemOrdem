import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

export type ProgressTone = 'primary' | 'success' | 'warning' | 'danger' | 'auto-usage'

interface ProgressBarProps {
  value: number
  label: string
  tone?: ProgressTone
  size?: 'xs' | 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
  /** Anima a barra a partir de zero ao montar. */
  animate?: boolean
}

const heights = { xs: 'h-1', sm: 'h-1.5', md: 'h-2', lg: 'h-3' }

const tones: Record<Exclude<ProgressTone, 'auto-usage'>, { fill: string; track: string }> = {
  primary: { fill: 'bg-primary', track: 'bg-primary-soft' },
  success: { fill: 'bg-success', track: 'bg-success-soft' },
  warning: { fill: 'bg-warning', track: 'bg-warning-soft' },
  danger: { fill: 'bg-danger', track: 'bg-danger-soft' },
}

/** Uso (ex.: limite do cartão): azul até 60%, âmbar até 85%, vermelho acima. */
function usageTone(value: number) {
  if (value >= 85) return tones.danger
  if (value >= 60) return tones.warning
  return tones.primary
}

export function ProgressBar({ value, label, tone = 'primary', size = 'sm', showValue, className, animate = true }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))
  const [width, setWidth] = useState(animate ? 0 : clamped)

  useEffect(() => {
    if (!animate) {
      setWidth(clamped)
      return
    }
    const frame = requestAnimationFrame(() => setWidth(clamped))
    return () => cancelAnimationFrame(frame)
  }, [clamped, animate])

  const palette = tone === 'auto-usage' ? usageTone(clamped) : tones[tone]

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('relative w-full overflow-hidden rounded-full', heights[size], palette.track)}
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]', palette.fill)}
          style={{ width: `${width}%` }}
        />
      </div>
      {showValue && <span className="vo-tabular w-10 shrink-0 text-right text-xs font-semibold text-fg-soft">{Math.round(clamped)}%</span>}
    </div>
  )
}
