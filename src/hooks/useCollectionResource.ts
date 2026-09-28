import { useCallback, useEffect } from 'react'
import type { StoreApi, UseBoundStore } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import type { Entity } from '@/types'
import type { CollectionState } from '@/stores/createCollectionStore'

/** Conecta um componente a um store de coleção, disparando o carregamento inicial. */
export function useCollectionResource<T extends Entity>(useStore: UseBoundStore<StoreApi<CollectionState<T>>>) {
  const { items, status, error, load, create, update, remove, replace } = useStore(
    useShallow((s) => ({
      items: s.items,
      status: s.status,
      error: s.error,
      load: s.load,
      create: s.create,
      update: s.update,
      remove: s.remove,
      replace: s.replace,
    })),
  )

  // Recarrega sempre que o store volta a "idle" (ex.: troca de usuário ou restauração de dados).
  useEffect(() => {
    if (status === 'idle') void load()
  }, [status, load])

  const reload = useCallback(() => load(true), [load])

  return {
    items,
    status,
    error,
    isLoading: status === 'idle' || status === 'loading',
    isError: status === 'error',
    reload,
    create,
    update,
    remove,
    replace,
  }
}
