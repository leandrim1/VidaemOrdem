import { LogoMark } from '@/components/ui/Logo'

export function FullPageLoader({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas">
      <LogoMark className="size-11 animate-pulse" />
      <span className="text-sm font-medium text-muted">{label}</span>
    </div>
  )
}
