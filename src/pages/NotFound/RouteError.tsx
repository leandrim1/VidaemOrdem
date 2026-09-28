import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { RefreshCw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'

/** Fallback para erros inesperados de renderização ou falha ao baixar um chunk. */
export function RouteError() {
  const error = useRouteError()
  const chunkFailed = error instanceof Error && /dynamically imported module|Loading chunk|Importing a module script failed/i.test(error.message)
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText}`
    : chunkFailed
      ? 'Uma nova versão do Vida em Ordem foi publicada. Recarregue a página para continuar.'
      : 'Ocorreu um erro inesperado. Seus dados estão seguros.'

  return (
    <div role="alert" className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-danger-soft text-danger-ink">
        <TriangleAlert className="size-7" aria-hidden />
      </span>
      <h1 className="mt-6 text-2xl font-extrabold text-fg">Algo não saiu como esperado</h1>
      <p className="mt-2 max-w-md text-muted">{message}</p>
      <div className="mt-8 flex gap-3">
        <Button variant="outline" onClick={() => window.location.assign('/')}>
          Ir para o início
        </Button>
        <Button leftIcon={<RefreshCw className="size-4" />} onClick={() => window.location.reload()}>
          Recarregar
        </Button>
      </div>
    </div>
  )
}
