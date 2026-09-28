import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  icon?: ReactNode
  /** Oculta o cabeçalho padrão (para conteúdos customizados como celebrações). */
  bare?: boolean
  className?: string
}

const sizes = { sm: 'sm:max-w-md', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' }

let openCount = 0
function lockScroll() {
  openCount++
  document.documentElement.style.overflow = 'hidden'
}
function unlockScroll() {
  openCount = Math.max(0, openCount - 1)
  if (openCount === 0) document.documentElement.style.overflow = ''
}

/**
 * Modal acessível baseado em <dialog> nativo: foco preso no diálogo, Esc
 * fecha, conteúdo fora fica inerte. No mobile vira uma "bottom sheet".
 * O conteúdo só é montado enquanto aberto (formulários sempre começam limpos).
 */
export function Modal({ open, onClose, title, description, children, size = 'md', icon, bare, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const pointerDownOnBackdrop = useRef(false)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      const previouslyFocused = document.activeElement as HTMLElement | null
      dialog.showModal()
      lockScroll()
      // Mantém os toasts visíveis acima do novo diálogo (camada superior).
      window.dispatchEvent(new Event('vo:dialog-open'))
      return () => {
        if (dialog.open) dialog.close()
        unlockScroll()
        previouslyFocused?.focus?.()
      }
    }
  }, [open])

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onPointerDown={(event) => {
        pointerDownOnBackdrop.current = event.target === ref.current
      }}
      onClick={(event) => {
        if (event.target === ref.current && pointerDownOnBackdrop.current) onClose()
      }}
      className={cn(
        'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-none overflow-hidden rounded-2xl border border-line bg-surface p-0 text-fg shadow-overlay',
        'open:flex open:flex-col open:animate-scale-in',
        'max-sm:mb-0 max-sm:max-h-[92dvh] max-sm:w-full max-sm:rounded-b-none max-sm:border-b-0 max-sm:open:animate-sheet-up',
        sizes[size],
        className,
      )}
    >
      {open && (
        <>
          {bare ? (
            <h2 id={titleId} className="sr-only">
              {title}
            </h2>
          ) : (
            <header className="flex items-start gap-3 border-b border-line px-5 py-4 sm:px-6">
              {icon && <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-primary-soft text-primary-ink [&_svg]:size-[18px]">{icon}</span>}
              <div className="min-w-0 flex-1">
                <h2 id={titleId} className="text-lg font-bold text-fg">
                  {title}
                </h2>
                {description && (
                  <p id={descriptionId} className="mt-0.5 text-sm text-muted">
                    {description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="-mt-1 -mr-2 flex size-9 shrink-0 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <X className="size-5" />
              </button>
            </header>
          )}
          <div className="vo-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</div>
        </>
      )}
    </dialog>,
    document.body,
  )
}

export function ModalBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-5 py-5 sm:px-6', className)}>{children}</div>
}

export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'sticky bottom-0 flex flex-col-reverse gap-2 border-t border-line bg-surface px-5 py-4 sm:flex-row sm:justify-end sm:px-6',
        'pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
