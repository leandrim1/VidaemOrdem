import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  FileText,
  Flame,
  Heart,
  ListChecks,
  MonitorSmartphone,
  PartyPopper,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react'
import type { FirstFocus, OnboardingGoal, OrganizationLevel } from '@/types'
import { cn } from '@/lib/cn'
import { useAuth } from '@/hooks/useAuth'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { PATHS } from '@/routes/paths'
import { getErrorMessage } from '@/services/errors'
import { toast } from '@/stores/toastStore'
import { firstName } from '@/utils/format'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { ProgressBar } from '@/components/ui/ProgressBar'

interface Option<T extends string> {
  value: T
  title: string
  description: string
  icon: ReactNode
}

const GOALS: Option<OnboardingGoal>[] = [
  { value: 'financas', title: 'Organizar minhas finanças', description: 'Saber para onde vai cada real', icon: <Wallet /> },
  { value: 'rotina', title: 'Organizar minha rotina', description: 'Ter tempo para o que importa', icon: <CalendarDays /> },
  { value: 'metas', title: 'Criar metas', description: 'Tirar os planos do papel', icon: <Target /> },
  { value: 'vida', title: 'Organizar minha vida', description: 'Casa, documentos e compromissos', icon: <Heart /> },
  { value: 'tudo', title: 'Quero organizar tudo', description: 'Um sistema completo para a vida', icon: <Sparkles /> },
]

const STATES: Option<OrganizationLevel>[] = [
  { value: 'caotica', title: 'Um caos total', description: 'Vivo apagando incêndios', icon: <Flame /> },
  { value: 'desorganizada', title: 'Bem desorganizada', description: 'Tento, mas não consigo manter', icon: <ListChecks /> },
  { value: 'razoavel', title: 'Razoável', description: 'Tenho controles, mas espalhados', icon: <FileText /> },
  { value: 'organizada', title: 'Organizada', description: 'Quero levar ao próximo nível', icon: <Check /> },
]

const FOCUS: Option<FirstFocus>[] = [
  { value: 'financas', title: 'Finanças e contas', description: 'Receitas, despesas e vencimentos', icon: <Wallet /> },
  { value: 'tarefas', title: 'Tarefas do dia a dia', description: 'Nada mais esquecido', icon: <ListChecks /> },
  { value: 'metas', title: 'Metas e sonhos', description: 'Com valor e prazo definidos', icon: <Target /> },
  { value: 'rotina', title: 'Rotina e hábitos', description: 'Uma semana mais leve', icon: <Flame /> },
  { value: 'documentos', title: 'Documentos', description: 'Tudo fácil de encontrar', icon: <FileText /> },
  { value: 'digital', title: 'Vida digital', description: 'Celular, e-mail e arquivos', icon: <MonitorSmartphone /> },
]

const FOCUS_PATH: Record<FirstFocus, string> = {
  financas: PATHS.finance,
  tarefas: PATHS.tasks,
  metas: PATHS.goals,
  rotina: PATHS.routine,
  documentos: PATHS.documents,
  digital: PATHS.digital,
}

function OptionGrid<T extends string>({ name, options, value, onChange, columns = 2 }: { name: string; options: Option<T>[]; value: T | null; onChange: (value: T) => void; columns?: 2 | 3 }) {
  return (
    <div role="radiogroup" aria-label={name} className={cn('grid gap-3', columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2')}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'group relative flex cursor-pointer items-center gap-3.5 rounded-2xl border bg-surface p-4 transition-all',
            'has-focus-visible:ring-3 has-focus-visible:ring-primary-ring hover:border-line-strong',
            value === option.value ? 'border-primary shadow-raised ring-1 ring-primary' : 'border-line',
          )}
        >
          <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} className="sr-only" />
          <span
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors [&_svg]:size-5',
              value === option.value ? 'bg-primary text-white' : 'bg-surface-2 text-fg-soft group-hover:text-fg',
            )}
          >
            {option.icon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold text-fg">{option.title}</span>
            <span className="mt-0.5 block text-[13px] text-muted">{option.description}</span>
          </span>
          <span
            className={cn('flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors', value === option.value ? 'border-primary bg-primary' : 'border-line-strong')}
            aria-hidden
          >
            {value === option.value && <Check className="size-3 text-white" strokeWidth={3.5} />}
          </span>
        </label>
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  useDocumentTitle('Boas-vindas')
  const { user, completeOnboarding } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState<OnboardingGoal | null>(user?.onboarding?.mainGoal ?? null)
  const [state, setState] = useState<OrganizationLevel | null>(user?.onboarding?.currentState ?? null)
  const [focus, setFocus] = useState<FirstFocus | null>(user?.onboarding?.firstFocus ?? null)
  const [saving, setSaving] = useState(false)
  const name = firstName(user?.name ?? '')

  const steps = [
    { title: 'Qual é seu principal objetivo?', description: 'Vamos personalizar sua experiência a partir disso.', canContinue: goal !== null },
    { title: 'Como está sua organização atualmente?', description: 'Sem julgamentos — é só para sabermos por onde começar.', canContinue: state !== null },
    { title: 'O que você gostaria de organizar primeiro?', description: 'Você poderá explorar todas as áreas depois.', canContinue: focus !== null },
  ]
  const finished = step === steps.length

  const next = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
      return
    }
    if (!goal || !state || !focus) return
    setSaving(true)
    try {
      await completeOnboarding({ mainGoal: goal, currentState: state, firstFocus: focus })
      setStep(steps.length)
    } catch (error) {
      toast.error('Não foi possível salvar suas respostas', getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="flex h-16 items-center justify-between px-5 sm:px-8">
        <Logo />
        {!finished && (
          <span className="vo-tabular text-sm font-medium text-muted">
            Etapa {step + 1} de {steps.length}
          </span>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-5 pt-6 pb-10 sm:px-8 sm:pt-12">
        {!finished ? (
          <div key={step} className="animate-fade-up">
            <ProgressBar value={((step + 1) / steps.length) * 100} label={`Etapa ${step + 1} de ${steps.length}`} size="sm" />
            <p className="mt-8 text-sm font-semibold text-primary-ink">Olá, {name}! 👋</p>
            <h1 className="mt-2 text-2xl font-extrabold text-fg sm:text-3xl">{steps[step].title}</h1>
            <p className="mt-2 text-muted">{steps[step].description}</p>

            <div className="mt-8">
              {step === 0 && <OptionGrid name="Objetivo principal" options={GOALS} value={goal} onChange={setGoal} />}
              {step === 1 && <OptionGrid name="Organização atual" options={STATES} value={state} onChange={setState} />}
              {step === 2 && <OptionGrid name="Primeira área" options={FOCUS} value={focus} onChange={setFocus} columns={3} />}
            </div>

            <div className="mt-10 flex items-center justify-between gap-3">
              <Button variant="ghost" leftIcon={<ArrowLeft className="size-4" />} onClick={() => setStep(step - 1)} disabled={step === 0} className={cn(step === 0 && 'invisible')}>
                Voltar
              </Button>
              <Button size="lg" onClick={next} disabled={!steps[step].canContinue} loading={saving} rightIcon={<ArrowRight className="size-4" />}>
                {step === steps.length - 1 ? 'Concluir' : 'Continuar'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <span className="flex size-20 animate-pop items-center justify-center rounded-3xl bg-primary text-white shadow-raised">
              <PartyPopper className="size-9" aria-hidden />
            </span>
            <h1 className="mt-8 max-w-xl animate-fade-up text-3xl font-extrabold text-fg sm:text-4xl">Perfeito, {name}. Vamos colocar sua vida em ordem.</h1>
            <p className="mt-4 max-w-md animate-fade-up text-muted [animation-delay:120ms]">
              Seu painel está pronto e você tem 7 dias grátis para explorar tudo, sem cobrança automática. Sugerimos começar pelo Desafio de 7 dias — um passo a passo simples para organizar cada área da sua vida.
            </p>
            <div className="mt-10 flex w-full max-w-sm animate-fade-up flex-col gap-3 [animation-delay:200ms]">
              <Button size="lg" fullWidth rightIcon={<ArrowRight className="size-4" />} onClick={() => navigate(PATHS.app, { replace: true })}>
                Entrar no meu painel
              </Button>
              {focus && (
                <Button variant="ghost" fullWidth onClick={() => navigate(FOCUS_PATH[focus], { replace: true })}>
                  Começar por {FOCUS.find((f) => f.value === focus)?.title.toLowerCase()}
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
