import { subDays } from 'date-fns'
import type { Challenge } from '@/types'

interface DayTemplate {
  title: string
  description: string
  tip: string
  items: string[]
}

const DAYS: DayTemplate[] = [
  {
    title: 'Organize suas finanças',
    description: 'Descubra para onde vai o seu dinheiro. Clareza é o primeiro passo para decidir melhor.',
    tip: 'Não tente ser perfeito: uma estimativa honesta hoje vale mais que uma planilha impecável nunca feita.',
    items: ['Registrar todas as receitas do mês', 'Listar os gastos fixos', 'Anotar os gastos variáveis da última semana', 'Definir um limite de gastos para o mês'],
  },
  {
    title: 'Organize suas contas',
    description: 'Reúna boletos, faturas e vencimentos em um só lugar para nunca mais pagar juros por esquecimento.',
    tip: 'Agrupe os vencimentos perto do dia em que você recebe — fica muito mais fácil.',
    items: ['Cadastrar todas as contas do mês', 'Marcar as contas já pagas', 'Ativar lembretes de vencimento', 'Revisar as assinaturas ativas'],
  },
  {
    title: 'Organize sua rotina',
    description: 'Monte uma semana realista, com espaço para o que importa — inclusive descanso.',
    tip: 'Blocos de tempo funcionam melhor que listas infinitas. Proteja 2 horas por dia para o que é importante.',
    items: ['Mapear compromissos fixos da semana', 'Definir horários para as tarefas importantes', 'Reservar um tempo para você', 'Escolher 1 hábito para começar'],
  },
  {
    title: 'Defina suas metas',
    description: 'Transforme desejos em metas com valor, prazo e um primeiro passo concreto.',
    tip: 'Metas pequenas e frequentes geram mais motivação do que uma meta gigante e distante.',
    items: ['Escrever 3 objetivos para os próximos 12 meses', 'Definir valor e prazo para cada meta', 'Calcular quanto guardar por mês', 'Criar as metas no Vida em Ordem'],
  },
  {
    title: 'Organize seus documentos',
    description: 'Saiba exatamente onde está cada documento importante e quando ele vence.',
    tip: 'Uma pasta física por categoria + uma cópia digital resolvem 90% dos sustos.',
    items: ['Reunir documentos pessoais', 'Verificar datas de validade', 'Registrar onde cada documento está guardado', 'Digitalizar os mais importantes'],
  },
  {
    title: 'Organize sua vida digital',
    description: 'Menos notificações, mais foco. Deixe celular, e-mail e arquivos trabalharem a seu favor.',
    tip: 'Desligue as notificações de apps que não são de pessoas. Seu foco agradece.',
    items: ['Apagar apps que não usa', 'Desativar notificações desnecessárias', 'Zerar ou organizar a caixa de entrada', 'Configurar backup automático'],
  },
  {
    title: 'Crie seu sistema de manutenção',
    description: 'Organização não é um evento, é um sistema. Defina rituais simples para manter tudo em ordem.',
    tip: 'Uma revisão semanal de 15 minutos mantém tudo o que você construiu nesta semana.',
    items: ['Agendar uma revisão semanal', 'Agendar uma revisão mensal das finanças', 'Escolher um checklist para repetir todo mês', 'Comemorar sua evolução!'],
  },
]

export function createChallenge(options: { completedDays?: number; partialItems?: number; startedDaysAgo?: number } = {}): Challenge {
  const { completedDays = 0, partialItems = 0, startedDaysAgo = 0 } = options
  const start = subDays(new Date(), startedDaysAgo)
  return {
    id: 'desafio-7-dias',
    title: '7 Dias para Colocar sua Vida em Ordem',
    startedAt: start.toISOString(),
    days: DAYS.map((template, index) => {
      const dayNumber = index + 1
      const completed = dayNumber <= completedDays
      return {
        day: dayNumber,
        title: template.title,
        description: template.description,
        tip: template.tip,
        items: template.items.map((label, itemIndex) => ({
          id: `d${dayNumber}-${itemIndex + 1}`,
          label,
          done: completed || (dayNumber === completedDays + 1 && itemIndex < partialItems),
        })),
        completedAt: completed ? subDays(new Date(), startedDaysAgo - index).toISOString() : undefined,
      }
    }),
  }
}

/** Demo: dias 1 e 2 concluídos, dia 3 em andamento. */
export const createMockChallenge = () => createChallenge({ completedDays: 2, partialItems: 1, startedDaysAgo: 4 })
