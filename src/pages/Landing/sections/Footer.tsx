import { Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { Logo } from '@/components/ui/Logo'
import { Container } from './SectionHeading'

const COLUMNS = [
  { title: 'Produto', links: [['Recursos', '#recursos'], ['Plataforma', '#plataforma'], ['Desafio 7 dias', '#desafio'], ['Preços', '#precos']] },
  { title: 'Conta', links: [['Criar conta', PATHS.register], ['Entrar', PATHS.login], ['Recuperar senha', PATHS.forgotPassword]] },
  { title: 'Suporte', links: [['Dúvidas frequentes', '#faq'], ['suporte@vidaemordem.app', 'mailto:suporte@vidaemordem.app']] },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">Finanças, tarefas, metas e organização pessoal em um único sistema simples e fácil de usar.</p>
          </div>
          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="text-sm font-semibold text-fg">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith('/') ? (
                      <Link to={href} className="text-sm text-muted hover:text-fg">
                        {label}
                      </Link>
                    ) : (
                      <a href={href} className="text-sm break-all text-muted hover:text-fg">
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Vida em Ordem. Todos os direitos reservados.</p>
          <p>Feito com cuidado no Brasil 🇧🇷</p>
        </div>
      </Container>
    </footer>
  )
}
