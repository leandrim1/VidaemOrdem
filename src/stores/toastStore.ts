import { create } from 'zustand'
import { createId } from '@/lib/id'

export type ToastVariant = 'success' | 'error' | 'info' | 'reward'

export interface ToastItem {
  id: string
  variant: ToastVariant
  title: string
  description?: string
  duration: number
}

interface ToastState {
  toasts: ToastItem[]
  show: (toast: Omit<ToastItem, 'id' | 'duration'> & { duration?: number }) => string
  dismiss: (id: string) => void
}

const MAX_TOASTS = 4

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  show(toast) {
    const id = createId()
    set((state) => ({ toasts: [...state.toasts, { duration: 3800, ...toast, id }].slice(-MAX_TOASTS) }))
    return id
  },
  dismiss(id) {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
  },
}))

/** API imperativa para disparar toasts de qualquer lugar (hooks, handlers). */
export const toast = {
  success: (title: string, description?: string) => useToastStore.getState().show({ variant: 'success', title, description }),
  error: (title: string, description?: string) => useToastStore.getState().show({ variant: 'error', title, description, duration: 5200 }),
  info: (title: string, description?: string) => useToastStore.getState().show({ variant: 'info', title, description }),
  reward: (title: string, description?: string) => useToastStore.getState().show({ variant: 'reward', title, description }),
}

export const MESSAGES = {
  saved: 'Alterações salvas com sucesso.',
  deleted: 'Item excluído.',
} as const
