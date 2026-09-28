import { z } from 'zod'

const email = z.string().trim().min(1, 'Informe seu e-mail.').email('Informe um e-mail válido.')

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe sua senha.'),
})
export type LoginValues = z.infer<typeof loginSchema>

export const passwordRules = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres.')
  .max(72, 'A senha deve ter no máximo 72 caracteres.')
  .regex(/[A-Za-z]/, 'Inclua pelo menos uma letra.')
  .regex(/\d/, 'Inclua pelo menos um número.')

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Informe seu nome.').max(80, 'Nome muito longo.'),
    email,
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Confirme sua senha.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  })
export type RegisterValues = z.infer<typeof registerSchema>

export const forgotPasswordSchema = z.object({ email })
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const changePasswordSchema = z
  .object({
    current: z.string().min(1, 'Informe a senha atual.'),
    next: passwordRules,
    confirm: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((v) => v.next === v.confirm, { path: ['confirm'], message: 'As senhas não coincidem.' })
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(80, 'Nome muito longo.'),
  email,
})
export type ProfileValues = z.infer<typeof profileSchema>

/** 0–4: força aproximada da senha para feedback visual. */
export function passwordStrength(password: string): number {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++
  return Math.min(4, score)
}
