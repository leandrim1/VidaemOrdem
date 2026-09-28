import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storageKeys } from '@/lib/storage'

interface PreferencesState {
  notificationsEnabled: boolean
  billReminders: boolean
  taskReminders: boolean
  weeklySummary: boolean
  hideValues: boolean
  sidebarCollapsed: boolean
  analytics: boolean
  set: (patch: Partial<Omit<PreferencesState, 'set' | 'toggle'>>) => void
  toggle: (key: PreferenceToggle) => void
}

export type PreferenceToggle =
  | 'notificationsEnabled'
  | 'billReminders'
  | 'taskReminders'
  | 'weeklySummary'
  | 'hideValues'
  | 'sidebarCollapsed'
  | 'analytics'

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      billReminders: true,
      taskReminders: true,
      weeklySummary: false,
      hideValues: false,
      sidebarCollapsed: false,
      analytics: false,
      set: (patch) => set(patch),
      toggle: (key) => set((state) => ({ [key]: !state[key] })),
    }),
    {
      name: storageKeys.preferences,
      version: 1,
      partialize: ({ set: _set, toggle: _toggle, ...rest }) => rest,
    },
  ),
)
