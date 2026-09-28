import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, User } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAuth } from '@/hooks/useAuth'
import { passwordStrength, registerSchema, type RegisterValues } from '@/lib/schemas/auth'
import { PATHS } from '@/routes/paths'
import { getErrorMessage, ServiceError } from '@/services/errors'
import { toast } from '@/stores/toastStore'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'

const STRENGTH = [
  { label: 'Muito fraca', className: 'bg-danger' },
  { label: 'Fraca', className: 'bg-danger' },
  { label: 'Razoável', className: 'bg-warning' },
  { label: 'Boa', className: 'bg-success' },
  { label: 'Forte', className: 'bg-success' },
]

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })
  const password = useWatch({ control, name: 'password' })
  const strength = passwordStrength(password ?? '')

  const onSubmit = handleSubmit(async ({ name, email, password }) => {
    try {
      await registerUser({ name, email, password })
      toast.success('Conta criada com sucesso!')
      navigate(PATHS.onboarding, { replace: true })
    } catch (error) {
      if (error instanceof ServiceError && error.code === 'email_in_use') {
        setError('email', { message: error.message }, { shouldFocus: true })
      } else {
        toast.error('Não foi possível criar a conta', getErrorMessage(error))
      }
    }
  })

  return (
    <AuthLayout
      documentTitle="Criar conta"
      title="Crie sua conta grátis"
      description="7 dias grátis, sem cartão de crédito e sem cobrança automática."
      footer={
        <>
          Já tem uma conta?{' '}
          <Link to={PATHS.login} className="font-semibold text-primary-ink hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormField label="Nome" error={errors.name?.message}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} autoComplete="name" placeholder="Como podemos te chamar?" leftIcon={<User />} invalid={invalid} aria-describedby={describedBy} {...register('name')} />
          )}
        </FormField>
        <FormField label="E-mail" error={errors.email?.message}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} type="email" autoComplete="email" placeholder="voce@email.com" leftIcon={<Mail />} invalid={invalid} aria-describedby={describedBy} {...register('email')} />
          )}
        </FormField>
        <FormField label="Senha" error={errors.password?.message} hint="Mínimo de 8 caracteres, com letras e números.">
          {({ id, describedBy, invalid }) => (
            <div>
              <PasswordInput id={id} autoComplete="new-password" placeholder="Crie uma senha" invalid={invalid} aria-describedby={describedBy} {...register('password')} />
              {password && (
                <div className="mt-2 flex items-center gap-2" aria-live="polite">
                  <div className="flex flex-1 gap-1" aria-hidden>
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className={cn('h-1 flex-1 rounded-full', i < strength ? STRENGTH[strength].className : 'bg-surface-3')} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-muted">Força: {STRENGTH[strength].label}</span>
                </div>
              )}
            </div>
          )}
        </FormField>
        <FormField label="Confirmar senha" error={errors.confirmPassword?.message}>
          {({ id, describedBy, invalid }) => (
            <PasswordInput id={id} autoComplete="new-password" placeholder="Repita a senha" invalid={invalid} aria-describedby={describedBy} {...register('confirmPassword')} />
          )}
        </FormField>
        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          Criar minha conta
        </Button>
        <p className="text-center text-xs leading-relaxed text-muted">
          Ao criar sua conta, você concorda com os Termos de Uso e a Política de Privacidade. Sua senha é armazenada com criptografia.
        </p>
      </form>
    </AuthLayout>
  )
}
