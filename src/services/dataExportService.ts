import { readJSON, storageKeys } from '@/lib/storage'
import { delay } from '@/lib/delay'
import { COLLECTIONS } from './collections'
import { requireUserId } from './session'

/**
 * Exporta todos os dados do usuário atual em JSON (portabilidade — LGPD).
 * Senhas e tokens de sessão nunca fazem parte da exportação.
 */
export const dataExportService = {
  async exportAll(): Promise<Blob> {
    await delay(300)
    const userId = requireUserId()
    const data: Record<string, unknown> = {}
    for (const collection of Object.values(COLLECTIONS)) {
      data[collection] = readJSON<unknown>(storageKeys.user(userId, collection), null)
    }
    const payload = { app: 'Vida em Ordem', version: 1, exportedAt: new Date().toISOString(), data }
    return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  },
}
