/** Data no formato ISO `yyyy-MM-dd` (sem horário). */
export type ISODate = string

/** Data e hora no formato ISO 8601 completo. */
export type ISODateTime = string

export interface Entity {
  id: string
  createdAt: ISODateTime
  updatedAt?: ISODateTime
}

/** Campos controlados pelo servidor/serviço — nunca enviados pelo formulário. */
export type EntityInput<T extends Entity> = Omit<T, keyof Entity>

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'
