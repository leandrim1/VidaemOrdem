import { Briefcase, Car, FileText, GraduationCap, House, Landmark, Users, type LucideIcon } from 'lucide-react'
import type { DocumentCategory } from '@/types'

export const DOCUMENT_ICONS: Record<DocumentCategory, LucideIcon> = {
  pessoais: FileText,
  financeiros: Landmark,
  casa: House,
  veiculo: Car,
  trabalho: Briefcase,
  estudos: GraduationCap,
  familia: Users,
}
