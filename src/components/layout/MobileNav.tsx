import { NavLink } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/cn'
import { MOBILE_NAV } from './navigation'

/** Navegação inferior com as áreas principais (apenas mobile). */
export function MobileNav({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <nav
      aria-label="Navegação rápida"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {MOBILE_NAV.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.href}>
              <NavLink
                to={item.href}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors',
                    isActive ? 'text-primary-ink' : 'text-muted hover:text-fg',
                  )
                }
              >
                <Icon className="size-5" aria-hidden />
                {item.label}
              </NavLink>
            </li>
          )
        })}
        <li>
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted hover:text-fg"
          >
            <Menu className="size-5" aria-hidden />
            Mais
          </button>
        </li>
      </ul>
    </nav>
  )
}
