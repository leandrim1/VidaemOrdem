import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PATHS } from '@/routes/paths'
import { buttonClasses } from '@/components/ui/Button'

export default function NotFoundPage() {
  useDocumentTitle('Página não encontrada')
  const { user } = useAuth()
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary-soft text-primary-ink">
        <Compass className="size-7" aria-hidden />
      </span>
      <p className="mt-6 text-sm font-semibold text-primary-ink">Erro 404</p>
      <h1 className="mt-2 text-3xl font-extrabold text-fg">Esta página não existe</h1>
      <p className="mt-3 max-w-md text-muted">O endereço pode ter mudado ou sido digitado incorretamente. Vamos colocar você de volta no caminho.</p>
      <Link to={user ? PATHS.app : PATHS.home} className={buttonClasses('primary', 'lg', 'mt-8')}>
        <ArrowLeft className="size-4" aria-hidden />
        {user ? 'Voltar ao painel' : 'Voltar ao início'}
      </Link>
    </div>
  )
}
