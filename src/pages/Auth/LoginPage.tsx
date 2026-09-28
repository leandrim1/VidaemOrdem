import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Sparkles } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginValues } from '@/lib/schemas/auth'
import { PATHS } from '@/routes/paths'
import { getErrorMessage } from '@/services/errors'
import { toast } from '@/stores/toastStore'
import { firstName } from '@/utils/format'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'

export default function LoginPage() {
  const { login, loginDemo } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)
  const [demoLoading, setDemoLoading] = useState(false)
  const from = (location.state as { from?: string } | null)?.from

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      const user = await login(values)
      toast.success(`Que bom te ver, ${firstName(user.name)}!`)
      navigate(user.onboarding ? (from ?? PATHS.app) : PATHS.onboarding, { replace: true })
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  })

  const enterDemo = async () => {
    setDemoLoading(true)
    try {
      await loginDemo()
      toast.success('Bem-vinda à demonstração!', 'Explore à vontade: tudo pode ser editado.')
      navigate(PATHS.app, { replace: true })
    } catch (error) {
      toast.error('Não foi possível abrir a demonstração', getErrorMessage(error))
      setDemoLoading(false)
    }
  }

  return (
    <AuthLayout
      documentTitle="Entrar"
      title="Entrar na sua conta"
      description="Continue de onde parou e mantenha tudo em ordem."
      footer={
        <>
          Ainda não tem uma conta?{' '}
          <Link to={PATHS.register} className="font-semibold text-primary-ink hover:underline">
            Ainda não tenho uma conta
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {formError && (
          <div role="alert" className="rounded-xl border border-danger/25 bg-danger-soft px-4 py-3 text-sm font-medium text-danger-ink">
            {formError}
          </div>
        )}
        <FormField label="E-mail" error={errors.email?.message}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              leftIcon={<Mail />}
              invalid={invalid}
              aria-describedby={describedBy}
              {...register('email')}
            />
          )}
        </FormField>
        <FormField
          label="Senha"
          error={errors.password?.message}
          labelAction={
            <Link to={PATHS.forgotPassword} className="text-[13px] font-semibold text-primary-ink hover:underline">
              Esqueci minha senha
            </Link>
          }
        >
          {({ id, describedBy, invalid }) => (
            <PasswordInput id={id} autoComplete="current-password" placeholder="Sua senha" invalid={invalid} aria-describedby={describedBy} {...register('password')} />
          )}
        </FormField>
        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          Entrar
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs font-medium text-subtle" aria-hidden>
        <span className="h-px flex-1 bg-line" />
        ou
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button variant="outline" size="lg" fullWidth loading={demoLoading} leftIcon={<Sparkles className="size-4 text-primary-ink" />} onClick={enterDemo}>
        Entrar como demonstração
      </Button>
      <p className="mt-2.5 text-center text-xs text-muted">Acesse um painel completo com dados fictícios. Os dados são restaurados a cada acesso.</p>
    </AuthLayout>
  )
}
