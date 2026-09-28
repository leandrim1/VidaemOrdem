import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CircleCheck, Quote } from 'lucide-react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PATHS } from '@/routes/paths'
import { Logo } from '@/components/ui/Logo'

interface AuthLayoutProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
  documentTitle: string
}

const HIGHLIGHTS = ['Finanças, contas e cartões em um só lugar', 'Tarefas, rotina e hábitos que funcionam', 'Desafio guiado de 7 dias para começar']

export function AuthLayout({ title, description, children, footer, documentTitle }: AuthLayoutProps) {
  useDocumentTitle(documentTitle)
  return (
    <div className="grid min-h-dvh bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,640px)]">
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <Link to={PATHS.home} className="w-fit rounded-lg" aria-label="Vida em Ordem — página inicial">
          <Logo />
        </Link>
        <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
          <h1 className="text-[28px] font-extrabold text-fg">{title}</h1>
          <p className="mt-2 text-[15px] text-muted">{description}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-center text-sm text-muted">{footer}</div>}
        </main>
        <p className="text-xs text-muted">© {new Date().getFullYear()} Vida em Ordem. Seus dados ficam protegidos.</p>
      </div>

      <aside className="relative hidden overflow-hidden bg-navy p-12 text-white lg:flex lg:flex-col lg:justify-between dark:bg-[#080d19]">
        <div className="pointer-events-none absolute -top-40 -right-40 size-[480px] rounded-full bg-primary/25 blur-3xl" aria-hidden />
        <div className="relative">
          <p className="text-sm font-semibold tracking-wider text-blue-300 uppercase">Organização pessoal, sem complicação</p>
          <h2 className="mt-4 max-w-md text-4xl leading-tight font-extrabold">Tudo o que importa na sua vida, finalmente em ordem.</h2>
          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-200">
                <CircleCheck className="size-5 shrink-0 text-blue-400" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <figure className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
          <Quote className="size-6 text-blue-400" aria-hidden />
          <blockquote className="mt-3 text-[15px] leading-relaxed text-slate-200">
            “Em uma semana eu descobri para onde ia meu dinheiro e parei de esquecer contas. Hoje tenho uma reserva e uma rotina que funciona.”
          </blockquote>
          <figcaption className="mt-4 text-sm">
            <span className="font-semibold text-white">Juliana Castro</span>
            <span className="text-slate-400"> · designer, São Paulo</span>
          </figcaption>
        </figure>
      </aside>
    </div>
  )
}
