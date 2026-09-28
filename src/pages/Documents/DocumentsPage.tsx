import { useCallback, useMemo, useState } from 'react'
import { CircleAlert, Clock, FileText, Lock, MapPin, Plus, ShieldCheck } from 'lucide-react'
import type { Document, DocumentCategory } from '@/types'
import { DOCUMENT_CATEGORIES, documentCategoryLabel } from '@/data/categories'
import { cn } from '@/lib/cn'
import { useEditor } from '@/hooks/useDisclosure'
import { expiryState, useDocuments } from '@/hooks/useDocuments'
import { useQueryAction } from '@/hooks/useQueryAction'
import { confirm } from '@/stores/confirmStore'
import { daysUntil } from '@/utils/date'
import { formatDate } from '@/utils/format'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { RowActions } from '@/components/ui/RowActions'
import { SearchInput } from '@/components/ui/SearchInput'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States'
import { DocumentFormModal } from '@/components/documents/DocumentFormModal'
import { DOCUMENT_ICONS } from '@/components/documents/icons'

function ExpiryBadge({ doc }: { doc: Document }) {
  const state = expiryState(doc)
  if (state === 'none') return <Badge tone="neutral">Sem validade</Badge>
  const days = daysUntil(doc.expiresAt as string)
  if (state === 'expired') return <Badge tone="danger" icon={<CircleAlert />}>Vencido há {Math.abs(days)} dia{Math.abs(days) === 1 ? '' : 's'}</Badge>
  if (state === 'soon') return <Badge tone="warning" icon={<Clock />}>Vence em {days} dia{days === 1 ? '' : 's'}</Badge>
  return <Badge tone="success" icon={<ShieldCheck />}>Válido até {formatDate(doc.expiresAt as string, 'MM/yyyy')}</Badge>
}

export default function DocumentsPage() {
  const { documents, attention, status, error, isLoading, reload, addDocument, updateDocument, deleteDocument } = useDocuments()
  const editor = useEditor<Document>()
  useQueryAction(editor.openNew)
  const [category, setCategory] = useState<DocumentCategory | 'all'>('all')
  const [query, setQuery] = useState('')

  const counts = useMemo(() => {
    const map = new Map<string, number>()
    documents.forEach((d) => map.set(d.category, (map.get(d.category) ?? 0) + 1))
    return map
  }, [documents])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return documents.filter((d) => (category === 'all' || d.category === category) && (!q || d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q)))
  }, [documents, category, query])

  const handleDelete = useCallback(
    async (doc: Document) => {
      if (await confirm({ title: 'Tem certeza?', description: `As informações de "${doc.name}" serão excluídas.`, confirmLabel: 'Excluir' })) await deleteDocument(doc.id)
    },
    [deleteDocument],
  )

  return (
    <>
      <PageHeader
        title="Documentos"
        description="Saiba onde está cada documento importante e quando ele vence."
        actions={
          <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
            Adicionar documento
          </Button>
        }
      />

      <div className="mb-5 flex items-start gap-3 rounded-card border border-line bg-surface p-4 shadow-card">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-success-soft text-success-ink">
          <Lock className="size-[18px]" aria-hidden />
        </span>
        <div className="text-sm">
          <p className="font-semibold text-fg">Seus documentos, sem riscos</p>
          <p className="mt-0.5 text-muted">Nesta versão registramos apenas metadados (nome, validade e localização). Nenhum arquivo ou número sensível é enviado ou armazenado.</p>
        </div>
      </div>

      {status === 'error' ? (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      ) : isLoading ? (
        <LoadingState variant="cards" count={6} />
      ) : (
        <div className="animate-fade-in space-y-5">
          {attention.length > 0 && (
            <Card className="border-warning/40">
              <h2 className="flex items-center gap-2 text-[15px] font-bold text-fg">
                <CircleAlert className="size-[18px] text-warning-ink" aria-hidden />
                Precisam de atenção
              </h2>
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {attention.map((doc) => (
                  <li key={doc.id}>
                    <button type="button" onClick={() => editor.openEdit(doc)} className="flex w-full items-center justify-between gap-3 rounded-xl bg-surface-2/70 p-3 text-left hover:bg-surface-3">
                      <span className="truncate text-sm font-semibold text-fg">{doc.name}</span>
                      <ExpiryBadge doc={doc} />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="vo-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filtrar por categoria">
              {[{ value: 'all' as const, label: 'Todos' }, ...DOCUMENT_CATEGORIES].map((item) => {
                const selected = category === item.value
                const count = item.value === 'all' ? documents.length : (counts.get(item.value) ?? 0)
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCategory(item.value)}
                    aria-pressed={selected}
                    className={cn(
                      'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold transition-colors',
                      selected ? 'border-primary bg-primary text-white' : 'border-line bg-surface text-fg-soft hover:border-line-strong hover:text-fg',
                    )}
                  >
                    {item.label}
                    <span className={cn('vo-tabular text-xs', selected ? 'text-white/80' : 'text-muted')}>{count}</span>
                  </button>
                )
              })}
            </div>
            <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nome ou local…" className="lg:w-72" />
          </div>

          {visible.length === 0 ? (
            <Card>
              <EmptyState
                icon={<FileText />}
                title={documents.length === 0 ? 'Nenhum documento cadastrado' : 'Nada encontrado'}
                description={documents.length === 0 ? 'Registre onde estão seus documentos e acompanhe as datas de validade.' : 'Tente outra categoria ou termo de busca.'}
                action={
                  documents.length === 0 && (
                    <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
                      Adicionar documento
                    </Button>
                  )
                }
              />
            </Card>
          ) : (
            <ul className="vo-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((doc) => {
                const Icon = DOCUMENT_ICONS[doc.category]
                return (
                  <li key={doc.id}>
                    <Card interactive className="flex h-full flex-col" padding="sm">
                      <div className="flex items-start gap-3 p-1">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-ink">
                          <Icon className="size-[18px]" aria-hidden />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h2 className="truncate text-[15px] font-bold text-fg">{doc.name}</h2>
                          <p className="text-[13px] text-muted">{documentCategoryLabel(doc.category)}</p>
                        </div>
                        <RowActions label={doc.name} onEdit={() => editor.openEdit(doc)} onDelete={() => void handleDelete(doc)} />
                      </div>
                      <div className="mt-3 space-y-2 px-1 pb-1">
                        <ExpiryBadge doc={doc} />
                        <p className="flex items-start gap-1.5 text-[13px] text-fg-soft">
                          <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted" aria-hidden />
                          {doc.location}
                        </p>
                        {doc.notes && <p className="text-[13px] text-muted">{doc.notes}</p>}
                      </div>
                    </Card>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
      <DocumentFormModal open={editor.isOpen} onClose={editor.close} document={editor.editing} onSubmit={(input) => (editor.editing ? updateDocument(editor.editing.id, input) : addDocument(input))} />
    </>
  )
}
