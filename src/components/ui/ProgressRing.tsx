import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ProgressRingProps {
  value: number
  size?: number
  stroke?: number
  label: string
  tone?: 'primary' | 'success' | 'warning'
  children?: ReactNode
  className?: string
}

const tones = {
  primary: { stroke: 'stroke-primary', track: 'stroke-primary-soft' },
  success: { stroke: 'stroke-success', track: 'stroke-success-soft' },
  warning: { stroke: 'stroke-warning', track: 'stroke-warning-soft' },
}

export function ProgressRing({ value, size = 120, stroke = 10, label, tone = 'primary', children, className }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const [shown, setShown] = useState(0)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(clamped))
    return () => cancelAnimationFrame(frame)
  }, [clamped])

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('relative inline-flex shrink-0 items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className={tones[tone].track} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - shown / 100)}
          className={cn(tones[tone].stroke, 'transition-[stroke-dashoffset] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]')}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}
