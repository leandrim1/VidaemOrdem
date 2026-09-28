import type { ReactNode } from 'react'
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import { Dropdown, type DropdownItem } from './Dropdown'

interface RowActionsProps {
  label: string
  onEdit?: () => void
  onDelete?: () => void
  extra?: Array<{ label: string; icon?: ReactNode; onSelect: () => void }>
}

/** Menu "⋮" padrão para ações de uma linha/card. */
export function RowActions({ label, onEdit, onDelete, extra = [] }: RowActionsProps) {
  const items: DropdownItem[] = [
    ...extra,
    ...(onEdit ? [{ label: 'Editar', icon: <Pencil />, onSelect: onEdit }] : []),
    ...(onDelete ? [{ label: 'Excluir', icon: <Trash2 />, onSelect: onDelete, tone: 'danger' as const }] : []),
  ]
  return (
    <Dropdown
      label={`Ações: ${label}`}
      items={items}
      trigger={(props) => (
        <button
          {...props}
          type="button"
          aria-label={`Ações para ${label}`}
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <EllipsisVertical className="size-4" />
        </button>
      )}
    />
  )
}
