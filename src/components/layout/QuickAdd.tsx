import { useNavigate } from 'react-router-dom'
import { CalendarPlus, ListPlus, Plus, Receipt, Target, Wallet } from 'lucide-react'
import { PATHS } from '@/routes/paths'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'

/** Atalho global de criação: abre a página já com o formulário aberto (`?novo=1`). */
export function QuickAdd() {
  const navigate = useNavigate()
  const go = (path: string) => navigate(`${path}?novo=1`)
  return (
    <Dropdown
      label="Adicionar"
      items={[
        { label: 'Movimentação', icon: <Wallet />, onSelect: () => go(PATHS.finance) },
        { label: 'Conta a pagar', icon: <Receipt />, onSelect: () => go(PATHS.accounts) },
        { label: 'Tarefa', icon: <ListPlus />, onSelect: () => go(PATHS.tasks) },
        { label: 'Meta', icon: <Target />, onSelect: () => go(PATHS.goals) },
        { label: 'Compromisso', icon: <CalendarPlus />, onSelect: () => go(PATHS.routine) },
      ]}
      trigger={(props) => (
        <Button {...props} size="sm" leftIcon={<Plus className="size-4" />}>
          Novo
        </Button>
      )}
    />
  )
}
