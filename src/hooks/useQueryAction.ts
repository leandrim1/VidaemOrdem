import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Executa uma ação quando a URL contém `?novo=1` (usado pelo atalho global
 * "Novo" do cabeçalho) e remove o parâmetro em seguida.
 */
export function useQueryAction(action: () => void, param = 'novo') {
  const [params, setParams] = useSearchParams()
  const active = params.get(param) === '1'

  useEffect(() => {
    if (!active) return
    action()
    const next = new URLSearchParams(params)
    next.delete(param)
    setParams(next, { replace: true })
  }, [active, action, param, params, setParams])
}
