import type { Document } from '@/types'
import { createCollectionService } from './collection'
import { COLLECTIONS } from './collections'

/** Apenas metadados de documentos — nenhum arquivo é enviado ou armazenado. */
export const documentsService = createCollectionService<Document>(COLLECTIONS.documents)
