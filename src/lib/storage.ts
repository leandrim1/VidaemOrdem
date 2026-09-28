/**
 * Acesso seguro ao localStorage.
 *
 * Toda leitura/escrita é protegida por try/catch (modo privado, cota cheia ou
 * armazenamento bloqueado não quebram a aplicação). Os dados de cada usuário
 * ficam em um namespace próprio (`vo:u:<userId>:<coleção>`), mantendo os dados
 * privados de contas diferentes separados no mesmo navegador.
 */
const PREFIX = 'vo'

export const storageKeys = {
  users: `${PREFIX}:users`,
  session: `${PREFIX}:session`,
  theme: `${PREFIX}:theme`,
  preferences: `${PREFIX}:preferences`,
  user: (userId: string, collection: string) => `${PREFIX}:u:${userId}:${collection}`,
  userPrefix: (userId: string) => `${PREFIX}:u:${userId}:`,
} as const

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* armazenamento indisponível */
  }
}

export function hasKey(key: string): boolean {
  try {
    return window.localStorage.getItem(key) !== null
  } catch {
    return false
  }
}

/** Remove todas as chaves que começam com o prefixo informado. */
export function removeByPrefix(prefix: string): void {
  try {
    const keys: string[] = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (key?.startsWith(prefix)) keys.push(key)
    }
    keys.forEach((key) => window.localStorage.removeItem(key))
  } catch {
    /* armazenamento indisponível */
  }
}
