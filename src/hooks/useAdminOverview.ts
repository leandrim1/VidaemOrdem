import { useCallback, useEffect, useState } from 'react'
import type { AsyncStatus } from '@/types'
import { adminService, type AdminOverview } from '@/services/adminService'
import { getErrorMessage } from '@/services/errors'

export function useAdminOverview() {
  const [data, setData] = useState<AdminOverview | null>(null)
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      setData(await adminService.getOverview())
      setStatus('success')
    } catch (err) {
      setError(getErrorMessage(err))
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { data, status, error, reload: load, isLoading: status === 'idle' || status === 'loading' }
}
