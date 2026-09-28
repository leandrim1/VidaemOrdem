import {
  Banknote,
  BookOpen,
  Briefcase,
  Car,
  CircleDollarSign,
  CreditCard,
  Droplets,
  Film,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  Laptop,
  Repeat,
  Shield,
  ShoppingBag,
  Smartphone,
  Stethoscope,
  Tag,
  TrendingUp,
  Utensils,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { AccountCategory, TransactionCategory } from '@/types'

export const TRANSACTION_ICONS: Record<TransactionCategory, LucideIcon> = {
  moradia: House,
  alimentacao: Utensils,
  transporte: Car,
  saude: Stethoscope,
  educacao: GraduationCap,
  lazer: Film,
  compras: ShoppingBag,
  assinaturas: Repeat,
  outros: Tag,
  salario: Briefcase,
  freelance: Laptop,
  investimentos: TrendingUp,
}

export const ACCOUNT_ICONS: Record<AccountCategory, LucideIcon> = {
  moradia: House,
  energia: Zap,
  agua: Droplets,
  internet: Wifi,
  telefone: Smartphone,
  cartao: CreditCard,
  educacao: BookOpen,
  saude: HeartPulse,
  impostos: Landmark,
  seguros: Shield,
  outros: CircleDollarSign,
}

export const MoneyIcon = Banknote
