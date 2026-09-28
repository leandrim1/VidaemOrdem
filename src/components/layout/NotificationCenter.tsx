import { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, BellOff, Check, CheckCheck, CreditCard, Flame, Receipt, Sparkles, Target, Trash2, Info, ListChecks, type LucideIcon } from 'lucide-react'
import type { NotificationKind } from '@/types'
import { cn } from '@/lib/cn'
import { useNotifications } from '@/hooks/useNotifications'
import { PATHS } from '@/routes/paths'
import { formatRelativeTime } from '@/utils/format'
import { Tabs } from '@/components/ui/Tabs'
import { EmptyState, LoadingState } from '@/components/ui/States'

const kindIcon: Record<NotificationKind, { icon: LucideIcon; className: string }> = {
  bill: { icon: Receipt, className: 'bg-warning-soft text-warning-ink' },
  task: { icon: ListChecks, className: 'bg-primary-soft text-primary-ink' },
  goal: { icon: Target, className: 'bg-success-soft text-success-ink' },
  habit: { icon: Flame, className: 'bg-danger-soft text-danger-ink' },
  achievement: { icon: Sparkles, className: 'bg-warning-soft text-warning-ink' },
  billing: { icon: CreditCard, className: 'bg-primary-soft text-primary-ink' },
  system: { icon: Info, className: 'bg-surface-2 text-fg-soft' },
}

type Filter = 'all' | 'unread'

export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const navigate = useNavigate()
  const { items, unreadCount, enabled, isLoading, markRead, toggleRead, markAllRead, remove } = useNotifications()

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const visible = filter === 'unread' ? items.filter((n) => !n.read) : items
  const showBadge = enabled && unreadCount > 0

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={showBadge ? `Notificações (${unreadCount} não lidas)` : 'Notificações'}
        className="relative flex size-10 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
      >
        {enabled ? <Bell className="size-[18px]" aria-hidden /> : <BellOff className="size-[18px]" aria-hidden />}
        {showBadge && (
          <span className="vo-tabular absolute top-1.5 right-1.5 flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] leading-4 font-bold text-white ring-2 ring-surface">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          tabIndex={-1}
          aria-label="Central de notificações"
          className="fixed inset-x-3 top-[4.25rem] z-50 flex max-h-[min(560px,calc(100dvh-6rem))] animate-scale-in flex-col overflow-hidden outline-none rounded-2xl border border-line bg-surface shadow-overlay sm:absolute sm:inset-x-auto sm:top-12 sm:right-0 sm:w-[400px]"
        >
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
            <div>
              <h2 className="text-[15px] font-bold text-fg">Notificações</h2>
              <p className="text-xs text-muted">{unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia'}</p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllRead()}
                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-primary-ink hover:bg-primary-soft"
              >
                <CheckCheck className="size-4" aria-hidden />
                Marcar todas como lidas
              </button>
            )}
          </div>

          {!enabled && (
            <div className="flex items-start gap-2 border-b border-line bg-warning-soft px-4 py-2.5 text-xs text-warning-ink">
              <BellOff className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <p>
                Os alertas estão desativados.{' '}
                <Link to={PATHS.settings} onClick={() => setOpen(false)} className="font-semibold underline underline-offset-2">
                  Ativar nas configurações
                </Link>
              </p>
            </div>
          )}

          <div className="px-4 pt-3">
            <Tabs
              label="Filtrar notificações"
              value={filter}
              onChange={setFilter}
              items={[
                { value: 'all', label: 'Todas', count: items.length },
                { value: 'unread', label: 'Não lidas', count: unreadCount },
              ]}
            />
          </div>

          <div className="vo-scrollbar min-h-0 flex-1 overflow-y-auto p-2">
            {isLoading ? (
              <LoadingState variant="list" count={3} className="p-2" />
            ) : visible.length === 0 ? (
              <EmptyState compact icon={<Bell />} title="Nenhuma notificação" description={filter === 'unread' ? 'Você leu tudo. Muito bem!' : 'Quando algo precisar da sua atenção, aparecerá aqui.'} />
            ) : (
              <ul className="space-y-0.5">
                {visible.map((notification) => {
                  const { icon: Icon, className } = kindIcon[notification.kind]
                  return (
                    <li key={notification.id} className="group relative">
                      <button
                        type="button"
                        onClick={() => {
                          void markRead(notification.id)
                          setOpen(false)
                          if (notification.href) navigate(notification.href)
                        }}
                        className={cn(
                          'flex w-full items-start gap-3 rounded-xl p-2.5 pr-16 text-left transition-colors hover:bg-surface-2',
                          !notification.read && 'bg-primary-soft/40',
                        )}
                      >
                        <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-[10px]', className)}>
                          <Icon className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className={cn('truncate text-[13px]', notification.read ? 'font-medium text-fg-soft' : 'font-semibold text-fg')}>{notification.title}</span>
                            {!notification.read && <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Não lida" />}
                          </span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-muted">{notification.message}</span>
                          <span className="mt-1 block text-[11px] text-muted">{formatRelativeTime(notification.createdAt)}</span>
                        </span>
                      </button>
                      <div className="absolute top-2 right-2 flex gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => void toggleRead(notification.id)}
                          aria-label={notification.read ? 'Marcar como não lida' : 'Marcar como lida'}
                          title={notification.read ? 'Marcar como não lida' : 'Marcar como lida'}
                          className="flex size-7 items-center justify-center rounded-md text-muted hover:bg-surface-3 hover:text-fg"
                        >
                          <Check className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void remove(notification.id)}
                          aria-label="Excluir notificação"
                          title="Excluir"
                          className="flex size-7 items-center justify-center rounded-md text-muted hover:bg-danger-soft hover:text-danger-ink"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
