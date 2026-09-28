import type { Entity, ISODate } from './common'

export type DocumentCategory = 'pessoais' | 'financeiros' | 'casa' | 'veiculo' | 'trabalho' | 'estudos' | 'familia'

/**
 * Metadados de um documento. Nesta versão os arquivos em si não são enviados
 * nem armazenados — apenas as informações para localizá-los.
 */
export interface Document extends Entity {
  name: string
  category: DocumentCategory
  expiresAt?: ISODate
  location: string
  notes?: string
}
