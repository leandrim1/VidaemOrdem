import { useState } from 'react'
import { CreditCard, Info, ShieldCheck } from 'lucide-react'
import type { BillingPlan, PlanOption } from '@/types'
import { formatCurrency } from '@/utils/format'
import { Button } from '@/components/ui/Button'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'

interface CheckoutModalProps {
  plan: PlanOption | null
  onClose: () => void
  onConfirm: (plan: BillingPlan) => Promise<boolean>
}

/**
 * Resumo da assinatura antes do pagamento. Nesta versão o pagamento é
 * simulado; com o gateway ativo, "Continuar" redireciona para o checkout
 * seguro dele (nenhum dado de cartão é digitado no nosso app).
 */
export function CheckoutModal({ plan, onClose, onConfirm }: CheckoutModalProps) {
  const [loading, setLoading] = useState(false)
  return (
    <Modal open={plan !== null} onClose={onClose} size="sm" title={plan ? `Assinar plano ${plan.name}` : 'Assinar'} description="Confira o resumo antes de confirmar." icon={<CreditCard />}>
      {plan && (
        <>
          <ModalBody className="space-y-4">
            <dl className="divide-y divide-line rounded-xl border border-line text-sm">
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-muted">Plano</dt>
                <dd className="font-semibold text-fg">{plan.name}</dd>
              </div>
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-muted">Renovação</dt>
                <dd className="font-semibold text-fg capitalize">{plan.renewalLabel}</dd>
              </div>
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-muted">Total hoje</dt>
                <dd className="vo-tabular font-display text-lg font-bold text-fg">{formatCurrency(plan.price)}</dd>
              </div>
            </dl>
            <p className="flex gap-2 text-[13px] text-muted">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
              Garantia de 7 dias após a assinatura: não gostou, devolvemos 100%. Cancele quando quiser, sem fidelidade.
            </p>
            <p className="flex gap-2 rounded-xl bg-warning-soft p-3 text-[13px] text-warning-ink">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
              Ambiente de demonstração: nenhum pagamento real é processado. Com o pagamento ativo, você será levado ao checkout seguro do gateway.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Voltar
            </Button>
            <Button
              data-autofocus
              loading={loading}
              onClick={async () => {
                setLoading(true)
                const ok = await onConfirm(plan.id)
                setLoading(false)
                if (ok) onClose()
              }}
            >
              Confirmar assinatura
            </Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}
