import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

interface AccordionItem {
  question: string
  answer: ReactNode
}

/** Acordeão com <details>/<summary> nativos: acessível e funciona sem JavaScript. */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  return (
    <div className={cn('divide-y divide-line rounded-card border border-line bg-surface', className)}>
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-fg hover:bg-surface-2/50 sm:px-6 [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="px-5 pb-5 text-[15px] leading-relaxed text-muted sm:px-6">{item.answer}</div>
        </details>
      ))}
    </div>
  )
}
