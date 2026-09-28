import { Link } from 'react-router-dom'
import { BookOpen, Mail, MessageCircle, ShieldCheck, Trophy, Wallet } from 'lucide-react'
import { PATHS } from '@/routes/paths'
import { Accordion } from '@/components/ui/Accordion'
import { Card } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'

const GUIDES = [
  { icon: Trophy, title: 'Comece pelo desafio', text: '7 dias guiados para organizar cada área da sua vida.', href: PATHS.challenge },
  { icon: Wallet, title: 'Organize suas finanças', text: 'Registre receitas e despesas e acompanhe seu saldo.', href: PATHS.finance },
  { icon: BookOpen, title: 'Use os checklists', text: 'Modelos prontos para casa, viagem, mudança e mais.', href: PATHS.checklists },
]

const FAQ = [
  { question: 'Meus dados ficam salvos onde?', answer: 'Nesta versão, seus dados ficam armazenados no navegador deste dispositivo, separados por conta. Em breve teremos sincronização segura na nuvem entre dispositivos.' },
  { question: 'Como funcionam os pontos e níveis?', answer: 'Você ganha pontos ao concluir tarefas (+10), hábitos (+5), checklists (+20), metas (+50) e o desafio de 7 dias (+100). São 5 níveis: Começando, Em organização, Organizado, Consistente e Vida em Ordem.' },
  { question: 'Como escondo meus valores em público?', answer: 'Clique no ícone de olho no topo da tela ou ative "Ocultar valores" em Configurações → Privacidade. Todos os saldos e valores ficam mascarados.' },
  { question: 'Posso exportar meus dados?', answer: 'Sim. Em Configurações → Privacidade → Seus dados, use "Exportar" para baixar uma cópia completa em JSON.' },
  { question: 'O índice de organização é calculado como?', answer: 'É a média de cinco áreas: contas em dia, tarefas concluídas, hábitos da semana, organização digital e checklists. Ele evolui conforme você usa o app.' },
  { question: 'Vocês guardam meus documentos?', answer: 'Não. Registramos apenas metadados (nome, validade e onde o documento está guardado). Nenhum arquivo ou número sensível é enviado.' },
]

export default function HelpPage() {
  return (
    <>
      <PageHeader title="Central de ajuda" description="Tire dúvidas e aprenda a aproveitar o Vida em Ordem ao máximo." />
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {GUIDES.map((guide) => (
            <Link key={guide.title} to={guide.href} className="group rounded-card border border-line bg-surface p-5 shadow-card transition-[border-color,box-shadow] hover:border-line-strong hover:shadow-raised">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary-ink">
                <guide.icon className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-[15px] font-bold text-fg">{guide.title}</h2>
              <p className="mt-1 text-sm text-muted">{guide.text}</p>
            </Link>
          ))}
        </div>

        <section aria-labelledby="faq-title">
          <h2 id="faq-title" className="mb-3 text-lg font-bold text-fg">
            Perguntas frequentes
          </h2>
          <Accordion items={FAQ} />
        </section>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success-ink">
              <MessageCircle className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-[15px] font-bold text-fg">Fale com a gente</h2>
              <p className="mt-1 text-sm text-muted">Atendimento de segunda a sexta, das 9h às 18h.</p>
              <a href="mailto:suporte@vidaemordem.app" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink hover:underline">
                <Mail className="size-4" aria-hidden /> suporte@vidaemordem.app
              </a>
            </div>
          </Card>
          <Card className="flex items-start gap-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-ink">
              <ShieldCheck className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-[15px] font-bold text-fg">Privacidade e segurança</h2>
              <p className="mt-1 text-sm text-muted">Senhas com criptografia, dados separados por conta e controle total para exportar ou apagar tudo.</p>
              <Link to={PATHS.settings} className="mt-3 inline-flex text-sm font-semibold text-primary-ink hover:underline">
                Ver configurações de privacidade
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
