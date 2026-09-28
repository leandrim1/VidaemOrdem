import { useEffect } from 'react'

const BASE = 'Vida em Ordem'

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : `${BASE} — Organize sua vida em um só lugar`
  }, [title])
}
