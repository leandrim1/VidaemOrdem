import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useApplyTheme } from '@/hooks/useTheme'
import { router } from '@/routes/router'
import { useAuthStore } from '@/stores/authStore'
import { ConfirmHost } from '@/components/ui/ConfirmDialog'
import { Toaster } from '@/components/ui/Toast'

export default function App() {
  useApplyTheme()
  const init = useAuthStore((s) => s.init)

  useEffect(() => {
    void init()
  }, [init])

  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
      <ConfirmHost />
    </>
  )
}
