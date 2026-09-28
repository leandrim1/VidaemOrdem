import { useState, type FormEvent } from 'react'
import { Plus, RotateCcw, X } from 'lucide-react'
import type { Checklist } from '@/types'
import { cn } from '@/lib/cn'
import { checklistProgress } from '@/hooks/useChecklists'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Input } from '@/components/ui/Input'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { CHECKLIST_ICONS } from './icons'

interface ChecklistDetailModalProps {
  checklist: Checklist | null
  onClose: () => void
  onToggle: (checklistId: string, itemId: string) => void
  onAddItem: (checklistId: string, label: string) => Promise<boolean>
  onRemoveItem: (checklistId: string, itemId: string) => void
  onReset: (checklistId: string) => void
}

export function ChecklistDetailModal({ checklist, onClose, onToggle, onAddItem, onRemoveItem, onReset }: ChecklistDetailModalProps) {
  const [label, setLabel] = useState('')
  const Icon = checklist ? CHECKLIST_ICONS[checklist.icon] : null
  const progress = checklist ? checklistProgress(checklist) : null

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!checklist || !label.trim()) return
    if (await onAddItem(checklist.id, label.trim())) setLabel('')
  }

  return (
    <Modal open={checklist !== null} onClose={onClose} size="lg" title={checklist?.title ?? ''} description={checklist?.description} icon={Icon ? <Icon /> : undefined}>
      {checklist && progress && (
        <>
          <ModalBody className="space-y-5">
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <p className="vo-tabular text-sm font-semibold text-fg">
                  {progress.done}/{progress.total} concluídos
                </p>
                <p className="vo-tabular text-sm text-muted">{Math.round(progress.percent)}%</p>
              </div>
              <ProgressBar value={progress.percent} tone={progress.complete ? 'success' : 'primary'} size="md" label="Progresso do checklist" animate={false} />
              {progress.complete && <p className="mt-2 text-sm font-medium text-success-ink">Checklist concluído! +20 pontos para você. 🎉</p>}
            </div>
            <ul className="divide-y divide-line rounded-xl border border-line">
              {checklist.items.map((item) => (
                <li key={item.id} className="group flex items-center gap-2 pr-2">
                  <Checkbox
                    checked={item.done}
                    onChange={() => onToggle(checklist.id, item.id)}
                    label={<span className={cn('transition-colors', item.done && 'text-muted line-through decoration-line-strong')}>{item.label}</span>}
                    tone="success"
                    className="flex-1 px-3.5 py-3"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveItem(checklist.id, item.id)}
                    aria-label={`Remover item: ${item.label}`}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-subtle opacity-100 transition-opacity hover:bg-danger-soft hover:text-danger-ink sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
                  >
                    <X className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={submit} className="flex gap-2">
              <label htmlFor="new-checklist-item" className="sr-only">
                Novo item
              </label>
              <Input id="new-checklist-item" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Adicionar um item personalizado…" maxLength={100} leftIcon={<Plus />} />
              <Button type="submit" variant="soft" disabled={!label.trim()}>
                Adicionar
              </Button>
            </form>
          </ModalBody>
          <ModalFooter className="sm:justify-between">
            <Button variant="ghost" leftIcon={<RotateCcw className="size-4" />} onClick={() => onReset(checklist.id)} disabled={progress.done === 0}>
              Desmarcar todos
            </Button>
            <Button onClick={onClose}>Concluir</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}
