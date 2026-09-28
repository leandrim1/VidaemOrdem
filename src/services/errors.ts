export type ServiceErrorCode =
  | 'unauthenticated'
  | 'invalid_credentials'
  | 'email_in_use'
  | 'not_found'
  | 'validation'
  | 'storage'
  | 'forbidden'

/** Erro de domínio padronizado — a UI exibe `message` diretamente ao usuário. */
export class ServiceError extends Error {
  readonly code: ServiceErrorCode

  constructor(code: ServiceErrorCode, message: string) {
    super(message)
    this.name = 'ServiceError'
    this.code = code
  }
}

export function getErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (error instanceof ServiceError) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}
