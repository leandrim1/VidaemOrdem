import { Accordion } from '@/components/ui/Accordion'
import { Container, SectionHeading } from './SectionHeading'

const FAQ = [
  { question: 'Preciso entender de finanças ou produtividade?', answer: 'Não. O Vida em Ordem foi feito para ser simples desde o primeiro minuto. O desafio de 7 dias guia você passo a passo.' },
  { question: 'Funciona no celular?', answer: 'Sim. A plataforma é totalmente responsiva e funciona no navegador do celular, tablet e computador — sem instalar nada.' },
  { question: 'Meus dados estão seguros?', answer: 'Sim. Senhas são armazenadas com criptografia, seus dados ficam separados por conta e você pode exportá-los ou apagá-los quando quiser.' },
  { question: 'Posso cancelar quando quiser?', answer: 'Pode. Não há fidelidade nos planos semanal e mensal e, nos primeiros 7 dias, você tem garantia incondicional de reembolso.' },
  { question: 'Vocês se conectam ao meu banco?', answer: 'Não nesta versão. Você registra as movimentações manualmente em segundos — o que, inclusive, aumenta a consciência sobre os gastos.' },
  { question: 'Posso testar antes de criar uma conta?', answer: 'Sim! Na tela de login, use “Entrar como demonstração” para explorar um painel completo com dados fictícios.' },
]

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16 py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading id="faq-title" eyebrow="Dúvidas frequentes" title="Perguntas frequentes" />
        <Accordion items={FAQ} className="mt-12" />
      </Container>
    </section>
  )
}
