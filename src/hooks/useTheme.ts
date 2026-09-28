import { useEffect, useSyncExternalStore } from 'react'
import { useThemeStore, type ThemePreference } from '@/stores/themeStore'

const query = '(prefers-color-scheme: dark)'

function subscribe(callback: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function useSystemDark(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export function useTheme() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const systemDark = useSystemDark()
  const resolved: 'light' | 'dark' = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme
  return {
    theme,
    resolved,
    setTheme: (next: ThemePreference) => setTheme(next),
    toggle: () => setTheme(resolved === 'dark' ? 'light' : 'dark'),
  }
}

/** Aplica a classe `dark` no <html> sempre que o tema efetivo mudar. */
export function useApplyTheme() {
  const { resolved } = useTheme()
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolved === 'dark')
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute('content', resolved === 'dark' ? '#0B1120' : '#F8FAFC')
    })
  }, [resolved])
}
