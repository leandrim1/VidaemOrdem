import { Link } from 'react-router-dom'
import { ArrowRight, Trophy } from 'lucide-react'
import { PATHS } from '@/routes/paths'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface ChallengeBannerProps {
  currentDay: number
  totalDays: number
  progress: number
  title?: string
}

export function ChallengeBanner({ currentDay, totalDays, progress, title }: ChallengeBannerProps) {
  return (
    <Link
      to={PATHS.challenge}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-card bg-navy p-5 text-white shadow-card sm:flex-row sm:items-center sm:p-6 dark:border dark:border-line dark:bg-surface"
    >
      <div className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-primary/30 blur-3xl" aria-hidden />
      <span className="relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-amber-300">
        <Trophy className="size-6" aria-hidden />
      </span>
      <div className="relative min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-wider text-blue-200 uppercase">Desafio 7 dias · Dia {currentDay} de {totalDays}</p>
        <p className="mt-1 truncate font-display text-lg font-bold">{title ?? 'Continue seu desafio'}</p>
        <ProgressBar value={progress} size="sm" label="Progresso do desafio" className="mt-3 max-w-md [&_[role=progressbar]]:bg-white/15" />
      </div>
      <span className="relative inline-flex items-center gap-1.5 self-start rounded-[10px] bg-white px-4 py-2 text-sm font-semibold text-navy transition-transform group-hover:translate-x-0.5 sm:self-center">
        Continuar <ArrowRight className="size-4" aria-hidden />
      </span>
    </Link>
  )
}
