import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Lock } from 'lucide-react'
import type { MembershipAccess, PlanOption } from '@/types'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useMembership } from '@/hooks/useMembership'
import { PATHS } from '@/routes/paths'
import { formatDate } from '@/utils/format'
import { CheckoutModal } from './CheckoutModal'
import { PlanCards } from './PlanCards'

/**
 * Exibida no lugar das páginas quando o teste (ou a assinatura) termina.
 * Os dados continuam salvos e o usuário pode exportá-los a qualquer momento.
 */
export function Paywall({ access }: { access: MembershipAccess }) {
  useDocumentTitle('Escolha um plano')
  const { subscribe } = useMembership()
  const [selected, setSelected] = useState<PlanOption | null>(null)
  const trial = access.reason === 'trial'

  return (
    <div className="mx-auto max-w-5xl animate-fade-in py-4">
      <div className="mx-auto max-w-2xl text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary-ink">
          <Lock className="size-6" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-fg sm:text-3xl">{trial ? 'Seu teste grátis terminou' : 'Sua assinatura terminou'}</h1>
        <p className="mt-3 text-[15px] text-muted">
          {trial ? `Os 7 dias grátis terminaram em ${formatDate(access.endsAt, "d 'de' MMMM")}.` : `Seu acesso terminou em ${formatDate(access.endsAt, "d 'de' MMMM")}.`} Seus dados continuam
          salvos: escolha um plano para voltar a usar todos os recursos.
        </p>
        <p className="mt-2 text-sm text-muted">Nenhuma cobrança foi feita automaticamente.</p>
      </div>
      <div className="mt-10">
        <PlanCards onSelect={setSelected} compact />
      </div>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-6">
        <Link to={PATHS.settings} className="inline-flex items-center gap-1.5 font-semibold text-primary-ink hover:underline">
          <Download className="size-4" aria-hidden /> Exportar meus dados
        </Link>
        <Link to={PATHS.plan} className="font-semibold text-primary-ink hover:underline">
          Detalhes do plano
        </Link>
      </div>
      <CheckoutModal plan={selected} onClose={() => setSelected(null)} onConfirm={subscribe} />
    </div>
  )
}
