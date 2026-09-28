import { CircleAlert, CircleCheck, Clock } from 'lucide-react'
import type { AccountStatus } from '@/types'
import { ACCOUNT_STATUS_LABELS } from '@/data/categories'
import { Badge } from '@/components/ui/Badge'

/** Status sempre com ícone + texto (nunca apenas cor). */
export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  if (status === 'paid') return <Badge tone="success" icon={<CircleCheck />}>{ACCOUNT_STATUS_LABELS.paid}</Badge>
  if (status === 'overdue') return <Badge tone="danger" icon={<CircleAlert />}>{ACCOUNT_STATUS_LABELS.overdue}</Badge>
  return <Badge tone="warning" icon={<Clock />}>{ACCOUNT_STATUS_LABELS.pending}</Badge>
}
