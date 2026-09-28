import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { PATHS } from '@/routes/paths'
import { buttonClasses } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'

const LINKS = [
  { href: '#recursos', label: 'Recursos' },
  { href: '#plataforma', label: 'Plataforma' },
  { href: '#desafio', label: 'Desafio 7 dias' },
  { href: '#precos', label: 'Preços' },
  { href: '#faq', label: 'Dúvidas' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user } = useAuth()
  const { resolved, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={cn('fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,box-shadow]', scrolled || open ? 'border-b border-line bg-surface/90 backdrop-blur-md' : 'border-b border-transparent')}>
      <nav aria-label="Principal" className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 sm:px-8">
        <Link to={PATHS.home} className="rounded-lg" aria-label="Vida em Ordem — início">
          <Logo />
        </Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-fg-soft transition-colors hover:bg-surface-2 hover:text-fg">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggle}
            aria-label={resolved === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
            className="flex size-10 items-center justify-center rounded-[10px] text-muted hover:bg-surface-2 hover:text-fg"
          >
            {resolved === 'dark' ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>
          {user ? (
            <span className="hidden sm:block">
              <Link to={PATHS.app} className={buttonClasses('primary', 'md')}>
                Ir para o painel
              </Link>
            </span>
          ) : (
            <>
              <Link to={PATHS.login} className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-fg-soft hover:text-fg sm:block">
                Entrar
              </Link>
              <span className="hidden sm:block">
                <Link to={PATHS.register} className={buttonClasses('primary', 'md')}>
                  Começar agora
                </Link>
              </span>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            className="flex size-10 items-center justify-center rounded-[10px] text-fg hover:bg-surface-2 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div id="menu-mobile" className="animate-fade-in border-t border-line bg-surface px-5 pt-3 pb-6 lg:hidden">
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base font-medium text-fg-soft hover:bg-surface-2 hover:text-fg">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {user ? (
              <Link to={PATHS.app} className={buttonClasses('primary', 'lg', 'col-span-2')}>
                Ir para o painel
              </Link>
            ) : (
              <>
                <Link to={PATHS.login} className={buttonClasses('outline', 'lg')}>
                  Entrar
                </Link>
                <Link to={PATHS.register} className={buttonClasses('primary', 'lg')}>
                  Começar agora
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
