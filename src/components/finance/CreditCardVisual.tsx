import type { CreditCard } from '@/types'
import { cn } from '@/lib/cn'
import { usePreferencesStore } from '@/stores/preferencesStore'

const BRAND_LABEL: Record<CreditCard['brand'], string> = {
  visa: 'VISA',
  mastercard: 'mastercard',
  elo: 'elo',
  amex: 'AMEX',
  hipercard: 'Hipercard',
}

/** Representação visual do cartão (cor sólida da marca, com textura sutil). */
export function CreditCardVisual({ card, className }: { card: Pick<CreditCard, 'name' | 'bank' | 'brand' | 'lastDigits' | 'color'>; className?: string }) {
  const hidden = usePreferencesStore((s) => s.hideValues)
  return (
    <div
      className={cn('relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl p-5 text-white shadow-raised', className)}
      style={{ backgroundColor: card.color }}
      role="img"
      aria-label={`Cartão ${card.bank} ${card.name} final ${card.lastDigits}`}
    >
      <div className="pointer-events-none absolute -top-16 -right-10 size-48 rounded-full bg-white/10" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 -left-12 size-56 rounded-full bg-black/10" aria-hidden />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold tracking-wider text-white/70 uppercase">{card.bank}</p>
            <p className="font-display text-base font-bold">{card.name}</p>
          </div>
          <span className="flex h-7 w-10 items-center justify-center rounded-md bg-gradient-to-br from-amber-200 to-amber-400 shadow-inner" aria-hidden>
            <span className="h-4 w-6 rounded-sm border border-amber-600/40" />
          </span>
        </div>
        <div className="flex items-end justify-between">
          <p className="vo-tabular font-mono text-sm tracking-[0.2em] text-white/90">•••• {hidden ? '••••' : card.lastDigits}</p>
          <p className={cn('text-sm font-extrabold italic', card.brand === 'mastercard' && 'not-italic font-bold lowercase')}>{BRAND_LABEL[card.brand]}</p>
        </div>
      </div>
    </div>
  )
}
