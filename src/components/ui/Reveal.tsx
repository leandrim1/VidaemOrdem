import type { CSSProperties, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useInView } from '@/hooks/useInView'

type RevealVariant = 'up' | 'left' | 'right' | 'scale' | 'fade'

interface RevealProps {
  children: ReactNode
  variant?: RevealVariant
  /** Atraso em ms (útil para escalonar itens de uma grade). */
  delay?: number
  as?: ElementType
  className?: string
}

/**
 * Revela o conteúdo com uma transição suave quando ele entra na tela.
 * Com "reduzir movimento" ativado no sistema, aparece imediatamente.
 */
export function Reveal({ children, variant = 'up', delay = 0, as: Tag = 'div', className }: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>()
  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-visible={inView}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
      className={cn('vo-reveal', className)}
    >
      {children}
    </Tag>
  )
}
