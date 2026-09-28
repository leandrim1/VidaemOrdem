import { useState } from 'react'
import { Check, Lock, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useChallenge } from '@/hooks/useChallenge'
import { confirm } from '@/stores/confirmStore'
import { formatDate } from '@/utils/format'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ErrorState, LoadingState } from '@/components/ui/States'
import { CelebrationModal } from '@/components/challenge/CelebrationModal'
import { ChallengeDayCard } from '@/components/challenge/ChallengeDayCard'

export default function ChallengePage() {
  const { challenge, summary, status, error, isLoading, reload, toggle, finishDay, restartChallenge } = useChallenge()
  const [celebration, setCelebration] = useState<{ variant: 'day' | 'challenge'; day: number } | null>(null)

  const complete = async (day: number) => {
    const result = await finishDay(day)
    if (result) setCelebration({ variant: result, day })
  }

  const restart = async () => {
    if (await confirm({ title: 'Reiniciar o desafio?', description: 'Todo o progresso dos 7 dias será apagado. Os pontos já conquistados continuam com você.', confirmLabel: 'Reiniciar', tone: 'primary' })) await restartChallenge()
  }

  const stateOf = (dayNumber: number) => {
    const day = challenge?.days.find((d) => d.day === dayNumber)
    if (day?.completedAt) return 'done' as const
    return dayNumber === summary.currentDay ? ('current' as const) : ('locked' as const)
  }

  return (
    <>
      <PageHeader documentTitle="Desafio 7 dias" title="Desafio 7 dias" description="Um passo a passo guiado para organizar cada área da sua vida em uma semana." />
      {status === 'error' ? (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      ) : isLoading || !challenge ? (
        <LoadingState variant="list" count={5} />
      ) : (
        <div className="grid animate-fade-in grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <section className="relative overflow-hidden rounded-card bg-navy p-6 text-white shadow-card sm:p-8 dark:border dark:border-line dark:bg-surface">
              <div className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-primary/35 blur-3xl" aria-hidden />
              <div className="relative">
                <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-blue-100 uppercase">
                  <Trophy className="size-3.5 text-amber-300" aria-hidden /> Desafio
                </p>
                <h2 className="mt-4 max-w-xl font-display text-2xl font-extrabold sm:text-3xl dark:text-fg">7 Dias para Colocar sua Vida em Ordem</h2>
                <p className="mt-2 text-slate-300 dark:text-muted">{summary.finished ? 'Desafio concluído — parabéns!' : `Dia ${summary.currentDay} de ${summary.totalDays}`}</p>
                <div className="mt-6 max-w-lg">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300 dark:text-muted">
                      {summary.completedDays} de {summary.totalDays} dias concluídos
                    </span>
                    <span className="vo-tabular font-semibold">{Math.round(summary.progress)}%</span>
                  </div>
                  <ProgressBar value={summary.progress} tone="success" size="md" label="Progresso do desafio" className="[&_[role=progressbar]]:bg-white/15" />
                </div>
                <ol className="mt-6 flex flex-wrap gap-2" aria-label="Dias do desafio">
                  {challenge.days.map((day) => {
                    const state = stateOf(day.day)
                    return (
                      <li
                        key={day.day}
                        aria-label={`Dia ${day.day}: ${state === 'done' ? 'concluído' : state === 'current' ? 'em andamento' : 'bloqueado'}`}
                        className={cn(
                          'flex size-10 items-center justify-center rounded-full text-sm font-bold',
                          state === 'done' && 'bg-success text-white',
                          state === 'current' && 'bg-white text-navy ring-4 ring-white/20',
                          state === 'locked' && 'bg-white/10 text-white/50',
                        )}
                      >
                        {state === 'done' ? <Check className="size-4" strokeWidth={3} aria-hidden /> : state === 'locked' ? <Lock className="size-3.5" aria-hidden /> : day.day}
                      </li>
                    )
                  })}
                </ol>
              </div>
            </section>

            {summary.finished && (
              <Card className="border-success/40 text-center">
                <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-warning-soft text-warning-ink">
                  <Trophy className="size-8" aria-hidden />
                </span>
                <h2 className="mt-4 text-xl font-extrabold text-fg">Conquista desbloqueada: Vida em Ordem</h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                  Você concluiu o desafio{challenge.completedAt ? ` em ${formatDate(challenge.completedAt, "d 'de' MMMM")}` : ''}. Repita quando quiser para manter tudo em dia.
                </p>
                <Button variant="outline" className="mt-5" leftIcon={<RotateCcw className="size-4" />} onClick={() => void restart()}>
                  Fazer o desafio novamente
                </Button>
              </Card>
            )}

            <div className="space-y-3">
              {challenge.days.map((day) => (
                <ChallengeDayCard key={`${challenge.startedAt}-${day.day}-${stateOf(day.day)}`} day={day} state={stateOf(day.day)} onToggle={(d, id) => void toggle(d, id)} onComplete={complete} />
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <Card>
              <h2 className="flex items-center gap-2 text-[15px] font-bold text-fg">
                <Sparkles className="size-[18px] text-warning-ink" aria-hidden /> Como funciona
              </h2>
              <ol className="mt-4 space-y-3 text-sm text-fg-soft">
                {['Cada dia tem um tema e um checklist curto.', 'Marque os itens conforme for fazendo.', 'Conclua o dia para desbloquear o próximo.', 'Ganhe +20 pontos por dia e +100 ao terminar.'].map((text, i) => (
                  <li key={text} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary-ink">{i + 1}</span>
                    {text}
                  </li>
                ))}
              </ol>
            </Card>
            {!summary.finished && summary.completedDays > 0 && (
              <Button variant="ghost" fullWidth leftIcon={<RotateCcw className="size-4" />} onClick={() => void restart()}>
                Reiniciar desafio
              </Button>
            )}
          </aside>
        </div>
      )}
      <CelebrationModal
        open={celebration !== null}
        onClose={() => setCelebration(null)}
        variant={celebration?.variant ?? 'day'}
        day={celebration?.day}
        nextTitle={celebration ? challenge?.days.find((d) => d.day === celebration.day + 1)?.title : undefined}
      />
    </>
  )
}
