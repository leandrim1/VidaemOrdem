import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, Database, Download, KeyRound, Monitor, Moon, Palette, Shield, Sun, Trash2, User } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAuth, useCurrentUser } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { changePasswordSchema, type ChangePasswordValues } from '@/lib/schemas/auth'
import { PATHS } from '@/routes/paths'
import { authService } from '@/services/authService'
import { dataExportService } from '@/services/dataExportService'
import { getErrorMessage, ServiceError } from '@/services/errors'
import { confirm } from '@/stores/confirmStore'
import { usePreferencesStore, type PreferenceToggle } from '@/stores/preferencesStore'
import { useAuthStore } from '@/stores/authStore'
import type { ThemePreference } from '@/stores/themeStore'
import { MESSAGES, toast } from '@/stores/toastStore'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { FormField } from '@/components/ui/FormField'
import { PageHeader } from '@/components/ui/PageHeader'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { Switch } from '@/components/ui/Switch'
import { Tabs } from '@/components/ui/Tabs'

type Section = 'conta' | 'aparencia' | 'notificacoes' | 'privacidade'

function PreferenceSwitch({ name, label, description, disabled }: { name: PreferenceToggle; label: string; description?: string; disabled?: boolean }) {
  const value = usePreferencesStore((s) => s[name])
  const toggle = usePreferencesStore((s) => s.toggle)
  return (
    <Switch
      checked={value}
      disabled={disabled}
      onChange={() => {
        toggle(name)
        toast.success(MESSAGES.saved)
      }}
      label={label}
      description={description}
      className="py-4"
    />
  )
}

function ChangePasswordForm({ disabled }: { disabled: boolean }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema), defaultValues: { current: '', next: '', confirm: '' } })

  const onSubmit = handleSubmit(async ({ current, next }) => {
    try {
      await authService.changePassword(current, next)
      reset()
      toast.success('Senha alterada com sucesso.')
    } catch (error) {
      if (error instanceof ServiceError && error.code === 'invalid_credentials') setError('current', { message: error.message })
      else toast.error('Não foi possível alterar a senha', getErrorMessage(error))
    }
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {disabled && <p className="rounded-xl bg-surface-2 p-3 text-[13px] text-muted">A conta de demonstração não permite alterar a senha.</p>}
      <FormField label="Senha atual" error={errors.current?.message}>
        {({ id, describedBy, invalid }) => <PasswordInput id={id} autoComplete="current-password" disabled={disabled} invalid={invalid} aria-describedby={describedBy} {...register('current')} />}
      </FormField>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Nova senha" error={errors.next?.message} hint="Mínimo de 8 caracteres, com letras e números.">
          {({ id, describedBy, invalid }) => <PasswordInput id={id} autoComplete="new-password" disabled={disabled} invalid={invalid} aria-describedby={describedBy} {...register('next')} />}
        </FormField>
        <FormField label="Confirmar nova senha" error={errors.confirm?.message}>
          {({ id, describedBy, invalid }) => <PasswordInput id={id} autoComplete="new-password" disabled={disabled} invalid={invalid} aria-describedby={describedBy} {...register('confirm')} />}
        </FormField>
      </div>
      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting} disabled={disabled}>
          Alterar senha
        </Button>
      </div>
    </form>
  )
}

function ThemeOption({ value, label, icon, preview }: { value: ThemePreference; label: string; icon: ReactNode; preview: string }) {
  const { theme, setTheme } = useTheme()
  const selected = theme === value
  return (
    <label className={cn('relative cursor-pointer rounded-2xl border p-2 transition-colors has-focus-visible:ring-3 has-focus-visible:ring-primary-ring', selected ? 'border-primary ring-1 ring-primary' : 'border-line hover:border-line-strong')}>
      <input
        type="radio"
        name="theme"
        value={value}
        checked={selected}
        onChange={() => {
          setTheme(value)
          toast.success(MESSAGES.saved)
        }}
        className="sr-only"
      />
      <div className={cn('h-24 overflow-hidden rounded-xl border border-line', preview)} aria-hidden>
        <div className="flex h-full">
          <div className="w-1/4 border-r border-current/10 bg-current/5" />
          <div className="flex-1 space-y-1.5 p-2.5">
            <div className="h-2 w-1/2 rounded bg-current/25" />
            <div className="h-6 rounded-md bg-current/10" />
            <div className="h-6 rounded-md bg-current/10" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-1.5 pt-2.5 pb-1">
        <span className="flex items-center gap-2 text-sm font-semibold text-fg [&_svg]:size-4">
          {icon}
          {label}
        </span>
        {selected && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-white">
            <Check className="size-3" strokeWidth={3} aria-hidden />
          </span>
        )}
      </div>
    </label>
  )
}

export default function SettingsPage() {
  const user = useCurrentUser()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState<Section>('conta')
  const notificationsEnabled = usePreferencesStore((s) => s.notificationsEnabled)
  const [busy, setBusy] = useState<string | null>(null)

  const run = async (key: string, action: () => Promise<void>) => {
    setBusy(key)
    try {
      await action()
    } catch (error) {
      toast.error('Não foi possível concluir a ação', getErrorMessage(error))
    } finally {
      setBusy(null)
    }
  }

  const exportData = () =>
    run('export', async () => {
      const blob = await dataExportService.exportAll()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `vida-em-ordem-dados-${new Date().toISOString().slice(0, 10)}.json`
      link.click()
      URL.revokeObjectURL(url)
      toast.success('Exportação concluída.', 'O arquivo foi baixado para o seu dispositivo.')
    })

  const loadSample = () =>
    run('sample', async () => {
      if (!(await confirm({ title: user.isDemo ? 'Restaurar dados de demonstração?' : 'Carregar dados de exemplo?', description: 'Os dados atuais desta conta serão substituídos pelos dados fictícios.', confirmLabel: 'Carregar', tone: 'primary' }))) return
      await authService.loadSampleData()
      useAuthStore.getState().refreshData()
      toast.success('Dados de exemplo carregados.')
      navigate(PATHS.app)
    })

  const clearData = () =>
    run('clear', async () => {
      if (!(await confirm({ title: 'Tem certeza?', description: 'Todas as suas movimentações, tarefas, metas, hábitos e documentos serão apagados. Esta ação não pode ser desfeita.', confirmLabel: 'Apagar tudo' }))) return
      await authService.clearData()
      useAuthStore.getState().refreshData()
      toast.success('Seus dados foram apagados.')
    })

  const deleteAccount = () =>
    run('delete', async () => {
      if (!(await confirm({ title: 'Excluir sua conta?', description: 'Sua conta e todos os dados associados serão excluídos permanentemente deste dispositivo.', confirmLabel: 'Excluir conta' }))) return
      await authService.deleteAccount()
      useAuthStore.getState().signOutLocally()
      toast.info('Sua conta foi excluída.')
      navigate(PATHS.home, { replace: true })
    })

  return (
    <>
      <PageHeader title="Configurações" description="Personalize sua experiência e controle seus dados." />
      <Tabs
        label="Seções das configurações"
        value={section}
        onChange={setSection}
        panelId="settings-panel"
        className="mb-5"
        items={[
          { value: 'conta', label: 'Conta', icon: <User /> },
          { value: 'aparencia', label: 'Aparência', icon: <Palette /> },
          { value: 'notificacoes', label: 'Notificações', icon: <Bell /> },
          { value: 'privacidade', label: 'Privacidade', icon: <Shield /> },
        ]}
      />

      <div id="settings-panel" role="tabpanel" className="max-w-3xl animate-fade-in space-y-5" key={section}>
        {section === 'conta' && (
          <>
            <Card>
              <CardHeader title="Sua conta" description="Dados de acesso e sessão." icon={<User />} />
              <dl className="divide-y divide-line text-sm">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-muted">Nome</dt>
                  <dd className="font-medium text-fg">{user.name}</dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-muted">E-mail</dt>
                  <dd className="truncate font-medium text-fg">{user.email}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap justify-end gap-2">
                <Button variant="outline" onClick={() => navigate(PATHS.profile)}>
                  Editar perfil
                </Button>
                <Button
                  variant="secondary"
                  onClick={async () => {
                    await logout()
                    toast.info('Você saiu da sua conta.')
                    navigate(PATHS.login, { replace: true })
                  }}
                >
                  Sair da conta
                </Button>
              </div>
            </Card>
            <Card>
              <CardHeader title="Alterar senha" description="Sua senha é armazenada com criptografia (hash + salt)." icon={<KeyRound />} />
              <ChangePasswordForm disabled={Boolean(user.isDemo)} />
            </Card>
          </>
        )}

        {section === 'aparencia' && (
          <Card>
            <CardHeader title="Tema" description="Escolha como o Vida em Ordem aparece para você." icon={<Palette />} />
            <div role="radiogroup" aria-label="Tema" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <ThemeOption value="light" label="Claro" icon={<Sun />} preview="bg-slate-50 text-slate-900" />
              <ThemeOption value="dark" label="Escuro" icon={<Moon />} preview="bg-[#0B1120] text-slate-200" />
              <ThemeOption value="system" label="Sistema" icon={<Monitor />} preview="bg-gradient-to-r from-slate-50 from-50% to-[#0B1120] to-50% text-slate-500" />
            </div>
          </Card>
        )}

        {section === 'notificacoes' && (
          <Card>
            <CardHeader title="Notificações" description="Escolha o que merece sua atenção." icon={<Bell />} />
            <div className="divide-y divide-line">
              <PreferenceSwitch name="notificationsEnabled" label="Notificações ativadas" description="Exibe alertas na central de notificações do app." />
              <PreferenceSwitch name="billReminders" label="Lembretes de contas" description="Avisos de vencimento e contas atrasadas." disabled={!notificationsEnabled} />
              <PreferenceSwitch name="taskReminders" label="Lembretes de tarefas" description="Resumo das tarefas do dia." disabled={!notificationsEnabled} />
              <PreferenceSwitch name="weeklySummary" label="Resumo semanal por e-mail" description="Um panorama da sua semana todo domingo." disabled={!notificationsEnabled} />
            </div>
          </Card>
        )}

        {section === 'privacidade' && (
          <>
            <Card>
              <CardHeader title="Privacidade" description="Você no controle das suas informações." icon={<Shield />} />
              <div className="divide-y divide-line">
                <PreferenceSwitch name="hideValues" label="Ocultar valores" description="Esconde saldos e valores na tela — útil em locais públicos." />
                <PreferenceSwitch name="analytics" label="Compartilhar dados de uso anônimos" description="Ajuda a melhorar o produto. Nenhum dado financeiro é compartilhado." />
              </div>
            </Card>
            <Card>
              <CardHeader title="Seus dados" description="Exporte, restaure ou apague as informações desta conta." icon={<Database />} />
              <div className="space-y-3">
                <div className="flex flex-col gap-3 rounded-xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-fg">Exportar meus dados</p>
                    <p className="text-[13px] text-muted">Baixe uma cópia completa em JSON.</p>
                  </div>
                  <Button variant="outline" leftIcon={<Download className="size-4" />} loading={busy === 'export'} onClick={() => void exportData()}>
                    Exportar
                  </Button>
                </div>
                <div className="flex flex-col gap-3 rounded-xl border border-line p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-fg">{user.isDemo ? 'Restaurar dados de demonstração' : 'Carregar dados de exemplo'}</p>
                    <p className="text-[13px] text-muted">Preenche todos os módulos com dados fictícios para explorar.</p>
                  </div>
                  <Button variant="outline" loading={busy === 'sample'} onClick={() => void loadSample()}>
                    {user.isDemo ? 'Restaurar' : 'Carregar exemplos'}
                  </Button>
                </div>
                <div className="flex flex-col gap-3 rounded-xl border border-danger/30 bg-danger-soft/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-fg">Apagar todos os dados</p>
                    <p className="text-[13px] text-muted">Mantém a conta, mas remove todo o conteúdo.</p>
                  </div>
                  <Button variant="danger" leftIcon={<Trash2 className="size-4" />} loading={busy === 'clear'} onClick={() => void clearData()}>
                    Apagar dados
                  </Button>
                </div>
                {!user.isDemo && (
                  <div className="flex flex-col gap-3 rounded-xl border border-danger/30 bg-danger-soft/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-fg">Excluir conta</p>
                      <p className="text-[13px] text-muted">Remove sua conta e todos os dados permanentemente.</p>
                    </div>
                    <Button variant="danger" loading={busy === 'delete'} onClick={() => void deleteAccount()}>
                      Excluir conta
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  )
}
