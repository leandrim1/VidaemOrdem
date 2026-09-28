import { useCallback, useState } from 'react'

export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((value) => !value), [])
  return { isOpen, open, close, toggle, setIsOpen }
}

/** Controla um modal de edição: `null` fechado, `'new'` criação, ou o item em edição. */
export function useEditor<T>() {
  const [target, setTarget] = useState<T | 'new' | null>(null)
  return {
    isOpen: target !== null,
    editing: target !== null && target !== 'new' ? target : null,
    openNew: useCallback(() => setTarget('new'), []),
    openEdit: useCallback((item: T) => setTarget(() => item), []),
    close: useCallback(() => setTarget(null), []),
  }
}
