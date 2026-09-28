import { useMemo } from 'react'
import { Check, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface CelebrationModalProps {
  open: boolean
  onClose: () => void
  variant: 'day' | 'challenge'
  day?: number
  nextTitle?: string
}

const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#8B5CF6', '#06B6D4']

/** Confete em CSS puro (sem dependências), respeitando `prefers-reduced-motion`. */
function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const angle = (i / 36) * Math.PI * 2
        const distance = 120 + ((i * 37) % 90)
        return {
          id: i,
          color: COLORS[i % COLORS.length],
          dx: `${Math.cos(angle) * distance}px`,
          dy: `${Math.sin(angle) * distance - 40}px`,
          rot: `${(i * 67) % 360}deg`,
          delay: `${(i % 6) * 30}ms`,
          round: i % 3 === 0,
        }
      }),
    [],
  )
  return (
    <div className="pointer-events-none absolute top-24 left-1/2" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="vo-confetti-piece absolute block"
          style={
            {
              width: p.round ? 8 : 6,
              height: p.round ? 8 : 12,
              borderRadius: p.round ? 999 : 2,
              background: p.color,
              animationDelay: p.delay,
              '--dx': p.dx,
              '--dy': p.dy,
              '--rot': p.rot,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

export function CelebrationModal({ open, onClose, variant, day, nextTitle }: CelebrationModalProps) {
  const isFinal = variant === 'challenge'
  return (
    <Modal open={open} onClose={onClose} size="sm" bare title={isFinal ? 'Desafio concluído' : `Dia ${day} concluído`}>
      <div className="relative overflow-hidden px-6 pt-10 pb-7 text-center">
        <Confetti />
        <span className={`relative mx-auto flex size-20 animate-pop items-center justify-center rounded-full text-white shadow-raised ${isFinal ? 'bg-warning' : 'bg-success'}`}>
          {isFinal ? (
            <Trophy className="size-9" aria-hidden />
          ) : (
            <svg viewBox="0 0 24 24" className="size-10" fill="none" aria-hidden>
              <path d="M5 12.5 10 17.5 19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="vo-draw" style={{ '--len': 24 } as React.CSSProperties} />
            </svg>
          )}
        </span>
        <p className="mt-6 text-sm font-semibold tracking-wider text-primary-ink uppercase">{isFinal ? 'Parabéns!' : `Dia ${day} de 7`}</p>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-fg">{isFinal ? 'Sua vida está em ordem!' : 'Mais um passo concluído!'}</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted">
          {isFinal
            ? 'Você completou os 7 dias do desafio. Agora é manter o sistema funcionando com suas revisões semanais.'
            : nextTitle
              ? `Amanhã: ${nextTitle}. Continue assim!`
              : 'Continue no seu ritmo.'}
        </p>
        <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-warning-soft px-3 py-1 text-sm font-bold text-warning-ink">
          <Check className="size-4" aria-hidden /> +{isFinal ? 120 : 20} pontos
        </p>
        <Button className="mt-6" fullWidth size="lg" onClick={onClose} autoFocus>
          {isFinal ? 'Ver minha conquista' : 'Continuar'}
        </Button>
      </div>
    </Modal>
  )
}
