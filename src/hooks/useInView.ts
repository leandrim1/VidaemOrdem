import { useEffect, useRef, useState } from 'react'

interface InViewOptions {
  /** Margem para disparar um pouco antes/depois de entrar na tela. */
  rootMargin?: string
  threshold?: number
  /** Dispara uma única vez (padrão) — ideal para animações de entrada. */
  once?: boolean
}

/** Informa quando o elemento aparece na viewport (IntersectionObserver). */
export function useInView<T extends Element>({ rootMargin = '0px 0px -10% 0px', threshold = 0.15, once = true }: InViewOptions = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin, threshold, once])

  return { ref, inView }
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
