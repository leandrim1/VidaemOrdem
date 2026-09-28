import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, ShieldCheck } from 'lucide-react'
import type { Document } from '@/types'
import type { DocumentInput } from '@/hooks/useDocuments'
import { DOCUMENT_CATEGORIES } from '@/data/categories'
import { documentSchema, type DocumentFormOutput, type DocumentFormValues } from '@/lib/schemas/life'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input, Textarea } from '@/components/ui/Input'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'

interface DocumentFormModalProps {
  open: boolean
  onClose: () => void
  document?: Document | null
  onSubmit: (input: DocumentInput) => Promise<boolean>
}

function DocumentForm({ document, onClose, onSubmit }: Omit<DocumentFormModalProps, 'open'>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DocumentFormValues, unknown, DocumentFormOutput>({
    resolver: zodResolver(documentSchema),
    defaultValues: document
      ? { name: document.name, category: document.category, expiresAt: document.expiresAt ?? '', location: document.location, notes: document.notes ?? '' }
      : { name: '', category: 'pessoais', expiresAt: '', location: '', notes: '' },
  })

  const submit = handleSubmit(async (values) => {
    if (await onSubmit(values)) onClose()
  })

  return (
    <form onSubmit={submit} noValidate>
      <ModalBody className="space-y-4">
        <div className="flex gap-2.5 rounded-xl bg-primary-soft p-3 text-[13px] text-primary-ink">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>Por segurança, guardamos apenas as informações do documento — nunca o arquivo ou números sensíveis.</p>
        </div>
        <FormField label="Nome do documento" error={errors.name?.message} required>
          {({ id, describedBy, invalid }) => <Input id={id} placeholder="Ex.: CNH, contrato de aluguel…" data-autofocus invalid={invalid} aria-describedby={describedBy} {...register('name')} />}
        </FormField>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Categoria" error={errors.category?.message}>
            {({ id, describedBy }) => <Select id={id} options={DOCUMENT_CATEGORIES} aria-describedby={describedBy} {...register('category')} />}
          </FormField>
          <FormField label="Data de validade" error={errors.expiresAt?.message} hint="Deixe em branco se não vence">
            {({ id, describedBy, invalid }) => <Input id={id} type="date" invalid={invalid} aria-describedby={describedBy} {...register('expiresAt')} />}
          </FormField>
        </div>
        <FormField label="Localização" error={errors.location?.message} required hint="Onde está guardado (física ou digitalmente)">
          {({ id, describedBy, invalid }) => <Input id={id} placeholder="Ex.: Pasta azul no armário do quarto" invalid={invalid} aria-describedby={describedBy} {...register('location')} />}
        </FormField>
        <FormField label="Observações" error={errors.notes?.message}>
          {({ id, describedBy, invalid }) => <Textarea id={id} rows={2} placeholder="Opcional" invalid={invalid} aria-describedby={describedBy} {...register('notes')} />}
        </FormField>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {document ? 'Salvar alterações' : 'Adicionar documento'}
        </Button>
      </ModalFooter>
    </form>
  )
}

export function DocumentFormModal({ open, onClose, document, onSubmit }: DocumentFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={document ? 'Editar documento' : 'Adicionar documento'} icon={<FileText />}>
      <DocumentForm document={document} onClose={onClose} onSubmit={onSubmit} />
    </Modal>
  )
}
