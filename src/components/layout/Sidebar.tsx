import { Link, NavLink } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useGamification } from '@/hooks/useGamification'
import { PATHS } from '@/routes/paths'
import { Logo, LogoMark } from '@/components/ui/Logo'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Skeleton } from '@/components/ui/States'
import { FOOTER_NAV, NAV_GROUPS, type NavItem } from './navigation'

interface SidebarProps {
  collapsed?: boolean
  onNavigate?: () => void
  className?: string
}

function SidebarLink({ item, collapsed, onNavigate }: { item: NavItem; collapsed?: boolean; onNavigate?: () => void }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.href}
      end={item.end}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-[10px] text-sm font-medium transition-colors',
          collapsed ? 'size-10 justify-center' : 'h-9 px-3',
          isActive ? 'bg-primary-soft text-primary-ink' : 'text-fg-soft hover:bg-surface-2 hover:text-fg',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn('size-[18px] shrink-0', isActive ? 'text-primary-ink' : 'text-muted group-hover:text-fg')} aria-hidden />
          {!collapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  )
}

function LevelCard({ onNavigate }: { onNavigate?: () => void }) {
  const { level, points, progress, nextLevel, isLoading } = useGamification()
  if (isLoading) {
    return (
      <div className="space-y-2.5 rounded-xl border border-line bg-surface-2/60 p-3" aria-hidden>
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-1 w-full" />
      </div>
    )
  }
  return (
    <Link
      to={PATHS.profile}
      onClick={onNavigate}
      className="block rounded-xl border border-line bg-surface-2/60 p-3 transition-colors hover:border-line-strong"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-warning-soft text-warning-ink">
          <Sparkles className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-fg">
            Nível {level.level} · {level.name}
          </p>
          <p className="vo-tabular text-xs text-muted">{points} pontos</p>
        </div>
      </div>
      <ProgressBar value={progress} size="xs" label="Progresso para o próximo nível" className="mt-2.5" />
      <p className="mt-1 text-[11px] text-muted">{nextLevel ? `${nextLevel.minPoints - points} pts para ${nextLevel.name}` : 'Nível máximo alcançado!'}</p>
    </Link>
  )
}

export function Sidebar({ collapsed, onNavigate, className }: SidebarProps) {
  return (
    <div className={cn('flex h-full flex-col bg-surface', className)}>
      <div className={cn('flex h-16 shrink-0 items-center', collapsed ? 'justify-center' : 'px-5')}>
        <Link to={PATHS.app} onClick={onNavigate} aria-label="Vida em Ordem — visão geral" className="rounded-lg">
          {collapsed ? <LogoMark /> : <Logo />}
        </Link>
      </div>

      <div className="vo-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto">
        <nav aria-label="Navegação principal" className={cn('pb-3', collapsed ? 'px-2.5' : 'px-3')}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mt-3 first:mt-0">
              {collapsed ? (
                <div className="mx-auto mb-2 h-px w-6 bg-line" aria-hidden />
              ) : (
                <p className="mb-1 px-3 text-[11px] font-semibold tracking-wider text-muted uppercase">{group.label}</p>
              )}
              <ul className={cn('space-y-0.5', collapsed && 'flex flex-col items-center')}>
                {group.items.map((item) => (
                  <li key={item.href}>
                    <SidebarLink item={item} collapsed={collapsed} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={cn('mt-auto border-t border-line py-3', collapsed ? 'px-2.5' : 'px-3')}>
          {!collapsed && (
            <div className="mb-2">
              <LevelCard onNavigate={onNavigate} />
            </div>
          )}
          <ul className={cn('space-y-0.5', collapsed && 'flex flex-col items-center')}>
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <SidebarLink item={item} collapsed={collapsed} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
