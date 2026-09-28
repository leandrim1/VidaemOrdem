import { create } from 'zustand'
import type { Credentials, OnboardingAnswers, RegisterInput, User } from '@/types'
import { authService } from '@/services/authService'
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

  signOutLocally() {
    resetUserStores()
    set({ user: null, status: 'unauthenticated' })
  },
}))
