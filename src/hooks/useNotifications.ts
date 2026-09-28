import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useNotificationStore } from '@/stores/notificationStore'
import { usePreferencesStore } from '@/stores/preferencesStore'

export function useNotifications() {
  const state = useNotificationStore(
    useShallow((s) => ({
      items: s.items,
      status: s.status,
      load: s.load,
      toggleRead: s.toggleRead,
      markRead: s.markRead,
      markAllRead: s.markAllRead,
      remove: s.remove,
      clear: s.clear,
    })),
  )
  const enabled = usePreferencesStore((s) => s.notificationsEnabled)

  const { load, status } = state
  // Recarrega sempre que o store volta a "idle" (ex.: troca de usuário ou restauração de dados).
  useEffect(() => {
    if (status === 'idle') void load()
  }, [status, load])

  const unreadCount = state.items.filter((n) => !n.read).length
  return { ...state, enabled, unreadCount, isLoading: state.status === 'idle' || state.status === 'loading' }
}
