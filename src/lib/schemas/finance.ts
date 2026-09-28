import { z } from 'zod'
import { isoDate, money, optionalText, requiredText } from './common'

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  description: requiredText('Informe uma descrição.', 80),
  amount: money(),
  date: isoDate(),
  category: z.enum(['moradia', 'alimentacao', 'transporte', 'saude', 'educacao', 'lazer', 'compras', 'assinaturas', 'outros', 'salario', 'freelance', 'investimentos'], {
    error: 'Escolha uma categoria.',
  }),
  paymentMethod: z.enum(['pix', 'debito', 'credito', 'dinheiro', 'boleto', 'transferencia'], { error: 'Escolha a forma de pagamento.' }),
})
export type TransactionFormValues = z.input<typeof transactionSchema>
export type TransactionFormOutput = z.output<typeof transactionSchema>

export const accountSchema = z.object({
  name: requiredText('Informe o nome da conta.', 60),
  category: z.enum(['moradia', 'energia', 'agua', 'internet', 'telefone', 'cartao', 'educacao', 'saude', 'impostos', 'seguros', 'outros'], { error: 'Escolha uma categoria.' }),
  dueDate: isoDate('Informe o vencimento.'),
  amount: money(),
  status: z.enum(['paid', 'pending']),
  recurring: z.boolean(),
  notes: optionalText(300),
})
export type AccountFormValues = z.input<typeof accountSchema>
export type AccountFormOutput = z.output<typeof accountSchema>

const day = (label: string) => z.number({ error: `Informe o dia de ${label}.` }).int().min(1, 'Dia entre 1 e 31.').max(31, 'Dia entre 1 e 31.')

export const cardSchema = z
  .object({
    name: requiredText('Informe o nome do cartão.', 40),
    bank: requiredText('Informe o banco.', 40),
    brand: z.enum(['visa', 'mastercard', 'elo', 'amex', 'hipercard']),
    lastDigits: z.string().regex(/^\d{4}$/, 'Informe os 4 últimos dígitos.'),
    limit: money('Informe o limite.'),
    used: z.number({ error: 'Informe o valor utilizado.' }).min(0, 'Valor inválido.'),
    closingDay: day('fechamento'),
    dueDay: day('vencimento'),
    color: z.string(),
  })
  .refine((v) => v.used <= v.limit, { path: ['used'], message: 'O valor utilizado não pode passar do limite.' })
export type CardFormValues = z.input<typeof cardSchema>

export const subscriptionSchema = z.object({
  name: requiredText('Informe o nome da assinatura.', 60),
  amount: money(),
  frequency: z.enum(['semanal', 'mensal', 'trimestral', 'anual']),
  nextBillingDate: isoDate('Informe a próxima cobrança.'),
  category: z.enum(['streaming', 'musica', 'software', 'armazenamento', 'saude', 'educacao', 'outros'], { error: 'Escolha uma categoria.' }),
  active: z.boolean(),
})
export type SubscriptionFormValues = z.input<typeof subscriptionSchema>
