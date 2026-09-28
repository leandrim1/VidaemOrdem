import { useCallback, useMemo, useState } from 'react'
import { CircleCheck, PiggyBank, Plus, Target, TrendingUp } from 'lucide-react'
import type { Goal } from '@/types'
import { useEditor } from '@/hooks/useDisclosure'
import { useGoals } from '@/hooks/useGoals'
import { useQueryAction } from '@/hooks/useQueryAction'
import { confirm } from '@/stores/confirmStore'
import { formatPercent, roundMoney } from '@/utils/format'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Money } from '@/components/ui/Money'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/States'
import { Tabs } from '@/components/ui/Tabs'
import { ContributionModal } from '@/components/goals/ContributionModal'
import { GoalCard } from '@/components/goals/GoalCard'
import { GoalFormModal } from '@/components/goals/GoalFormModal'

type Filter = 'active' | 'completed' | 'all'

export default function GoalsPage() {
  const { goals, active, completed, status, error, isLoading, reload, addGoal, updateGoal, deleteGoal, contribute } = useGoals()
  const editor = useEditor<Goal>()
  useQueryAction(editor.openNew)
  const [contributing, setContributing] = useState<Goal | null>(null)
  const [filter, setFilter] = useState<Filter>('active')

  const totals = useMemo(() => {
    const saved = roundMoney(goals.reduce((sum, g) => sum + g.currentAmount, 0))
    const target = roundMoney(goals.reduce((sum, g) => sum + g.targetAmount, 0))
    return { saved, target, percent: target > 0 ? (saved / target) * 100 : 0 }
  }, [goals])

  const visible = filter === 'active' ? active : filter === 'completed' ? completed : goals

  const handleDelete = useCallback(
    async (goal: Goal) => {
      if (await confirm({ title: 'Tem certeza?', description: `A meta "${goal.name}" e seu histórico serão excluídos.`, confirmLabel: 'Excluir meta' })) await deleteGoal(goal.id)
    },
    [deleteGoal],
  )

  return (
    <>
      <PageHeader
        title="Metas"
        description="Transforme sonhos em planos com valor, prazo e progresso visível."
        actions={
          <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
            Nova meta
          </Button>
        }
      />
      {status === 'error' ? (
        <ErrorState message={error ?? undefined} onRetry={reload} />
      ) : isLoading ? (
        <LoadingState variant="cards" count={3} />
      ) : (
        <div className="animate-fade-in space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total guardado" value={<Money value={totals.saved} />} icon={<PiggyBank />} tone="success" footer={`${formatPercent(totals.percent)} de todas as metas`} />
            <StatCard label="Em andamento" value={active.length} icon={<TrendingUp />} tone="primary" footer="metas ativas" />
            <StatCard label="Concluídas" value={completed.length} icon={<CircleCheck />} tone="warning" footer="metas alcançadas" />
          </div>

          <Tabs
            label="Filtrar metas"
            value={filter}
            onChange={setFilter}
            panelId="goals-panel"
            items={[
              { value: 'active', label: 'Em andamento', count: active.length },
              { value: 'completed', label: 'Concluídas', count: completed.length },
              { value: 'all', label: 'Todas', count: goals.length },
            ]}
          />

          <div id="goals-panel" role="tabpanel">
            {visible.length === 0 ? (
              <Card>
                <EmptyState
                  icon={<Target />}
                  title={goals.length === 0 ? 'Crie sua primeira meta' : filter === 'completed' ? 'Nenhuma meta concluída ainda' : 'Nenhuma meta em andamento'}
                  description={goals.length === 0 ? 'Reserva de emergência, viagem, curso… Defina um valor e um prazo para começar.' : 'Continue guardando — sua primeira conquista está chegando.'}
                  action={
                    <Button leftIcon={<Plus className="size-4" />} onClick={editor.openNew}>
                      Nova meta
                    </Button>
                  }
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {visible.map((goal) => (
                  <GoalCard key={goal.id} goal={goal} onContribute={setContributing} onEdit={editor.openEdit} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <GoalFormModal open={editor.isOpen} onClose={editor.close} goal={editor.editing} onSubmit={(input) => (editor.editing ? updateGoal(editor.editing.id, input) : addGoal(input))} />
      <ContributionModal goal={contributing} onClose={() => setContributing(null)} onSubmit={contribute} />
    </>
  )
}
