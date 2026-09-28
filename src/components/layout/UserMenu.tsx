import { useNavigate } from 'react-router-dom'
import { ChevronDown, CircleHelp, Gem, LogOut, Settings, ShieldCheck, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'
import { toast } from '@/stores/toastStore'
import { Avatar } from '@/components/ui/Avatar'
import { Dropdown, type DropdownItem } from '@/components/ui/Dropdown'

export function UserMenu() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  if (!user) return null

  const items: DropdownItem[] = [
    { label: 'Meu perfil', icon: <User />, onSelect: () => navigate(PATHS.profile) },
    { label: 'Meu plano', icon: <Gem />, onSelect: () => navigate(PATHS.plan) },
    { label: 'Configurações', icon: <Settings />, onSelect: () => navigate(PATHS.settings) },
    { label: 'Central de ajuda', icon: <CircleHelp />, onSelect: () => navigate(PATHS.help) },
    ...(isAdmin ? [{ label: 'Painel administrativo', icon: <ShieldCheck />, onSelect: () => navigate(PATHS.admin) }] : []),
    {
      label: 'Sair',
      icon: <LogOut />,
      tone: 'danger' as const,
      onSelect: async () => {
        await logout()
        toast.info('Você saiu da sua conta.')
        navigate(PATHS.login, { replace: true })
      },
    },
  ]

  return (
    <Dropdown
      label="Menu da conta"
      items={items}
      header={
        <div className="mb-1 border-b border-line px-2.5 pt-1.5 pb-2.5">
          <p className="truncate text-sm font-semibold text-fg">{user.name}</p>
          <p className="truncate text-xs text-muted">{user.email}</p>
        </div>
      }
      trigger={(props) => (
        <button
          {...props}
          type="button"
          aria-label="Abrir menu da conta"
          className="flex items-center gap-2 rounded-[10px] p-1 pr-1.5 transition-colors hover:bg-surface-2"
        >
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
          <span className="hidden max-w-32 truncate text-sm font-semibold text-fg lg:block">{user.name.split(' ')[0]}</span>
          <ChevronDown className="hidden size-4 text-muted lg:block" aria-hidden />
        </button>
      )}
    />
  )
}
