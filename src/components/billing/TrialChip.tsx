import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useMembership } from '@/hooks/useMembership'
import { PATHS } from '@/routes/paths'
import { formatDaysLeft } from '@/utils/membership'

/** Contagem regressiva do teste grátis no cabeçalho. */
export function TrialChip() {
  const { access } = useMembership()
  if (!access || access.state !== 'trial') return null
  const urgent = access.daysLeft <= 3
  return (
    <Link
      to={PATHS.plan}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors',
        urgent ? 'border-warning/30 bg-warning-soft text-warning-ink hover:border-warning/60' : 'border-line bg-surface text-fg-soft hover:border-line-strong hover:text-fg',
      )}
    >
      <Clock className="size-3.5" aria-hidden />
      Teste grátis · {access.daysLeft <= 0 ? 'termina hoje' : `${formatDaysLeft(access.daysLeft)} restantes`}
    </Link>
  )
}
