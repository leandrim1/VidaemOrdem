import { z } from 'zod'
import { isoDate, money, optionalIsoDate, optionalText, requiredText } from './common'

export const goalSchema = z
  .object({
    name: requiredText('Informe o nome da meta.', 60),
    category: z.enum(['financeira', 'viagem', 'educacao', 'saude', 'carreira', 'casa', 'pessoal']),
    targetAmount: money('Informe o valor objetivo.'),
    currentAmount: z.number({ error: 'Informe o valor atual.' }).min(0, 'Valor inválido.'),
    deadline: isoDate('Informe o prazo.'),
  })
export type GoalFormValues = z.input<typeof goalSchema>

export const contributionSchema = z.object({
  mode: z.enum(['add', 'withdraw']),
  amount: money(),
})
export type ContributionValues = z.input<typeof contributionSchema>

export const taskSchema = z.object({
  title: requiredText('Informe o título da tarefa.', 100),
  description: optionalText(400),
  priority: z.enum(['high', 'medium', 'low']),
  category: z.enum(['pessoal', 'trabalho', 'casa', 'financas', 'saude', 'estudos']),
  dueDate: optionalIsoDate(),
})
export type TaskFormValues = z.input<typeof taskSchema>
export type TaskFormOutput = z.output<typeof taskSchema>

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Horário inválido.')

export const routineEventSchema = z
  .object({
    title: requiredText('Informe o título.', 80),
    type: z.enum(['compromisso', 'tarefa', 'evento']),
    date: isoDate(),
    startTime: time,
    endTime: z.union([time, z.literal('')]).optional().transform((v) => (v ? v : undefined)),
    location: optionalText(80),
    notes: optionalText(300),
  })
  .refine((v) => !v.endTime || v.endTime > v.startTime, { path: ['endTime'], message: 'O término deve ser depois do início.' })
export type RoutineEventFormValues = z.input<typeof routineEventSchema>
export type RoutineEventFormOutput = z.output<typeof routineEventSchema>

export const habitSchema = z.object({
  name: requiredText('Informe o nome do hábito.', 50),
  icon: z.enum(['book', 'walk', 'water', 'study', 'dumbbell', 'brain', 'sleep', 'heart']),
  targetPerWeek: z.number({ error: 'Escolha a meta semanal.' }).int().min(1).max(7),
})
export type HabitFormValues = z.input<typeof habitSchema>

export const documentSchema = z.object({
  name: requiredText('Informe o nome do documento.', 80),
  category: z.enum(['pessoais', 'financeiros', 'casa', 'veiculo', 'trabalho', 'estudos', 'familia']),
  expiresAt: optionalIsoDate(),
  location: requiredText('Informe onde o documento está guardado.', 120),
  notes: optionalText(400),
})
export type DocumentFormValues = z.input<typeof documentSchema>
export type DocumentFormOutput = z.output<typeof documentSchema>
