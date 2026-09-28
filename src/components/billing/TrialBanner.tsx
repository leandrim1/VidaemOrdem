import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, X } from 'lucide-react'
import { useMembership } from '@/hooks/useMembership'
import { PATHS } from '@/routes/paths'
import { buttonClasses } from '@/components/ui/Button'
import { formatDaysLeft } from '@/utils/membership'

const DISMISS_KEY = 'vo:trial-banner-dismissed'

function readDismissed(): string | null {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY)
  } catch {
    return null
  }
}

/** Aviso nos últimos 3 dias do teste (ou de uma assinatura cancelada). */
export function TrialBanner() {
  const { access } = useMembership()
  const [dismissed, setDismissed] = useState(readDismissed)

  if (!access) return null
  const trialEnding = access.state === 'trial' && access.daysLeft <= 3
  const canceledEnding = access.state === 'active' && access.cancelAtPeriodEnd && access.daysLeft <= 3
  if (!trialEnding && !canceledEnding) return null
  const key = `${access.state}:${access.endsAt}`
  if (dismissed === key) return null

  const when = access.daysLeft <= 0 ? 'hoje' : `em ${formatDaysLeft(access.daysLeft)}`
  return (
    <div role="status" className="mb-6 flex flex-col gap-3 rounded-card border border-warning/30 bg-warning-soft p-4 sm:flex-row sm:items-center">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-surface text-warning-ink">
        <Clock className="size-[18px]" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 text-sm">
        <p className="font-semibold text-fg">{trialEnding ? `Seu teste grátis termina ${when}.` : `Sua assinatura termina ${when}.`}</p>
        <p className="mt-0.5 text-fg-soft">
          {trialEnding
            ? 'Nada será cobrado automaticamente. Escolha um plano para continuar usando todos os recursos.'
            : 'Reative quando quiser para não perder o acesso.'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Link to={PATHS.plan} className={buttonClasses('primary', 'sm')}>
          {trialEnding ? 'Ver planos' : 'Reativar'}
        </Link>
        <button
          type="button"
          onClick={() => {
            setDismissed(key)
            try {
              window.sessionStorage.setItem(DISMISS_KEY, key)
            } catch {
              /* armazenamento indisponível */
            }
          }}
          aria-label="Dispensar aviso"
          className="flex size-8 items-center justify-center rounded-lg text-warning-ink hover:bg-surface"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  )
}
