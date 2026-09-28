import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { ArrowRight, ChartLine as LineChart } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { PATHS } from '@/routes/paths'
import { capitalize, greeting, locale } from '@/utils/date'
import { firstName } from '@/utils/format'
import { ChartCard } from '@/components/ui/ChartCard'
import { PageHeader } from '@/components/ui/PageHeader'
import { buttonClasses } from '@/components/ui/Button'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States'
import { IncomeExpenseAreaChart } from '@/components/charts/IncomeExpenseAreaChart'
import { LEGEND_INCOME_EXPENSE } from '@/components/charts/chartTheme'
import { BalanceCard } from '@/components/dashboard/BalanceCard'
import { ChallengeBanner } from '@/components/dashboard/ChallengeBanner'
import { GoalsSummaryCard } from '@/components/dashboard/GoalsSummaryCard'
import { HabitsSummaryCard } from '@/components/dashboard/HabitsSummaryCard'
import { OrganizationScoreCard } from '@/components/dashboard/OrganizationScoreCard'
import { TodayFocusCard } from '@/components/dashboard/TodayFocusCard'
import { TodayTasksCard } from '@/components/dashboard/TodayTasksCard'
import { UpcomingBillsCard } from '@/components/dashboard/UpcomingBillsCard'

export default function DashboardPage() {
  const user = useCurrentUser()
  const { finance, accounts, goals, tasks, habits, challenge, organization, focus, isLoading } = useDashboard()
  const today = capitalize(format(new Date(), "EEEE, d 'de' MMMM", { locale }))

  const header = (
    <PageHeader
      documentTitle="Visão geral"
      eyebrow={<span className="text-sm font-medium text-muted">{today}</span>}
      title={`${greeting()}, ${firstName(user.name)}! 👋`}
      description="Vamos colocar sua vida em ordem?"
      actions={
        <Link to={PATHS.finance} className="hidden items-center gap-1.5 text-sm font-semibold text-primary-ink hover:underline sm:inline-flex">
          Ver finanças <ArrowRight className="size-4" aria-hidden />
        </Link>
      }
    />
  )

  if (finance.isError) {
    return (
      <>
        {header}
        <ErrorState message={finance.error ?? undefined} onRetry={finance.reload} />
      </>
    )
  }

  if (isLoading) {
    return (
      <>
        {header}
        <LoadingState variant="page" label="Carregando seu painel…" />
      </>
    )
  }

  return (
    <div className="animate-fade-in">
      {header}

      <div className="vo-stagger grid grid-cols-1 gap-4 lg:gap-5 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <BalanceCard summary={finance.summary} categories={finance.categories} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-5 xl:col-span-7">
          <OrganizationScoreCard organization={organization} />
          <TodayFocusCard actions={focus} />
        </div>

        {!challenge.summary.finished && challenge.challenge && (
          <div className="xl:col-span-12">
            <ChallengeBanner
              currentDay={challenge.summary.currentDay}
              totalDays={challenge.summary.totalDays}
              progress={challenge.summary.progress}
              title={challenge.challenge.days.find((d) => d.day === challenge.summary.currentDay)?.title}
            />
          </div>
        )}

        <ChartCard
          className="xl:col-span-8"
          title="Evolução financeira"
          description="Receitas e despesas dos últimos 6 meses"
          legend={LEGEND_INCOME_EXPENSE}
          summary={finance.series.map((p) => `${p.label}: receitas ${p.income}, despesas ${p.expense}`).join('; ')}
        >
          {finance.transactions.length === 0 ? (
            <EmptyState
              icon={<LineChart />}
              title="Seu gráfico aparece aqui"
              description="Conforme você registra receitas e despesas, acompanhamos sua evolução mês a mês."
              action={
                <Link to={`${PATHS.finance}?novo=1`} className={buttonClasses('soft', 'sm')}>
                  Adicionar movimentação
                </Link>
              }
            />
          ) : (
            <IncomeExpenseAreaChart data={finance.series} />
          )}
        </ChartCard>
        <div className="xl:col-span-4">
          <UpcomingBillsCard bills={accounts.upcoming} overdueCount={accounts.totals.overdueCount} onPay={(bill) => void accounts.togglePaid(bill)} />
        </div>

        <div className="vo-stagger grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-5 xl:col-span-12 xl:grid-cols-3">
          <TodayTasksCard tasks={tasks.todayTasks} onToggle={tasks.toggleTask} />
          <GoalsSummaryCard goals={goals.active} />
          <HabitsSummaryCard habits={habits.habits} weeklyProgress={habits.weeklyProgress} onToggle={(habit) => void habits.toggle(habit)} />
        </div>
      </div>
    </div>
  )
}
