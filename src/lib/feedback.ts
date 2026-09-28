import { getErrorMessage } from '@/services/errors'
import { toast } from '@/stores/toastStore'

/**
 * Executa uma ação assíncrona exibindo feedback visual: toast de sucesso
 * (opcional) ou de erro. Retorna `true` quando a ação foi concluída.
 */
export async function withFeedback(action: () => Promise<unknown>, successMessage?: string): Promise<boolean> {
  try {
    await action()
    if (successMessage) toast.success(successMessage)
    return true
  } catch (error) {
    toast.error('Não foi possível concluir a ação', getErrorMessage(error))
    return false
  }
}
