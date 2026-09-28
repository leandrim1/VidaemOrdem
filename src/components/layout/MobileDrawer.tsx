import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
}

/** Sidebar em formato de gaveta para mobile e tablet (usa <dialog> para foco e Esc). */
export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
      return () => {
        dialog.close()
        document.documentElement.style.overflow = ''
      }
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label="Menu de navegação"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      className="m-0 h-dvh max-h-dvh w-[288px] max-w-[85vw] border-0 border-r border-line bg-surface p-0 shadow-overlay open:animate-slide-in-left"
    >
      {open && (
        <div className="relative h-full">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="absolute top-3.5 right-3 z-10 flex size-9 items-center justify-center rounded-[10px] text-muted hover:bg-surface-2 hover:text-fg"
          >
            <X className="size-5" />
          </button>
          <Sidebar onNavigate={onClose} />
        </div>
      )}
    </dialog>
  )
}
