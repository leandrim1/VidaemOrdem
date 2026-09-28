import { useShallow } from 'zustand/react/shallow'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const state = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      status: s.status,
      login: s.login,
      loginDemo: s.loginDemo,
      register: s.register,
      logout: s.logout,
      updateProfile: s.updateProfile,
      completeOnboarding: s.completeOnboarding,
      refreshData: s.refreshData,
    })),
  )
  return {
    ...state,
    isAuthenticated: state.status === 'authenticated',
    isAdmin: state.user?.role === 'admin',
    isChecking: state.status === 'idle' || state.status === 'checking',
  }
}

/** Usuário autenticado — usar apenas dentro de rotas protegidas. */
export function useCurrentUser() {
  const user = useAuthStore((s) => s.user)
  if (!user) throw new Error('useCurrentUser deve ser usado dentro de uma rota protegida.')
  return user
}
