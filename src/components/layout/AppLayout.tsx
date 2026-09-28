import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { LoadingState } from '@/components/ui/States'
import { Header } from './Header'
import { MobileDrawer } from './MobileDrawer'
import { MobileNav } from './MobileNav'
import { Sidebar } from './Sidebar'

/**
 * Layout da área logada.
 * - Desktop (≥1024px): sidebar fixa, recolhível pelo usuário.
 * - Tablet (768–1023px): sidebar em modo compacto (ícones) + gaveta completa.
 * - Mobile (<768px): gaveta + navegação inferior.
 */
export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const collapsed = usePreferencesStore((s) => s.sidebarCollapsed)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="min-h-dvh bg-canvas">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Pular para o conteúdo
      </a>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden border-r border-line md:block',
          'w-[76px]',
          collapsed ? 'lg:w-[76px]' : 'lg:w-[264px]',
        )}
      >
        <div className="h-full lg:hidden">
          <Sidebar collapsed />
        </div>
        <div className="hidden h-full lg:block">
          <Sidebar collapsed={collapsed} />
        </div>
      </aside>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className={cn('flex min-h-dvh min-w-0 flex-col md:pl-[76px]', collapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]')}>
        <Header onOpenMenu={() => setDrawerOpen(true)} />
        <main id="conteudo" tabIndex={-1} className="mx-auto w-full max-w-[1400px] flex-1 px-4 pt-6 pb-28 outline-none sm:px-6 md:pb-12 lg:px-8 lg:pt-8">
          <Suspense fallback={<LoadingState variant="page" />}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      <MobileNav onOpenMenu={() => setDrawerOpen(true)} />
    </div>
  )
}
