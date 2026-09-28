import { CalendarDays, FileText, House, Luggage, MonitorSmartphone, Truck, Wallet, type LucideIcon } from 'lucide-react'
import type { ChecklistIcon } from '@/types'

export const CHECKLIST_ICONS: Record<ChecklistIcon, LucideIcon> = {
  finance: Wallet,
  calendar: CalendarDays,
  home: House,
  travel: Luggage,
  moving: Truck,
  digital: MonitorSmartphone,
  documents: FileText,
}
