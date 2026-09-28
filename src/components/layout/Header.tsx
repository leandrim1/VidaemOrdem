import { Eye, EyeOff, Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { IconButton } from '@/components/ui/IconButton'
import { Logo } from '@/components/ui/Logo'
import { TrialChip } from '@/components/billing/TrialChip'
import { NotificationCenter } from './NotificationCenter'
import { QuickAdd } from './QuickAdd'
import { UserMenu } from './UserMenu'

interface HeaderProps {
  onOpenMenu: () => void
}

export function Header({ onOpenMenu }: HeaderProps) {
  const { resolved, toggle } = useTheme()
  const hideValues = usePreferencesStore((s) => s.hideValues)
  const collapsed = usePreferencesStore((s) => s.sidebarCollapsed)
  const togglePref = usePreferencesStore((s) => s.toggle)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-line bg-canvas/85 px-4 backdrop-blur-md sm:px-6">
      <IconButton label="Abrir menu" icon={<Menu />} onClick={onOpenMenu} className="-ml-1.5 lg:hidden" />
      <div className="-ml-1.5 hidden lg:block">
        <IconButton
          label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          icon={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          onClick={() => togglePref('sidebarCollapsed')}
        />
      </div>
      <div className="md:hidden">
        <Logo showText={false} />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
        <div className="mr-1 hidden md:block">
          <TrialChip />
        </div>
        <div className="hidden sm:block">
          <QuickAdd />
        </div>
        <IconButton
          label={hideValues ? 'Mostrar valores' : 'Ocultar valores'}
          icon={hideValues ? <EyeOff /> : <Eye />}
          onClick={() => togglePref('hideValues')}
          aria-pressed={hideValues}
        />
        <IconButton
          label={resolved === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
          icon={resolved === 'dark' ? <Sun /> : <Moon />}
          onClick={toggle}
        />
        <NotificationCenter />
        <div className="ml-1 h-6 w-px bg-line" aria-hidden />
        <UserMenu />
      </div>
    </header>
  )
}
