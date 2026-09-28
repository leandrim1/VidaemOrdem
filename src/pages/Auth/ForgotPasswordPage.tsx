import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, MailCheck } from 'lucide-react'
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/lib/schemas/auth'
import { PATHS } from '@/routes/paths'
import { authService } from '@/services/authService'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'

export default function ForgotPasswordPage() {
  const [sentTo, setSentTo] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } })

  const onSubmit = handleSubmit(async ({ email }) => {
    await authService.requestPasswordReset(email)
    setSentTo(email)
  })

  const back = (
    <Link to={PATHS.login} className="inline-flex items-center gap-1.5 font-semibold text-primary-ink hover:underline">
      <ArrowLeft className="size-4" aria-hidden />
      Voltar para o login
    </Link>
  )

  if (sentTo) {
    return (
      <AuthLayout documentTitle="Recuperar senha" title="Verifique seu e-mail" description="Enviamos as instruções de recuperação." footer={back}>
        <div className="rounded-2xl border border-line bg-surface-2/60 p-6 text-center" role="status">
          <span className="mx-auto flex size-14 animate-pop items-center justify-center rounded-2xl bg-success-soft text-success-ink">
            <MailCheck className="size-6" aria-hidden />
          </span>
          <p className="mt-4 text-sm leading-relaxed text-fg-soft">
            Se existir uma conta associada a <strong className="text-fg">{sentTo}</strong>, você receberá um link para criar uma nova senha nos próximos minutos.
          </p>
          <p className="mt-3 text-xs text-muted">Não recebeu? Confira a caixa de spam ou tente novamente.</p>
          <Button variant="outline" className="mt-5" onClick={() => setSentTo(null)}>
            Enviar novamente
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout documentTitle="Recuperar senha" title="Esqueceu sua senha?" description="Informe seu e-mail e enviaremos um link para você criar uma nova senha." footer={back}>
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <FormField label="E-mail" error={errors.email?.message}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} type="email" autoComplete="email" placeholder="voce@email.com" leftIcon={<Mail />} invalid={invalid} aria-describedby={describedBy} {...register('email')} />
          )}
        </FormField>
        <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
          Enviar link de recuperação
        </Button>
      </form>
    </AuthLayout>
  )
}
