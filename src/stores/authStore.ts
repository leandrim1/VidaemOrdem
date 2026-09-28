import { create } from 'zustand'
import type { Credentials, OnboardingAnswers, RegisterInput, User } from '@/types'
import { authService } from '@/services/authService'
import { setUnauthenticatedHandler } from '@/services/session'
import { storageKeys } from '@/lib/storage'
import { resetUserStores } from './registry'

export type AuthStatus = 'idle' | 'checking' | 'authenticated' | 'unauthenticated'

interface AuthState {
  user: User | null
  status: AuthStatus
  init: () => Promise<void>
  login: (credentials: Credentials) => Promise<User>
  loginDemo: () => Promise<User>
  register: (input: RegisterInput) => Promise<User>
  logout: () => Promise<void>
  updateProfile: (patch: Pick<Partial<User>, 'name' | 'email' | 'avatarUrl'>) => Promise<User>
  completeOnboarding: (answers: Omit<OnboardingAnswers, 'completedAt'>) => Promise<User>
  /** Recarrega os dados do usuário após operações que substituem dados (ex.: restaurar demo). */
  refreshData: () => void
  /** Atualiza o usuário após operações de outros serviços (ex.: assinatura). */
  setUser: (user: User) => void
  signOutLocally: () => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: 'idle',

  async init() {
    if (get().status !== 'idle') return
    set({ status: 'checking' })
    const user = await authService.getCurrentUser()
    set({ user, status: user ? 'authenticated' : 'unauthenticated' })
  },

  async login(credentials) {
    const user = await authService.login(credentials)
    resetUserStores()
    set({ user, status: 'authenticated' })
    return user
  },

  async loginDemo() {
    const user = await authService.loginDemo()
    resetUserStores()
    set({ user, status: 'authenticated' })
    return user
  },

  async register(input) {
    const user = await authService.register(input)
    resetUserStores()
    set({ user, status: 'authenticated' })
    return user
  },

  async logout() {
    await authService.logout()
    get().signOutLocally()
  },

  async updateProfile(patch) {
    const user = await authService.updateProfile(patch)
    set({ user })
    return user
  },

  async completeOnboarding(answers) {
    const user = await authService.saveOnboarding(answers)
    set({ user })
    return user
  },

  refreshData() {
    resetUserStores()
  },

  setUser(user) {
    set({ user })
  },

  signOutLocally() {
    resetUserStores()
    set({ user: null, status: 'unauthenticated' })
  },
}))

// Sessão expirada durante o uso → volta para o login (as rotas protegidas redirecionam).
setUnauthenticatedHandler(() => {
  if (useAuthStore.getState().user) useAuthStore.getState().signOutLocally()
})

// Logout ou login em outra aba do mesmo navegador mantém esta aba sincronizada.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKeys.session) return
    const { user } = useAuthStore.getState()
    if (!event.newValue && user) useAuthStore.getState().signOutLocally()
    else if (event.newValue) {
      resetUserStores()
      useAuthStore.setState({ status: 'idle' })
      void useAuthStore.getState().init()
    }
  })
}
