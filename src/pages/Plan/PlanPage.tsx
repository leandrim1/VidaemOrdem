import { useState } from 'react'
import { CalendarClock, CircleCheck, Clock, CreditCard, Lock, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
import type { PlanOption } from '@/types'
import { getPlan, TRIAL_DAYS } from '@/data/plans'
import { useMembership } from '@/hooks/useMembership'
import { confirm } from '@/stores/confirmStore'
import { formatCurrency, formatDate } from '@/utils/format'
import { formatDaysLeft } from '@/utils/membership'
import { Accordion } from '@/components/ui/Accordion'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { CheckoutModal } from '@/components/billing/CheckoutModal'
import { PlanCards } from '@/components/billing/PlanCards'

const FAQ = [
  {
    question: 'Serei cobrado automaticamente quando o teste acabar?',
    answer: 'Não. O teste grátis não pede cartão e nada é cobrado automaticamente. Ao fim dos 7 dias, você escolhe se quer assinar um plano.',
  },
  {
    question: 'O que acontece com meus dados se eu não assinar?',
    answer: 'Eles continuam guardados. O acesso aos módulos fica pausado até você escolher um plano, mas perfil, configurações e a exportação dos dados continuam disponíveis.',
  },
  {
    question: 'Posso cancelar a assinatura?',
    answer: 'Sim, a qualquer momento e sem fidelidade. Você mantém o acesso até o fim do período já pago. Nos primeiros 7 dias após assinar, devolvemos 100% do valor.',
  },
]

export default function PlanPage() {
  const { access, membership, subscribe, cancel, resume } = useMembership()
  const [selected, setSelected] = useState<PlanOption | null>(null)
  if (!access || !membership) return null

  const plan = access.plan ? getPlan(access.plan) : null
  const trialUsed = Math.min(TRIAL_DAYS, TRIAL_DAYS - access.daysLeft)

  const handleCancel = async () => {
    if (!plan) return
    const ok = await confirm({
      title: 'Cancelar assinatura?',
      description: `Você continua com acesso até ${formatDate(access.endsAt, "d 'de' MMMM")} e não será cobrado novamente.`,
      confirmLabel: 'Cancelar assinatura',
      cancelLabel: 'Manter plano',
    })
    if (ok) await cancel()
  }

  return (
    <>
      <PageHeader title="Meu plano" description="Acompanhe seu teste grátis, assinatura e cobranças." />
      <div className="space-y-6">
        <Card className="flex flex-col gap-5 md:flex-row md:items-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-ink">
            {access.state === 'trial' ? <Sparkles className="size-6" aria-hidden /> : access.state === 'active' ? <CircleCheck className="size-6" aria-hidden /> : <Lock className="size-6" aria-hidden />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-fg">{access.state === 'trial' ? 'Teste grátis' : plan ? `Plano ${plan.name}` : 'Sem plano ativo'}</h2>
              {access.state === 'trial' && (
                <Badge tone={access.daysLeft <= 3 ? 'warning' : 'primary'} icon={<Clock />}>
                  {access.daysLeft <= 0 ? 'Termina hoje' : `${formatDaysLeft(access.daysLeft)} restantes`}
                </Badge>
              )}
              {access.state === 'active' && !access.cancelAtPeriodEnd && <Badge tone="success">Ativo</Badge>}
              {access.state === 'active' && access.cancelAtPeriodEnd && <Badge tone="warning">Cancelado</Badge>}
              {access.state === 'expired' && <Badge tone="danger">Encerrado</Badge>}
            </div>

            {access.state === 'trial' && (
              <>
                <p className="mt-1 text-sm text-muted">
                  Termina em {formatDate(access.endsAt, "d 'de' MMMM 'às' HH:mm")}. Sem cartão e sem cobrança automática — ao final, você escolhe se quer assinar.
                </p>
                <ProgressBar value={(trialUsed / TRIAL_DAYS) * 100} tone={access.daysLeft <= 3 ? 'warning' : 'primary'} size="md" label="Dias usados do teste grátis" className="mt-4 max-w-md" />
                <p className="mt-1.5 text-xs text-muted">
                  Dia {Math.max(1, trialUsed)} de {TRIAL_DAYS}
                </p>
              </>
            )}

            {access.state === 'active' && plan && (
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <CreditCard className="size-4" aria-hidden /> {formatCurrency(plan.price)} {plan.renewalLabel}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="size-4" aria-hidden />
                  {access.cancelAtPeriodEnd ? `Acesso até ${formatDate(access.endsAt, "d 'de' MMMM")}` : `Próxima cobrança em ${formatDate(access.endsAt, "d 'de' MMMM")}`}
                </span>
              </p>
            )}

            {access.state === 'expired' && (
              <p className="mt-1 text-sm text-muted">
                {access.reason === 'trial' ? 'Seu teste grátis terminou' : 'Sua assinatura terminou'} em {formatDate(access.endsAt, "d 'de' MMMM")}. Seus dados continuam salvos — escolha um plano para voltar.
              </p>
            )}
          </div>

          {access.state === 'active' && (
            <div className="shrink-0">
              {access.cancelAtPeriodEnd ? (
                <Button leftIcon={<RotateCcw className="size-4" />} onClick={() => void resume()}>
                  Reativar assinatura
                </Button>
              ) : (
                <Button variant="outline" onClick={() => void handleCancel()}>
                  Cancelar assinatura
                </Button>
              )}
            </div>
          )}
        </Card>

        <section aria-labelledby="planos-title">
          <h2 id="planos-title" className="mb-4 text-lg font-bold text-fg">
            {access.state === 'active' ? 'Trocar de plano' : 'Escolha seu plano'}
          </h2>
          <PlanCards currentPlan={access.state === 'active' ? access.plan : null} onSelect={setSelected} />
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-muted">
            <ShieldCheck className="size-4 shrink-0 text-success" aria-hidden />
            Garantia de 7 dias após a assinatura: não gostou, devolvemos 100%.
          </p>
        </section>

        <section aria-labelledby="plano-faq" className="max-w-3xl">
          <h2 id="plano-faq" className="mb-3 text-lg font-bold text-fg">
            Dúvidas sobre cobrança
          </h2>
          <Accordion items={FAQ} />
        </section>
      </div>
      <CheckoutModal plan={selected} onClose={() => setSelected(null)} onConfirm={subscribe} />
    </>
  )
}
