import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storageKeys } from '@/lib/storage'

export type ThemePreference = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
}

/** Preferência de tema do dispositivo (a chave é lida também no index.html para evitar flash). */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: storageKeys.theme, version: 1 },
  ),
)

export function resolveTheme(theme: ThemePreference): 'light' | 'dark' {
  if (theme !== 'system') return theme
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
