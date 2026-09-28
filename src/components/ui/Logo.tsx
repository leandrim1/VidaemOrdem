import { cn } from '@/lib/cn'

interface LogoProps {
  className?: string
  showText?: boolean
  inverted?: boolean
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn('size-8 shrink-0', className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#2563EB" />
      <path d="M9 16.8 13.8 21.5 23 11.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Logo({ className, showText = true, inverted }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      {showText && (
        <span className={cn('font-display text-[17px] font-extrabold tracking-tight', inverted ? 'text-white' : 'text-fg')}>
          Vida em Ordem
        </span>
      )}
    </span>
  )
}
