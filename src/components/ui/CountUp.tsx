import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion, useInView } from '@/hooks/useInView'

interface CountUpProps {
  value: number
  /** Duração da animação em ms. */
  duration?: number
  format?: (value: number) => string
  className?: string
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/** Número que conta de 0 até o valor final quando aparece na tela. */
export function CountUp({ value, duration = 1400, format = (v) => Math.round(v).toLocaleString('pt-BR'), className }: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>()
  const [current, setCurrent] = useState(0)
  // Parte do valor exibido atualmente: ao mudar, anima do valor antigo ao novo.
  const shownRef = useRef(0)

  useEffect(() => {
    if (!inView) return
    if (prefersReducedMotion()) {
      shownRef.current = value
      setCurrent(value)
      return
    }
    let frame = 0
    const from = shownRef.current
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const next = from + (value - from) * easeOutCubic(progress)
      shownRef.current = next
      setCurrent(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {/* O valor final fica disponível para leitores de tela desde o início. */}
      <span aria-hidden>{format(current)}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  )
}
