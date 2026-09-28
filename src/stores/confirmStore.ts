import { create } from 'zustand'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'primary'
}

interface ConfirmRequest extends ConfirmOptions {
  resolve: (confirmed: boolean) => void
}

interface ConfirmState {
  request: ConfirmRequest | null
  confirm: (options: ConfirmOptions) => Promise<boolean>
  settle: (confirmed: boolean) => void
}

/** Diálogo de confirmação global, usado de forma assíncrona: `await confirm({...})`. */
export const useConfirmStore = create<ConfirmState>()((set, get) => ({
  request: null,
  confirm(options) {
    get().request?.resolve(false)
    return new Promise<boolean>((resolve) => set({ request: { ...options, resolve } }))
  },
  settle(confirmed) {
    get().request?.resolve(confirmed)
    set({ request: null })
  },
}))

export const confirm = (options: ConfirmOptions) => useConfirmStore.getState().confirm(options)
