import type { Transaction } from '@/types'
import { cn } from '@/lib/cn'
import { TRANSACTION_ICONS } from './icons'

export function TransactionIcon({ transaction, className }: { transaction: Pick<Transaction, 'category' | 'type'>; className?: string }) {
  const Icon = TRANSACTION_ICONS[transaction.category]
  return (
    <span
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-xl',
        transaction.type === 'income' ? 'bg-success-soft text-success-ink' : 'bg-surface-2 text-fg-soft',
        className,
      )}
    >
      <Icon className="size-[18px]" aria-hidden />
    </span>
  )
}
