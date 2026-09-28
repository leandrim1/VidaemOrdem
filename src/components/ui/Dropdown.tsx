import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/cn'

export interface DropdownItem {
  label: string
  icon?: ReactNode
  onSelect: () => void
  tone?: 'default' | 'danger'
  disabled?: boolean
}

interface TriggerProps {
  ref: (node: HTMLButtonElement | null) => void
  onClick: () => void
  onKeyDown: (event: React.KeyboardEvent) => void
  'aria-haspopup': 'menu'
  'aria-expanded': boolean
  'aria-controls': string
}

interface DropdownProps {
  trigger: (props: TriggerProps) => ReactNode
  items: DropdownItem[]
  align?: 'start' | 'end'
  label?: string
  header?: ReactNode
}

const MENU_WIDTH = 208

/**
 * Menu suspenso acessível (padrão "menu button"): setas navegam, Esc fecha e
 * devolve o foco ao botão. Renderizado em portal para não ser cortado por
 * containers com overflow (ex.: tabelas).
 */
export function Dropdown({ trigger, items, align = 'end', label, header }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const close = useCallback((restoreFocus = true) => {
    setOpen(false)
    if (restoreFocus) triggerRef.current?.focus()
  }, [])

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const menuHeight = menuRef.current?.offsetHeight ?? 0
    const spaceBelow = window.innerHeight - rect.bottom
    const top = spaceBelow < menuHeight + 12 && rect.top > menuHeight ? rect.top - menuHeight - 6 : rect.bottom + 6
    const rawLeft = align === 'end' ? rect.right - MENU_WIDTH : rect.left
    setPosition({ top, left: Math.max(8, Math.min(rawLeft, window.innerWidth - MENU_WIDTH - 8)) })
  }, [align])

  useLayoutEffect(() => {
    if (open) updatePosition()
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return
    const firstItem = menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')
    firstItem?.focus()
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) close(false)
    }
    // O menu acompanha o botão ao rolar a página ou redimensionar a janela.
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, close, updatePosition])

  const onMenuKeyDown = (event: React.KeyboardEvent) => {
    const nodes = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? [])
    const index = nodes.indexOf(document.activeElement as HTMLButtonElement)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      nodes[(index + 1) % nodes.length]?.focus()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      nodes[(index - 1 + nodes.length) % nodes.length]?.focus()
    } else if (event.key === 'Home') {
      event.preventDefault()
      nodes[0]?.focus()
    } else if (event.key === 'End') {
      event.preventDefault()
      nodes[nodes.length - 1]?.focus()
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      event.preventDefault()
      close()
    }
  }

  const container = typeof document !== 'undefined' ? (triggerRef.current?.closest('dialog') ?? document.body) : null

  return (
    <>
      {trigger({
        ref: (node) => {
          triggerRef.current = node
        },
        onClick: () => setOpen((value) => !value),
        onKeyDown: (event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault()
            setOpen(true)
          }
        },
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': menuId,
      })}
      {open &&
        container &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={label}
            onKeyDown={onMenuKeyDown}
            style={{ top: position?.top ?? -9999, left: position?.left ?? -9999, width: MENU_WIDTH }}
            className="fixed z-[90] animate-scale-in rounded-xl border border-line bg-surface p-1.5 shadow-overlay"
          >
            {header}
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  close()
                  item.onSelect()
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors focus:outline-none',
                  'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
                  item.tone === 'danger'
                    ? 'text-danger-ink hover:bg-danger-soft focus:bg-danger-soft'
                    : 'text-fg-soft hover:bg-surface-2 hover:text-fg focus:bg-surface-2 focus:text-fg',
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>,
          container,
        )}
    </>
  )
}
