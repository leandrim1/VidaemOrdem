import { useMemo, useState } from 'react'
import { DollarSign, ShoppingCart, Trophy, UserCheck, UserPlus, Users, type LucideIcon } from 'lucide-react'
import type { AdminMetric, AdminUser, AdminUserStatus } from '@/types'
import { useAdminOverview } from '@/hooks/useAdminOverview'
import { formatCurrency, formatDate, formatNumber, formatPercent } from '@/utils/format'
import { Avatar } from '@/components/ui/Avatar'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { Card, CardHeader } from '@/components/ui/Card'
import { ChartCard } from '@/components/ui/ChartCard'
import { DataTable, type Column } from '@/components/ui/DataTable'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { StatCard, type StatTone } from '@/components/ui/StatCard'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States'
import { FunnelChart, PlanDonut, RevenueChart, SignupsChart } from '@/components/charts/AdminCharts'

const METRIC_STYLE: Array<{ icon: LucideIcon; tone: StatTone }> = [
  { icon: Users, tone: 'primary' },
  { icon: UserCheck, tone: 'success' },
  { icon: UserPlus, tone: 'primary' },
  { icon: DollarSign, tone: 'success' },
  { icon: ShoppingCart, tone: 'warning' },
  { icon: Trophy, tone: 'warning' },
]

const STATUS_TONE: Record<AdminUserStatus, BadgeTone> = { ativo: 'success', trial: 'primary', inativo: 'neutral', cancelado: 'danger' }
const STATUS_LABEL: Record<AdminUserStatus, string> = { ativo: 'Ativo', trial: 'Teste', inativo: 'Inativo', cancelado: 'Cancelado' }
const PLAN_LABEL = { mensal: 'Mensal', anual: 'Anual', trial: 'Teste grátis' } as const

function formatMetric(metric: AdminMetric) {
  if (metric.format === 'currency') return formatCurrency(metric.value, { cents: false })
  if (metric.format === 'percent') return formatPercent(metric.value)
  return formatNumber(metric.value)
}

export default function AdminDashboardPage() {
  const { data, status, error, isLoading, reload } = useAdminOverview()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const users = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data?.users ?? []).filter((u) => (!statusFilter || u.status === statusFilter) && (!q || u.name.toLowerCase().includes(q) || u.email.includes(q)))
  }, [data, query, statusFilter])

  const columns = useMemo<Column<AdminUser>[]>(
    () => [
      {
        key: 'name',
        header: 'Usuário',
        sortValue: (u) => u.name,
        cell: (u) => (
          <div className="flex items-center gap-3">
            <Avatar name={u.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate font-semibold text-fg">{u.name}</p>
              <p className="truncate text-xs text-muted">{u.email}</p>
            </div>
          </div>
        ),
      },
      { key: 'plan', header: 'Plano', sortValue: (u) => u.plan, cell: (u) => PLAN_LABEL[u.plan] },
      { key: 'status', header: 'Status', sortValue: (u) => u.status, cell: (u) => <Badge tone={STATUS_TONE[u.status]} dot>{STATUS_LABEL[u.status]}</Badge> },
      {
        key: 'challenge',
        header: 'Desafio',
        hideBelow: 'lg',
        sortValue: (u) => u.challengeProgress,
        cell: (u) => (
          <div className="flex w-32 items-center gap-2">
            <ProgressBar value={(u.challengeProgress / 7) * 100} size="xs" label={`Desafio de ${u.name}`} animate={false} className="flex-1" />
            <span className="vo-tabular text-xs text-muted">{u.challengeProgress}/7</span>
          </div>
        ),
      },
      { key: 'joined', header: 'Cadastro', sortValue: (u) => u.joinedAt, cell: (u) => <span className="vo-tabular">{formatDate(u.joinedAt, 'dd/MM/yyyy')}</span> },
      { key: 'active', header: 'Último acesso', hideBelow: 'xl', sortValue: (u) => u.lastActiveAt, cell: (u) => <span className="vo-tabular">{formatDate(u.lastActiveAt, 'dd/MM/yyyy')}</span> },
    ],
    [],
  )

  return (
    <>
      <PageHeader documentTitle="Admin" title="Visão geral do negócio" description="Métricas de crescimento, receita e engajamento (dados fictícios)." />
      {status === 'error' ? (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      ) : isLoading || !data ? (
        <LoadingState variant="page" />
      ) : (
        <div className="animate-fade-in space-y-5">
          <section id="visao-geral" aria-label="Indicadores" className="grid scroll-mt-24 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {data.metrics.map((metric, index) => {
              const { icon: Icon, tone } = METRIC_STYLE[index] ?? METRIC_STYLE[0]
              return <StatCard key={metric.label} label={metric.label} value={formatMetric(metric)} icon={<Icon />} tone={tone} delta={{ value: metric.delta, label: 'vs. mês anterior' }} />
            })}
          </section>

          <section id="receita" className="grid scroll-mt-24 grid-cols-1 gap-5 xl:grid-cols-3">
            <ChartCard className="xl:col-span-2" title="Receita mensal" description="Últimos 12 meses" summary={data.revenue.map((r) => `${r.label}: ${r.receita}`).join('; ')}>
              <RevenueChart data={data.revenue} />
            </ChartCard>
            <ChartCard title="Distribuição de planos" description="Base atual de assinantes">
              <PlanDonut data={data.plans} />
            </ChartCard>
          </section>

          <section id="desafio" className="grid scroll-mt-24 grid-cols-1 gap-5 xl:grid-cols-2">
            <ChartCard title="Novos cadastros por semana" description="Últimas 12 semanas" summary={data.signups.map((s) => `${s.label}: ${s.cadastros}`).join('; ')}>
              <SignupsChart data={data.signups} />
            </ChartCard>
            <ChartCard title="Funil do desafio de 7 dias" description={`Taxa de conclusão: ${formatPercent((data.funnel[6].usuarios / data.funnel[0].usuarios) * 100)}`}>
              <FunnelChart data={data.funnel} />
            </ChartCard>
          </section>

          <section id="usuarios" className="scroll-mt-24">
            <Card padding="none">
              <div className="flex flex-col gap-3 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
                <CardHeader title="Usuários" description={`${users.length} de ${data.users.length} usuários`} className="mb-0" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[480px]">
                  <SearchInput value={query} onChange={setQuery} placeholder="Buscar por nome ou e-mail…" />
                  <Select
                    aria-label="Filtrar por status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    options={[{ value: '', label: 'Todos os status' }, ...(Object.keys(STATUS_LABEL) as AdminUserStatus[]).map((s) => ({ value: s, label: STATUS_LABEL[s] }))]}
                  />
                </div>
              </div>
              <div className="border-t border-line">
                <DataTable
                  caption="Usuários da plataforma"
                  columns={columns}
                  rows={users}
                  getRowId={(u) => u.id}
                  pageSize={8}
                  initialSort={{ key: 'joined', direction: 'desc' }}
                  mobileCard={(u) => (
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-fg">{u.name}</p>
                        <p className="truncate text-xs text-muted">
                          {PLAN_LABEL[u.plan]} · desde {formatDate(u.joinedAt, 'dd/MM/yy')}
                        </p>
                      </div>
                      <Badge tone={STATUS_TONE[u.status]} dot>
                        {STATUS_LABEL[u.status]}
                      </Badge>
                    </div>
                  )}
                  empty={<EmptyState icon={<Users />} title="Nenhum usuário encontrado" description="Ajuste a busca ou o filtro de status." />}
                />
              </div>
            </Card>
          </section>
        </div>
      )}
    </>
  )
}
