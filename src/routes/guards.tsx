import { useEffect, type ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/stores/toastStore'
import { FullPageLoader } from '@/components/layout/FullPageLoader'
import { PATHS } from './paths'

/**
 * Protege rotas autenticadas. Sem sessão válida → /login (guardando a rota
 * de origem para voltar após o login). Contas novas passam pelo onboarding.
 */
export function ProtectedRoute({ children, requireOnboarding = true }: { children?: ReactNode; requireOnboarding?: boolean }) {
  const { user, isChecking } = useAuth()
  const location = useLocation()

  if (isChecking) return <FullPageLoader />
  if (!user) return <Navigate to={PATHS.login} replace state={{ from: location.pathname + location.search }} />
  if (requireOnboarding && !user.onboarding) return <Navigate to={PATHS.onboarding} replace />
  return children ? <>{children}</> : <Outlet />
}

/** Login/cadastro: se já estiver autenticado, vai direto para o painel. */
export function PublicOnlyRoute({ children }: { children?: ReactNode }) {
  const { user, isChecking } = useAuth()
  if (isChecking) return <FullPageLoader />
  if (user) return <Navigate to={user.onboarding ? PATHS.app : PATHS.onboarding} replace />
  return children ? <>{children}</> : <Outlet />
}

/** Área administrativa: exige papel `admin`. */
export function AdminRoute({ children }: { children?: ReactNode }) {
  const { user, isChecking, isAdmin } = useAuth()
  const location = useLocation()
  const denied = Boolean(user) && !isAdmin

  useEffect(() => {
    if (denied) toast.error('Acesso restrito', 'Somente administradores podem acessar esta área.')
  }, [denied])

  if (isChecking) return <FullPageLoader />
  if (!user) return <Navigate to={PATHS.login} replace state={{ from: location.pathname }} />
  if (denied) return <Navigate to={PATHS.app} replace />
  return children ? <>{children}</> : <Outlet />
}
