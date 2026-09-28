import { Suspense, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { ArrowLeft, BarChart3, Menu, Moon, Sun, Trophy, Users, Wallet, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/hooks/useTheme'
import { PATHS } from '@/routes/paths'
import { IconButton } from '@/components/ui/IconButton'
import { LogoMark } from '@/components/ui/Logo'
import { LoadingState } from '@/components/ui/States'
import { UserMenu } from './UserMenu'

const ADMIN_NAV = [
  { label: 'Visão geral', href: '#visao-geral', icon: BarChart3 },
  { label: 'Receita', href: '#receita', icon: Wallet },
  { label: 'Desafio', href: '#desafio', icon: Trophy },
  { label: 'Usuários', href: '#usuarios', icon: Users },
]

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <LogoMark />
        <div className="leading-tight">
          <p className="font-display text-[15px] font-extrabold text-white">Vida em Ordem</p>
          <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Admin</p>
        </div>
      </div>
      <nav aria-label="Navegação administrativa" className="flex-1 px-3 py-4">
        <ul className="space-y-0.5">
          {ADMIN_NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={onNavigate}
                className="flex h-10 items-center gap-3 rounded-[10px] px-3 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <item.icon className="size-[18px]" aria-hidden />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="border-t border-white/10 p-3">
        <NavLink
          to={PATHS.app}
          className="flex h-10 items-center gap-3 rounded-[10px] px-3 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="size-[18px]" aria-hidden />
          Voltar ao aplicativo
        </NavLink>
      </div>
    </div>
  )
}

/** Layout separado para a área administrativa. */
export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const { resolved, toggle } = useTheme()
  return (
    <div className="min-h-dvh bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 bg-navy lg:block dark:border-r dark:border-line dark:bg-[#080d19]">
        <AdminNav />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Fechar menu" className="absolute inset-0 bg-overlay" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-64 animate-slide-in-left bg-navy">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar menu"
              className="absolute top-3.5 right-3 flex size-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10"
            >
              <X className="size-5" />
            </button>
            <AdminNav onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-line bg-canvas/85 px-4 backdrop-blur-md sm:px-6">
          <IconButton label="Abrir menu" icon={<Menu />} onClick={() => setOpen(true)} className="-ml-1.5 lg:hidden" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-fg">Painel administrativo</p>
            <p className="hidden text-xs text-muted sm:block">Dados de demonstração</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Link to={PATHS.app} className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-primary-ink hover:bg-primary-soft sm:block">
              Ir para o app
            </Link>
            <IconButton label={resolved === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'} icon={resolved === 'dark' ? <Sun /> : <Moon />} onClick={toggle} />
            <UserMenu />
          </div>
        </header>
        <main className={cn('mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8')}>
          <Suspense fallback={<LoadingState variant="page" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
