import { useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import { useConfirmStore } from '@/stores/confirmStore'
import { Button } from './Button'
import { Modal, ModalBody, ModalFooter } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'primary'
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false)
  return (
    <Modal open={open} onClose={onCancel} title={title} size="sm" bare>
      <ModalBody className="pt-6">
        <div className="flex gap-4">
          <span
            className={
              tone === 'danger'
                ? 'flex size-11 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger-ink'
                : 'flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-ink'
            }
          >
            <TriangleAlert className="size-5" aria-hidden />
          </span>
          <div>
            <p className="font-display text-lg font-bold text-fg" aria-hidden>
              {title}
            </p>
            {description && <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>}
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="border-t-0 pt-0">
        <Button variant="outline" onClick={onCancel} disabled={busy} data-autofocus>
          {cancelLabel}
        </Button>
        <Button
          variant={tone === 'danger' ? 'danger' : 'primary'}
          loading={busy}
          onClick={async () => {
            setBusy(true)
            try {
              await onConfirm()
            } finally {
              setBusy(false)
            }
          }}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

/** Renderiza o diálogo de confirmação global (`await confirm({...})`). */
export function ConfirmHost() {
  const request = useConfirmStore((s) => s.request)
  const settle = useConfirmStore((s) => s.settle)
  return (
    <ConfirmDialog
      open={request !== null}
      title={request?.title ?? ''}
      description={request?.description}
      confirmLabel={request?.confirmLabel}
      cancelLabel={request?.cancelLabel}
      tone={request?.tone}
      onConfirm={() => settle(true)}
      onCancel={() => settle(false)}
    />
  )
}
