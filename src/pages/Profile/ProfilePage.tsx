import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Award, CalendarDays, CircleCheck, Crown, Flame, ListChecks, Lock, Mail, Sparkles, Target, Trophy, User, type LucideIcon } from 'lucide-react'
import type { PointAction } from '@/types'
import { cn } from '@/lib/cn'
import { useAuth, useCurrentUser } from '@/hooks/useAuth'
import { useGamification } from '@/hooks/useGamification'
import { profileSchema, type ProfileValues } from '@/lib/schemas/auth'
import { getErrorMessage, ServiceError } from '@/services/errors'
import { MESSAGES, toast } from '@/stores/toastStore'
import { formatDate, formatRelativeTime } from '@/utils/format'
import { LEVELS, POINTS, POINT_LABELS } from '@/utils/gamification'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { EmptyState } from '@/components/ui/States'

const ACTION_ICONS: Record<PointAction, LucideIcon> = {
  task: ListChecks,
  habit: Flame,
  checklist: CircleCheck,
  goal: Target,
  challenge: Trophy,
}

export default function ProfilePage() {
  const user = useCurrentUser()
  const { updateProfile } = useAuth()
  const { points, level, nextLevel, progress, history } = useGamification()
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema), values: { name: user.name, email: user.email } })

  const onSubmit = handleSubmit(async (values) => {
    try {
      const updated = await updateProfile(values)
      reset({ name: updated.name, email: updated.email })
      toast.success(MESSAGES.saved)
    } catch (error) {
      if (error instanceof ServiceError && error.code === 'email_in_use') setError('email', { message: error.message })
      else toast.error('Não foi possível salvar', getErrorMessage(error))
    }
  })

  return (
    <>
      <PageHeader title="Perfil" description="Suas informações, nível e conquistas." />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-5">
          <Card padding="none" className="overflow-hidden">
            <div className="h-24 bg-navy sm:h-28 dark:bg-surface-3" aria-hidden>
              <div className="h-full w-full bg-[radial-gradient(circle_at_85%_20%,rgb(37_99_235/0.5),transparent_55%)]" />
            </div>
            <div className="px-5 pb-6 sm:px-6">
              <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end">
                <Avatar name={user.name} src={user.avatarUrl} size="xl" className="ring-4 ring-surface" />
                <div className="min-w-0 flex-1 sm:pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-xl font-extrabold text-fg">{user.name}</h2>
                    {user.isDemo && <Badge tone="primary">Conta de demonstração</Badge>}
                    {user.role === 'admin' && <Badge tone="navy">Admin</Badge>}
                  </div>
                  <p className="flex items-center gap-1.5 text-sm text-muted">
                    <Mail className="size-3.5" aria-hidden /> {user.email}
                  </p>
                </div>
              </div>
              <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-surface-2/70 p-3.5">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted">
                    <Crown className="size-3.5" aria-hidden /> Nível
                  </dt>
                  <dd className="mt-1 font-display text-lg font-bold text-fg">{level.level}</dd>
                </div>
                <div className="rounded-xl bg-surface-2/70 p-3.5">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted">
                    <Sparkles className="size-3.5" aria-hidden /> Pontos
                  </dt>
                  <dd className="vo-tabular mt-1 font-display text-lg font-bold text-fg">{points}</dd>
                </div>
                <div className="rounded-xl bg-surface-2/70 p-3.5">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted">
                    <Award className="size-3.5" aria-hidden /> Progresso
                  </dt>
                  <dd className="vo-tabular mt-1 font-display text-lg font-bold text-fg">{progress}%</dd>
                </div>
                <div className="rounded-xl bg-surface-2/70 p-3.5">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-muted">
                    <CalendarDays className="size-3.5" aria-hidden /> Membro desde
                  </dt>
                  <dd className="mt-1 font-display text-lg font-bold text-fg">{formatDate(user.createdAt, 'MMM yyyy')}</dd>
                </div>
              </dl>
            </div>
          </Card>

          <Card>
            <CardHeader title={`Nível ${level.level} · ${level.name}`} description={nextLevel ? `Faltam ${nextLevel.minPoints - points} pontos para "${nextLevel.name}"` : 'Você alcançou o nível máximo!'} icon={<Crown />} />
            <ProgressBar value={progress} size="lg" label="Progresso para o próximo nível" showValue />
            <ol className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-5">
              {LEVELS.map((item) => {
                const reached = points >= item.minPoints
                const current = item.level === level.level
                return (
                  <li
                    key={item.level}
                    className={cn('rounded-xl border p-3', current ? 'border-primary bg-primary-soft' : reached ? 'border-line bg-surface' : 'border-dashed border-line bg-surface-2/40')}
                    aria-current={current ? 'step' : undefined}
                  >
                    <p className={cn('flex items-center gap-1 text-xs font-semibold', current ? 'text-primary-ink' : 'text-muted')}>
                      {reached ? <CircleCheck className="size-3.5" aria-hidden /> : <Lock className="size-3.5" aria-hidden />}
                      Nível {item.level}
                    </p>
                    <p className={cn('mt-1 text-sm font-bold', reached ? 'text-fg' : 'text-muted')}>{item.name}</p>
                    <p className="vo-tabular text-xs text-muted">{item.minPoints} pts</p>
                  </li>
                )
              })}
            </ol>
          </Card>

          <Card>
            <CardHeader title="Informações pessoais" description="Atualize seu nome e e-mail." icon={<User />} />
            <form onSubmit={onSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Nome" error={errors.name?.message}>
                  {({ id, describedBy, invalid }) => <Input id={id} autoComplete="name" invalid={invalid} aria-describedby={describedBy} {...register('name')} />}
                </FormField>
                <FormField label="E-mail" error={errors.email?.message}>
                  {({ id, describedBy, invalid }) => <Input id={id} type="email" autoComplete="email" invalid={invalid} aria-describedby={describedBy} {...register('email')} />}
                </FormField>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" disabled={!isDirty} onClick={() => reset()}>
                  Descartar
                </Button>
                <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
                  Salvar alterações
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <aside className="space-y-5">
          <Card>
            <CardHeader title="Como ganhar pontos" icon={<Sparkles />} />
            <ul className="space-y-2.5">
              {(Object.keys(POINTS) as PointAction[]).map((action) => {
                const Icon = ACTION_ICONS[action]
                return (
                  <li key={action} className="flex items-center gap-3 text-sm">
                    <Icon className="size-4 text-muted" aria-hidden />
                    <span className="flex-1 text-fg-soft">{POINT_LABELS[action]}</span>
                    <span className="vo-tabular font-bold text-success-ink">+{POINTS[action]}</span>
                  </li>
                )
              })}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Atividade recente" description="Seus últimos pontos conquistados" />
            {history.length === 0 ? (
              <EmptyState compact icon={<Sparkles />} title="Nenhum ponto ainda" description="Conclua uma tarefa ou hábito para começar." />
            ) : (
              <ul className="space-y-3">
                {history.slice(0, 8).map((event) => {
                  const Icon = ACTION_ICONS[event.action]
                  return (
                    <li key={event.id} className="flex items-start gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-fg-soft">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium text-fg">{event.label}</p>
                        <p className="text-xs text-muted">{formatRelativeTime(event.createdAt)}</p>
                      </div>
                      <span className="vo-tabular text-sm font-bold text-success-ink">+{event.points}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>
        </aside>
      </div>
    </>
  )
}
