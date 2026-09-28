import { useCallback, useEffect, useRef } from 'react'
import { CircleAlert, CircleCheck, Info, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useToastStore, type ToastItem, type ToastVariant } from '@/stores/toastStore'

const icons: Record<ToastVariant, typeof CircleCheck> = {
  success: CircleCheck,
  error: CircleAlert,
  info: Info,
  reward: Sparkles,
}

const iconStyles: Record<ToastVariant, string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-primary-ink',
  reward: 'text-warning',
}

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismiss = useToastStore((s) => s.dismiss)
  const Icon = icons[toast.variant]

  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(toast.id), toast.duration)
    return () => window.clearTimeout(timer)
  }, [toast.id, toast.duration, dismiss])

  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className="pointer-events-auto flex w-full animate-fade-up items-start gap-3 rounded-xl border border-line bg-surface p-3.5 pr-2.5 text-fg shadow-overlay sm:w-[360px]"
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', iconStyles[toast.variant])} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{toast.title}</p>
        {toast.description && <p className="mt-0.5 text-[13px] text-muted">{toast.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Fechar notificação"
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

/**
 * Pilha de toasts. Usa a Popover API (top layer) para aparecer inclusive sobre
 * modais abertos; em navegadores sem suporte, cai para posição fixa comum.
 */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const ref = useRef<HTMLDivElement>(null)

  const hasToasts = toasts.length > 0

  // Reabre o popover para trazê-lo ao topo da pilha (acima de modais abertos).
  const raise = useCallback(() => {
    const el = ref.current
    if (!el || typeof el.showPopover !== 'function') return
    try {
      if (el.matches(':popover-open')) el.hidePopover()
      if (useToastStore.getState().toasts.length > 0) el.showPopover()
    } catch {
      /* Popover API indisponível */
    }
  }, [])

  useEffect(() => {
    raise()
  }, [toasts, raise])

  useEffect(() => {
    if (!hasToasts) return
    const onDialogOpen = () => requestAnimationFrame(raise)
    window.addEventListener('vo:dialog-open', onDialogOpen)
    return () => window.removeEventListener('vo:dialog-open', onDialogOpen)
  }, [hasToasts, raise])

  return (
    <div
      ref={ref}
      popover="manual"
      aria-live="polite"
      aria-label="Notificações"
      className={cn(
        'pointer-events-none fixed inset-x-3 top-3 bottom-auto z-[100] m-0 flex w-auto flex-col gap-2 overflow-visible border-0 bg-transparent p-0',
        'sm:inset-x-auto sm:top-auto sm:right-5 sm:bottom-5 sm:items-end',
      )}
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} />
      ))}
    </div>
  )
}
