import type { OrganizationScore } from '@/utils/organization'
import { Card, CardHeader } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ProgressRing } from '@/components/ui/ProgressRing'

function scoreMessage(score: number) {
  if (score >= 85) return 'Sua vida está em ordem!'
  if (score >= 65) return 'Muito bem, continue assim.'
  if (score >= 40) return 'Bom começo, siga firme.'
  return 'Vamos dar o primeiro passo?'
}

export function OrganizationScoreCard({ organization }: { organization: OrganizationScore }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Organização" description={scoreMessage(organization.score)} className="mb-2" />
      <div className="flex justify-center py-2">
        <ProgressRing value={organization.score} size={132} stroke={11} label="Índice de organização">
          <span className="font-display text-3xl font-extrabold text-fg">{organization.score}%</span>
          <span className="text-[11px] font-medium text-muted">organizado</span>
        </ProgressRing>
      </div>
      <ul className="mt-3 space-y-2.5">
        {organization.areas.map((area) => (
          <li key={area.key}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-fg-soft">{area.label}</span>
              <span className="vo-tabular font-semibold text-fg">{area.score}%</span>
            </div>
            <ProgressBar value={area.score} size="xs" label={area.label} />
          </li>
        ))}
      </ul>
    </Card>
  )
}
