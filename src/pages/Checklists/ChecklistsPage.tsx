import { useMemo, useState } from 'react'
import { ClipboardCheck } from 'lucide-react'
import { checklistProgress, useChecklists } from '@/hooks/useChecklists'
import { confirm } from '@/stores/confirmStore'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ErrorState, LoadingState } from '@/components/ui/States'
import { ChecklistCard } from '@/components/checklists/ChecklistCard'
import { ChecklistDetailModal } from '@/components/checklists/ChecklistDetailModal'

export default function ChecklistsPage() {
  const { checklists, status, error, isLoading, reload, toggle, addItem, removeItem, resetChecklist } = useChecklists()
  const [openId, setOpenId] = useState<string | null>(null)
  const open = checklists.find((c) => c.id === openId) ?? null

  const overall = useMemo(() => {
    const items = checklists.flatMap((c) => c.items)
    const done = items.filter((i) => i.done).length
    return { done, total: items.length, completed: checklists.filter((c) => checklistProgress(c).complete).length }
  }, [checklists])

  return (
    <>
      <PageHeader title="Checklists" description="Biblioteca de checklists prontos para as principais áreas da sua vida." />
      {status === 'error' ? (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      ) : isLoading ? (
        <LoadingState variant="cards" count={6} />
      ) : (
        <div className="animate-fade-in space-y-5">
          <Card className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-ink">
              <ClipboardCheck className="size-6" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-fg">
                {overall.done} de {overall.total} itens concluídos · {overall.completed} de {checklists.length} checklists completos
              </p>
              <ProgressBar value={overall.total ? (overall.done / overall.total) * 100 : 0} size="sm" label="Progresso geral dos checklists" className="mt-2.5" />
            </div>
          </Card>
          <div className="vo-stagger grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {checklists.map((checklist) => (
              <ChecklistCard key={checklist.id} checklist={checklist} onOpen={(c) => setOpenId(c.id)} />
            ))}
          </div>
        </div>
      )}
      <ChecklistDetailModal
        checklist={open}
        onClose={() => setOpenId(null)}
        onToggle={(checklistId, itemId) => void toggle(checklistId, itemId)}
        onAddItem={addItem}
        onRemoveItem={(checklistId, itemId) => void removeItem(checklistId, itemId)}
        onReset={async (checklistId) => {
          if (await confirm({ title: 'Desmarcar todos os itens?', description: 'O progresso deste checklist será reiniciado.', confirmLabel: 'Desmarcar', tone: 'primary' })) await resetChecklist(checklistId)
        }}
      />
    </>
  )
}
