import { z } from 'zod'
import { isValidISODate } from '@/utils/date'

export const requiredText = (message: string, max = 120) => z.string().trim().min(1, message).max(max, `Use no máximo ${max} caracteres.`)

export const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max, `Use no máximo ${max} caracteres.`)
    .optional()
    .transform((value) => (value ? value : undefined))

export const money = (message = 'Informe um valor maior que zero.') =>
  z.number({ error: message }).positive(message).max(99_999_999, 'Valor muito alto.')

export const isoDate = (message = 'Informe uma data válida.') => z.string().refine(isValidISODate, message)

export const optionalIsoDate = () =>
  z
    .string()
    .optional()
    .refine((value) => !value || isValidISODate(value), 'Informe uma data válida.')
    .transform((value) => (value ? value : undefined))
