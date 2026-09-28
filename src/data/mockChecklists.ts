import type { Checklist, ChecklistIcon, DigitalArea, DigitalItem } from '@/types'

interface ChecklistTemplate {
  id: string
  title: string
  description: string
  icon: ChecklistIcon
  items: string[]
  /** Itens concluídos no perfil de demonstração. */
  demoDone: number
}

const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  {
    id: 'cl-financeiro',
    title: 'Checklist financeiro',
    description: 'O essencial para ter clareza sobre o seu dinheiro e parar de pagar juros.',
    icon: 'finance',
    demoDone: 7,
    items: [
      'Listar todas as fontes de renda',
      'Anotar todas as despesas fixas',
      'Definir um orçamento mensal por categoria',
      'Revisar e cancelar assinaturas que não uso',
      'Negociar dívidas com juros altos',
      'Ativar débito automático das contas fixas',
      'Separar uma conta para a reserva de emergência',
      'Definir quanto investir todo mês',
      'Revisar os limites dos cartões',
      'Agendar uma revisão financeira mensal',
    ],
  },
  {
    id: 'cl-mensal',
    title: 'Checklist mensal',
    description: 'Uma revisão rápida no início de cada mês para manter tudo em dia.',
    icon: 'calendar',
    demoDone: 6,
    items: [
      'Conferir o extrato do mês anterior',
      'Pagar ou agendar todas as contas',
      'Atualizar o progresso das metas',
      'Revisar a fatura dos cartões',
      'Planejar compromissos importantes do mês',
      'Fazer a lista de compras do mês',
      'Fazer backup de fotos e arquivos',
      'Limpar a caixa de entrada do e-mail',
      'Revisar hábitos que quero manter',
      'Definir 3 prioridades para o mês',
    ],
  },
  {
    id: 'cl-casa',
    title: 'Checklist da casa',
    description: 'Tarefas de manutenção que evitam imprevistos e gastos maiores.',
    icon: 'home',
    demoDone: 8,
    items: [
      'Limpar filtros do ar-condicionado',
      'Verificar validade dos alimentos',
      'Organizar a despensa',
      'Trocar lâmpadas queimadas',
      'Revisar o extintor e o gás',
      'Limpar a geladeira',
      'Doar itens que não uso mais',
      'Organizar o guarda-roupa',
      'Limpar caixa d’água (semestral)',
      'Dedetização preventiva (anual)',
    ],
  },
  {
    id: 'cl-viagem',
    title: 'Checklist de viagem',
    description: 'Tudo o que você precisa conferir antes de sair de casa.',
    icon: 'travel',
    demoDone: 3,
    items: [
      'Conferir validade do passaporte/RG',
      'Comprar passagens e reservar hospedagem',
      'Contratar seguro-viagem',
      'Avisar o banco sobre a viagem',
      'Separar documentos e cópias digitais',
      'Montar a mala com antecedência',
      'Levar carregadores e adaptador de tomada',
      'Organizar roteiro e reservas',
      'Deixar plantas e pets com alguém de confiança',
      'Desligar aparelhos da tomada',
    ],
  },
  {
    id: 'cl-mudanca',
    title: 'Checklist de mudança',
    description: 'Um passo a passo para mudar de casa sem estresse.',
    icon: 'moving',
    demoDone: 2,
    items: [
      'Fazer orçamento com 3 transportadoras',
      'Definir a data da mudança',
      'Separar o que vai ser doado ou vendido',
      'Comprar caixas e fita adesiva',
      'Etiquetar caixas por cômodo',
      'Transferir contas de luz, água e internet',
      'Atualizar endereço no banco e em cadastros',
      'Fazer vistoria do imóvel novo',
      'Separar uma mala com itens essenciais',
      'Entregar as chaves do imóvel antigo',
    ],
  },
  {
    id: 'cl-digital',
    title: 'Checklist digital',
    description: 'Segurança e organização para a sua vida online.',
    icon: 'digital',
    demoDone: 9,
    items: [
      'Ativar autenticação em dois fatores',
      'Usar um gerenciador de senhas',
      'Trocar senhas repetidas',
      'Configurar backup automático do celular',
      'Revisar aplicativos com acesso à localização',
      'Cancelar newsletters que não leio',
      'Organizar a área de trabalho do computador',
      'Atualizar o sistema dos dispositivos',
      'Revisar permissões de apps nas redes sociais',
      'Anotar códigos de recuperação em local seguro',
    ],
  },
  {
    id: 'cl-documentos',
    title: 'Checklist de documentos',
    description: 'Tenha seus documentos importantes sempre localizáveis e válidos.',
    icon: 'documents',
    demoDone: 8,
    items: [
      'Reunir RG, CPF e certidões',
      'Verificar validade da CNH',
      'Verificar validade do passaporte',
      'Digitalizar documentos importantes',
      'Guardar comprovantes do Imposto de Renda',
      'Organizar documentos do veículo',
      'Separar contratos (aluguel, trabalho, seguros)',
      'Guardar garantias de eletrodomésticos',
      'Criar uma pasta física por categoria',
      'Compartilhar localização com alguém de confiança',
    ],
  },
]

export function createChecklists(withDemoProgress = false): Checklist[] {
  const created = new Date().toISOString()
  return CHECKLIST_TEMPLATES.map((template) => ({
    id: template.id,
    createdAt: created,
    title: template.title,
    description: template.description,
    icon: template.icon,
    items: template.items.map((label, index) => ({
      id: `${template.id}-${index + 1}`,
      label,
      done: withDemoProgress && index < template.demoDone,
    })),
  }))
}

export const createMockChecklists = () => createChecklists(true)

const DIGITAL_TEMPLATE: Record<DigitalArea, string[]> = {
  celular: [
    'Apagar aplicativos que não uso',
    'Organizar a tela inicial por categorias',
    'Desativar notificações desnecessárias',
    'Ativar backup automático',
    'Liberar espaço de armazenamento',
  ],
  computador: [
    'Limpar a área de trabalho',
    'Desinstalar programas não utilizados',
    'Atualizar o sistema operacional',
    'Organizar favoritos do navegador',
    'Configurar backup em nuvem',
  ],
  email: [
    'Cancelar inscrições em newsletters',
    'Criar marcadores/pastas principais',
    'Zerar a caixa de entrada',
    'Configurar filtros automáticos',
    'Revisar a assinatura de e-mail',
  ],
  arquivos: [
    'Criar estrutura de pastas padrão',
    'Renomear arquivos importantes',
    'Excluir arquivos duplicados',
    'Mover downloads antigos',
    'Centralizar documentos na nuvem',
  ],
  fotos: [
    'Apagar fotos repetidas e prints',
    'Criar álbuns por ano/evento',
    'Fazer backup das fotos',
    'Favoritar as melhores fotos',
    'Liberar espaço após o backup',
  ],
}

/** Itens concluídos no perfil de demonstração (20 de 25). */
const DIGITAL_DEMO_DONE: Record<DigitalArea, number> = { celular: 5, computador: 4, email: 4, arquivos: 4, fotos: 3 }

export const DIGITAL_AREAS: Array<{ value: DigitalArea; label: string; description: string }> = [
  { value: 'celular', label: 'Celular', description: 'Apps, notificações e armazenamento' },
  { value: 'computador', label: 'Computador', description: 'Sistema, programas e área de trabalho' },
  { value: 'email', label: 'E-mail', description: 'Caixa de entrada sob controle' },
  { value: 'arquivos', label: 'Arquivos', description: 'Pastas, nomes e nuvem' },
  { value: 'fotos', label: 'Fotos', description: 'Álbuns, backup e espaço' },
]

export function createDigitalItems(withDemoProgress = false): DigitalItem[] {
  return (Object.keys(DIGITAL_TEMPLATE) as DigitalArea[]).flatMap((area) =>
    DIGITAL_TEMPLATE[area].map((label, index) => ({
      id: `dg-${area}-${index + 1}`,
      area,
      label,
      done: withDemoProgress && index < DIGITAL_DEMO_DONE[area],
    })),
  )
}

export const createMockDigitalItems = () => createDigitalItems(true)
