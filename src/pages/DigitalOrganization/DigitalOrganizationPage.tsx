import { Camera, CircleCheck, FolderOpen, Laptop, Mail, RotateCcw, Smartphone, type LucideIcon } from 'lucide-react'
import type { DigitalArea } from '@/types'
import { cn } from '@/lib/cn'
import { useDigitalOrganization } from '@/hooks/useDigitalOrganization'
import { confirm } from '@/stores/confirmStore'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Checkbox } from '@/components/ui/Checkbox'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { ErrorState, LoadingState } from '@/components/ui/States'

const AREA_ICONS: Record<DigitalArea, LucideIcon> = {
  celular: Smartphone,
  computador: Laptop,
  email: Mail,
  arquivos: FolderOpen,
  fotos: Camera,
}

export default function DigitalOrganizationPage() {
  const { areas, done, total, progress, status, error, isLoading, reload, toggleItem, reset } = useDigitalOrganization()

  const handleReset = async () => {
    if (await confirm({ title: 'Reiniciar progresso?', description: 'Todos os itens serão desmarcados. Útil para refazer a organização periodicamente.', confirmLabel: 'Reiniciar', tone: 'primary' })) await reset()
  }

  return (
    <>
      <PageHeader
        title="Organização digital"
        description="Menos bagunça digital, mais foco: celular, computador, e-mail, arquivos e fotos."
        actions={
          <Button variant="outline" leftIcon={<RotateCcw className="size-4" />} onClick={() => void handleReset()} disabled={done === 0}>
            Reiniciar
          </Button>
        }
      />
      {status === 'error' ? (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      ) : isLoading ? (
        <LoadingState variant="cards" count={5} />
      ) : (
        <div className="animate-fade-in space-y-5">
          <Card className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <ProgressRing value={progress} size={120} stroke={11} label="Progresso geral da organização digital" tone={progress === 100 ? 'success' : 'primary'}>
              <span className="font-display text-2xl font-extrabold text-fg">{progress}%</span>
              <span className="text-[11px] text-muted">concluído</span>
            </ProgressRing>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-fg">{progress === 100 ? 'Vida digital em ordem! 🎉' : 'Progresso geral'}</h2>
              <p className="mt-1 text-sm text-muted">
                {done} de {total} itens concluídos. Marque cada item conforme for organizando.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {areas.map((area) => {
                  const Icon = AREA_ICONS[area.value]
                  return (
                    <li key={area.value} className="rounded-xl bg-surface-2/70 p-2.5">
                      <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
                        <Icon className="size-3.5" aria-hidden />
                        {area.label}
                      </p>
                      <p className="vo-tabular mt-1 text-sm font-bold text-fg">
                        {area.done}/{area.total}
                      </p>
                    </li>
                  )
                })}
              </ul>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {areas.map((area) => {
              const Icon = AREA_ICONS[area.value]
              const complete = area.total > 0 && area.done === area.total
              return (
                <Card as="section" key={area.value} aria-labelledby={`area-${area.value}`} className="flex flex-col">
                  <div className="flex items-start gap-3">
                    <span className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', complete ? 'bg-success text-white' : 'bg-primary-soft text-primary-ink')}>
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 id={`area-${area.value}`} className="text-base font-bold text-fg">
                        {area.label}
                      </h2>
                      <p className="text-[13px] text-muted">{area.description}</p>
                    </div>
                    {complete && (
                      <Badge tone="success" icon={<CircleCheck />}>
                        Concluído
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <ProgressBar value={area.progress} tone={complete ? 'success' : 'primary'} size="sm" label={`Progresso: ${area.label}`} className="flex-1" />
                    <span className="vo-tabular text-xs font-semibold text-fg-soft">
                      {area.done}/{area.total}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-1">
                    {area.items.map((item) => (
                      <li key={item.id}>
                        <Checkbox
                          checked={item.done}
                          onChange={() => void toggleItem(item.id, area.value)}
                          label={<span className={cn(item.done && 'text-muted line-through decoration-line-strong')}>{item.label}</span>}
                          tone="success"
                          className="rounded-lg px-2 py-2 hover:bg-surface-2/70"
                        />
                      </li>
                    ))}
                  </ul>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
