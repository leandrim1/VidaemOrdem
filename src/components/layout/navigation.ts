import {
  CalendarDays,
  CircleHelp,
  ClipboardCheck,
  CreditCard,
  FileText,
  Flame,
  LayoutDashboard,
  ListChecks,
  MonitorSmartphone,
  Receipt,
  Repeat,
  Settings,
  Target,
  Trophy,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import { PATHS } from '@/routes/paths'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  end?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Geral',
    items: [{ label: 'Visão geral', href: PATHS.app, icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Dinheiro',
    items: [
      { label: 'Finanças', href: PATHS.finance, icon: Wallet },
      { label: 'Contas', href: PATHS.accounts, icon: Receipt },
      { label: 'Cartões', href: PATHS.cards, icon: CreditCard },
      { label: 'Assinaturas', href: PATHS.subscriptions, icon: Repeat },
    ],
  },
  {
    label: 'Vida',
    items: [
      { label: 'Metas', href: PATHS.goals, icon: Target },
      { label: 'Tarefas', href: PATHS.tasks, icon: ListChecks },
      { label: 'Rotina', href: PATHS.routine, icon: CalendarDays },
      { label: 'Hábitos', href: PATHS.habits, icon: Flame },
    ],
  },
  {
    label: 'Organização',
    items: [
      { label: 'Documentos', href: PATHS.documents, icon: FileText },
      { label: 'Organização digital', href: PATHS.digital, icon: MonitorSmartphone },
      { label: 'Checklists', href: PATHS.checklists, icon: ClipboardCheck },
      { label: 'Desafio 7 dias', href: PATHS.challenge, icon: Trophy },
    ],
  },
]

export const FOOTER_NAV: NavItem[] = [
  { label: 'Ajuda', href: PATHS.help, icon: CircleHelp },
  { label: 'Configurações', href: PATHS.settings, icon: Settings },
  { label: 'Perfil', href: PATHS.profile, icon: User },
]

export const MOBILE_NAV: NavItem[] = [
  { label: 'Início', href: PATHS.app, icon: LayoutDashboard, end: true },
  { label: 'Finanças', href: PATHS.finance, icon: Wallet },
  { label: 'Tarefas', href: PATHS.tasks, icon: ListChecks },
  { label: 'Metas', href: PATHS.goals, icon: Target },
]
