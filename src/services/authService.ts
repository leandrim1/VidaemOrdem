import { addDays, addHours } from 'date-fns'
import type { Credentials, OnboardingAnswers, RegisterInput, User } from '@/types'
import { createToken, hashPassword, verifyPassword, type PasswordHash } from '@/lib/crypto'
import { delay } from '@/lib/delay'
import { createId } from '@/lib/id'
import { readJSON, storageKeys, writeJSON } from '@/lib/storage'
import { DEMO_USER_ID, createMockUser } from '@/data/mockUser'
import { ServiceError } from './errors'
import { clearSession, readSession, requireUserId, writeSession } from './session'

/** Os dados de demonstração só são baixados quando necessários (code splitting). */
const loadSeeds = () => import('./seedService')

/**
 * Autenticação mockada (localStorage).
 *
 * Esta é a ÚNICA camada que conhece o mecanismo de autenticação. Para migrar
 * para o Supabase Auth, reimplemente as funções abaixo com
 * `supabase.auth.signInWithPassword`, `signUp`, `signOut`, `getSession` e
 * `resetPasswordForEmail` — stores, hooks e páginas não precisam mudar.
 */
interface StoredAccount {
  user: User
  password?: PasswordHash
}

const SESSION_DAYS = 7
const DEMO_SESSION_HOURS = 12

function readAccounts(): StoredAccount[] {
  return readJSON<StoredAccount[]>(storageKeys.users, [])
}

function writeAccounts(accounts: StoredAccount[]): void {
  if (!writeJSON(storageKeys.users, accounts)) {
    throw new ServiceError('storage', 'Não foi possível salvar seus dados neste navegador.')
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function startSession(userId: string, expiresAt: Date): void {
  writeSession({ userId, token: createToken(), expiresAt: expiresAt.toISOString() })
}

function updateStoredUser(userId: string, patch: Partial<User>): User {
  const accounts = readAccounts()
  const index = accounts.findIndex((a) => a.user.id === userId)
  if (index === -1) throw new ServiceError('not_found', 'Usuário não encontrado.')
  const user = { ...accounts[index].user, ...patch, id: userId }
  accounts[index] = { ...accounts[index], user }
  writeAccounts(accounts)
  return user
}

export const authService = {
  /** Retorna o usuário da sessão atual (ou `null`). */
  async getCurrentUser(): Promise<User | null> {
    const session = readSession()
    if (!session) return null
    const account = readAccounts().find((a) => a.user.id === session.userId)
    if (!account) {
      clearSession()
      return null
    }
    return account.user
  },

  async login({ email, password }: Credentials): Promise<User> {
    await delay(450)
    const account = readAccounts().find((a) => a.user.email === normalizeEmail(email))
    // Mensagem genérica: não revela se o e-mail existe.
    const invalid = new ServiceError('invalid_credentials', 'E-mail ou senha incorretos.')
    if (!account?.password) throw invalid
    const valid = await verifyPassword(password, account.password)
    if (!valid) throw invalid
    startSession(account.user.id, addDays(new Date(), SESSION_DAYS))
    return account.user
  },

  /** Entra com a usuária demo e restaura os dados fictícios a cada acesso. */
  async loginDemo(): Promise<User> {
    await delay(300)
    const demo = createMockUser()
    const accounts = readAccounts().filter((a) => a.user.id !== DEMO_USER_ID)
    writeAccounts([...accounts, { user: demo }])
    const { seedDemoData } = await loadSeeds()
    seedDemoData(demo.id)
    startSession(demo.id, addHours(new Date(), DEMO_SESSION_HOURS))
    return demo
  },

  async register({ name, email, password }: RegisterInput): Promise<User> {
    await delay(500)
    const normalized = normalizeEmail(email)
    const accounts = readAccounts()
    if (accounts.some((a) => a.user.email === normalized)) {
      throw new ServiceError('email_in_use', 'Já existe uma conta com este e-mail.')
    }
    const user: User = {
      id: createId(),
      name: name.trim(),
      email: normalized,
      role: 'user',
      createdAt: new Date().toISOString(),
    }
    writeAccounts([...accounts, { user, password: await hashPassword(password) }])
    const { seedNewUserData } = await loadSeeds()
    seedNewUserData(user.id, user.name.split(' ')[0] ?? user.name)
    startSession(user.id, addDays(new Date(), SESSION_DAYS))
    return user
  },

  async logout(): Promise<void> {
    await delay(100)
    clearSession()
  },

  /**
   * Simula o envio do e-mail de recuperação. Sempre resolve com sucesso para
   * não permitir descobrir quais e-mails têm conta.
   */
  async requestPasswordReset(email: string): Promise<void> {
    await delay(700)
    void normalizeEmail(email)
  },

  async updateProfile(patch: Pick<Partial<User>, 'name' | 'email' | 'avatarUrl'>): Promise<User> {
    await delay(250)
    const userId = requireUserId()
    if (patch.email) {
      const normalized = normalizeEmail(patch.email)
      if (readAccounts().some((a) => a.user.email === normalized && a.user.id !== userId)) {
        throw new ServiceError('email_in_use', 'Este e-mail já está em uso por outra conta.')
      }
      patch = { ...patch, email: normalized }
    }
    return updateStoredUser(userId, patch)
  },

  async saveOnboarding(answers: Omit<OnboardingAnswers, 'completedAt'>): Promise<User> {
    await delay(300)
    return updateStoredUser(requireUserId(), { onboarding: { ...answers, completedAt: new Date().toISOString() } })
  },

  async changePassword(current: string, next: string): Promise<void> {
    await delay(400)
    const userId = requireUserId()
    const accounts = readAccounts()
    const index = accounts.findIndex((a) => a.user.id === userId)
    const account = accounts[index]
    if (!account) throw new ServiceError('not_found', 'Usuário não encontrado.')
    if (account.user.isDemo) throw new ServiceError('forbidden', 'A conta de demonstração não permite alterar a senha.')
    if (!account.password || !(await verifyPassword(current, account.password))) {
      throw new ServiceError('invalid_credentials', 'A senha atual está incorreta.')
    }
    accounts[index] = { ...account, password: await hashPassword(next) }
    writeAccounts(accounts)
  },

  /** Restaura os dados fictícios (demo) ou carrega exemplos para a conta atual. */
  async loadSampleData(): Promise<void> {
    await delay(400)
    const { seedDemoData } = await loadSeeds()
    seedDemoData(requireUserId())
  },

  async clearData(): Promise<void> {
    await delay(300)
    const userId = requireUserId()
    const user = readAccounts().find((a) => a.user.id === userId)?.user
    const { clearUserData, seedNewUserData } = await loadSeeds()
    clearUserData(userId)
    seedNewUserData(userId, user?.name.split(' ')[0] ?? '')
  },

  async deleteAccount(): Promise<void> {
    await delay(400)
    const userId = requireUserId()
    const { clearUserData } = await loadSeeds()
    clearUserData(userId)
    writeAccounts(readAccounts().filter((a) => a.user.id !== userId))
    clearSession()
  },
}
