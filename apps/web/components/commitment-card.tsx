'use client'

import type { Commitment } from '@staked/core'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CountdownTimer } from '@/components/countdown-timer'
import { formatCents } from '@/lib/utils'
import { CheckCircle2, Clock, AlertTriangle, Skull } from 'lucide-react'
import Link from 'next/link'

interface CommitmentCardProps {
  commitment: Commitment
  onMarkComplete?: (id: string) => void
}

function getStatusConfig(commitment: Commitment) {
  const now = new Date().getTime()
  const deadline = new Date(commitment.deadline).getTime()
  const graceEnd = commitment.grace_period_ends_at
    ? new Date(commitment.grace_period_ends_at).getTime()
    : deadline + 3600000
  const hoursLeft = (deadline - now) / (1000 * 60 * 60)

  if (commitment.status === 'completed') {
    return { border: 'border-emerald-500', icon: CheckCircle2, iconColor: 'text-emerald-500', label: 'Completed', variant: 'success' as const }
  }
  if (commitment.status === 'failed') {
    return { border: 'border-red-500 bg-red-50', icon: Skull, iconColor: 'text-red-500', label: 'Failed', variant: 'destructive' as const }
  }
  if (now > deadline && now <= graceEnd) {
    return { border: 'border-red-500', icon: AlertTriangle, iconColor: 'text-red-500 animate-pulse', label: 'Grace Period', variant: 'destructive' as const }
  }
  if (hoursLeft < 24 && hoursLeft > 0) {
    return { border: 'border-amber-500', icon: Clock, iconColor: 'text-amber-500', label: 'Due Soon', variant: 'default' as const }
  }
  return { border: 'border-border', icon: Clock, iconColor: 'text-muted', label: 'Active', variant: 'secondary' as const }
}

export function CommitmentCard({ commitment, onMarkComplete }: CommitmentCardProps) {
  const config = getStatusConfig(commitment)
  const Icon = config.icon

  return (
    <Card className={`${config.border} transition-all`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`h-4 w-4 shrink-0 ${config.iconColor}`} />
            <Badge variant={config.variant}>{config.label}</Badge>
            <Badge>{formatCents(commitment.stake_cents)}</Badge>
          </div>
          <Link
            href={`/commitments/${commitment.id}`}
            className="text-lg font-heading font-bold hover:text-amber-500 transition-colors"
          >
            {commitment.title}
          </Link>
          {commitment.status === 'active' && (
            <div className="mt-2 text-sm text-muted">
              <CountdownTimer deadline={commitment.deadline} className="font-mono font-medium text-foreground" />
              {' remaining'}
            </div>
          )}
        </div>
        {commitment.status === 'active' && onMarkComplete && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onMarkComplete(commitment.id)}
          >
            Mark Complete
          </Button>
        )}
      </div>
    </Card>
  )
}
