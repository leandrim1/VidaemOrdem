/**
 * Catálogos de opções usados em formulários, filtros e gráficos.
 * As cores das categorias financeiras seguem a paleta categórica validada
 * (--vo-chart-*): a cor acompanha a categoria, nunca a posição no ranking.
 */
import type {
  AccountCategory,
  AccountStatus,
  DocumentCategory,
  ExpenseCategory,
  GoalCategory,
  IncomeCategory,
  PaymentMethod,
  RoutineEventType,
  SubscriptionCategory,
  SubscriptionFrequency,
  TaskCategory,
  TaskPriority,
  TransactionCategory,
} from '@/types'

export interface Option<T extends string> {
  value: T
  label: string
}

export const EXPENSE_CATEGORIES: Array<Option<ExpenseCategory> & { color: string }> = [
  { value: 'moradia', label: 'Moradia', color: 'var(--vo-chart-1)' },
  { value: 'alimentacao', label: 'Alimentação', color: 'var(--vo-chart-2)' },
  { value: 'transporte', label: 'Transporte', color: 'var(--vo-chart-3)' },
  { value: 'saude', label: 'Saúde', color: 'var(--vo-chart-4)' },
  { value: 'educacao', label: 'Educação', color: 'var(--vo-chart-5)' },
  { value: 'lazer', label: 'Lazer', color: 'var(--vo-chart-6)' },
  { value: 'compras', label: 'Compras', color: 'var(--vo-chart-7)' },
  { value: 'assinaturas', label: 'Assinaturas', color: 'var(--vo-chart-8)' },
  { value: 'outros', label: 'Outros', color: 'var(--vo-chart-neutral)' },
]

export const INCOME_CATEGORIES: Array<Option<IncomeCategory>> = [
  { value: 'salario', label: 'Salário' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investimentos', label: 'Investimentos' },
  { value: 'outros', label: 'Outros' },
]

const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  moradia: 'Moradia',
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  saude: 'Saúde',
  educacao: 'Educação',
  lazer: 'Lazer',
  compras: 'Compras',
  assinaturas: 'Assinaturas',
  outros: 'Outros',
  salario: 'Salário',
  freelance: 'Freelance',
  investimentos: 'Investimentos',
}

export function categoryLabel(category: TransactionCategory): string {
  return CATEGORY_LABELS[category] ?? category
}

export function expenseCategoryColor(category: TransactionCategory): string {
  return EXPENSE_CATEGORIES.find((c) => c.value === category)?.color ?? 'var(--vo-chart-neutral)'
}

export const PAYMENT_METHODS: Array<Option<PaymentMethod>> = [
  { value: 'pix', label: 'Pix' },
  { value: 'debito', label: 'Cartão de débito' },
  { value: 'credito', label: 'Cartão de crédito' },
  { value: 'boleto', label: 'Boleto' },
  { value: 'transferencia', label: 'Transferência' },
  { value: 'dinheiro', label: 'Dinheiro' },
]

export function paymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHODS.find((m) => m.value === method)?.label ?? method
}

export const ACCOUNT_CATEGORIES: Array<Option<AccountCategory>> = [
  { value: 'moradia', label: 'Moradia' },
  { value: 'energia', label: 'Energia' },
  { value: 'agua', label: 'Água' },
  { value: 'internet', label: 'Internet' },
  { value: 'telefone', label: 'Telefone' },
  { value: 'cartao', label: 'Cartão de crédito' },
  { value: 'educacao', label: 'Educação' },
  { value: 'saude', label: 'Saúde' },
  { value: 'impostos', label: 'Impostos' },
  { value: 'seguros', label: 'Seguros' },
  { value: 'outros', label: 'Outros' },
]

export function accountCategoryLabel(category: AccountCategory): string {
  return ACCOUNT_CATEGORIES.find((c) => c.value === category)?.label ?? category
}

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  paid: 'Pago',
  pending: 'Pendente',
  overdue: 'Atrasado',
}

export const SUBSCRIPTION_CATEGORIES: Array<Option<SubscriptionCategory>> = [
  { value: 'streaming', label: 'Streaming' },
  { value: 'musica', label: 'Música' },
  { value: 'software', label: 'Software' },
  { value: 'armazenamento', label: 'Armazenamento' },
  { value: 'saude', label: 'Saúde e bem-estar' },
  { value: 'educacao', label: 'Educação' },
  { value: 'outros', label: 'Outros' },
]

export function subscriptionCategoryLabel(category: SubscriptionCategory): string {
  return SUBSCRIPTION_CATEGORIES.find((c) => c.value === category)?.label ?? category
}

export const SUBSCRIPTION_FREQUENCIES: Array<Option<SubscriptionFrequency>> = [
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'trimestral', label: 'Trimestral' },
  { value: 'anual', label: 'Anual' },
]

export function frequencyLabel(frequency: SubscriptionFrequency): string {
  return SUBSCRIPTION_FREQUENCIES.find((f) => f.value === frequency)?.label ?? frequency
}

export const GOAL_CATEGORIES: Array<Option<GoalCategory>> = [
  { value: 'financeira', label: 'Financeira' },
  { value: 'viagem', label: 'Viagem' },
  { value: 'educacao', label: 'Educação' },
  { value: 'saude', label: 'Saúde' },
  { value: 'carreira', label: 'Carreira' },
  { value: 'casa', label: 'Casa' },
  { value: 'pessoal', label: 'Pessoal' },
]

export function goalCategoryLabel(category: GoalCategory): string {
  return GOAL_CATEGORIES.find((c) => c.value === category)?.label ?? category
}

export const TASK_CATEGORIES: Array<Option<TaskCategory>> = [
  { value: 'pessoal', label: 'Pessoal' },
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'casa', label: 'Casa' },
  { value: 'financas', label: 'Finanças' },
  { value: 'saude', label: 'Saúde' },
  { value: 'estudos', label: 'Estudos' },
]

export function taskCategoryLabel(category: TaskCategory): string {
  return TASK_CATEGORIES.find((c) => c.value === category)?.label ?? category
}

export const TASK_PRIORITIES: Array<Option<TaskPriority>> = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
]

export function priorityLabel(priority: TaskPriority): string {
  return TASK_PRIORITIES.find((p) => p.value === priority)?.label ?? priority
}

export const DOCUMENT_CATEGORIES: Array<Option<DocumentCategory>> = [
  { value: 'pessoais', label: 'Pessoais' },
  { value: 'financeiros', label: 'Financeiros' },
  { value: 'casa', label: 'Casa' },
  { value: 'veiculo', label: 'Veículo' },
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'estudos', label: 'Estudos' },
  { value: 'familia', label: 'Família' },
]

export function documentCategoryLabel(category: DocumentCategory): string {
  return DOCUMENT_CATEGORIES.find((c) => c.value === category)?.label ?? category
}

export const ROUTINE_EVENT_TYPES: Array<Option<RoutineEventType>> = [
  { value: 'compromisso', label: 'Compromisso' },
  { value: 'tarefa', label: 'Tarefa' },
  { value: 'evento', label: 'Evento' },
]

export function routineTypeLabel(type: RoutineEventType): string {
  return ROUTINE_EVENT_TYPES.find((t) => t.value === type)?.label ?? type
}
