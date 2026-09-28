import type { Session } from '@/types'
import { readJSON, removeKey, storageKeys, writeJSON } from '@/lib/storage'
import { ServiceError } from './errors'

/**
 * Sessão atual. No Supabase, isto seria `supabase.auth.getSession()`; os
 * services consultam o usuário da sessão (como o RLS faria no banco) em vez
 * de recebê-lo dos componentes.
 */
export function readSession(): Session | null {
  const session = readJSON<Session | null>(storageKeys.session, null)
  if (!session || typeof session.userId !== 'string') return null
  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    removeKey(storageKeys.session)
    return null
  }
  return session
}

export function writeSession(session: Session): void {
  if (!writeJSON(storageKeys.session, session)) {
    throw new ServiceError('storage', 'Não foi possível salvar a sessão neste navegador.')
  }
}

export function clearSession(): void {
  removeKey(storageKeys.session)
}

type UnauthenticatedHandler = () => void
let onUnauthenticated: UnauthenticatedHandler | null = null

/** Registrado pela camada de estado para encerrar a sessão local quando ela expira. */
export function setUnauthenticatedHandler(handler: UnauthenticatedHandler | null): void {
  onUnauthenticated = handler
}

export function requireUserId(): string {
  const session = readSession()
  if (!session) {
    if (onUnauthenticated) queueMicrotask(onUnauthenticated)
    throw new ServiceError('unauthenticated', 'Sua sessão expirou. Entre novamente.')
  }
  return session.userId
}
