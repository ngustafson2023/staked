import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CountdownTimer } from '@/components/countdown-timer'
import { formatCents } from '@/lib/utils'
import { ANTI_CHARITIES } from '@/lib/anti-charities'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function CommitmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) notFound()

  const { data: commitment } = await supabase
    .from('commitments')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!commitment) notFound()

  const antiCharity = ANTI_CHARITIES.find((c) => c.id === commitment.anti_charity)

  const statusColors: Record<string, string> = {
    active: 'secondary',
    completed: 'success',
    failed: 'destructive',
    cancelled: 'outline',
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant={statusColors[commitment.status] as 'default'}>
            {commitment.status.charAt(0).toUpperCase() + commitment.status.slice(1)}
          </Badge>
          <Badge>{formatCents(commitment.stake_cents)}</Badge>
        </div>
        <h1 className="text-3xl font-heading font-bold">{commitment.title}</h1>
        {commitment.description && (
          <p className="mt-2 text-muted">{commitment.description}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-muted mb-1">Deadline</p>
          <p className="font-medium">
            {new Date(commitment.deadline).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
          {commitment.status === 'active' && (
            <div className="mt-2">
              <CountdownTimer
                deadline={commitment.deadline}
                className="text-lg font-mono font-bold text-amber-500"
              />
              <span className="text-sm text-muted"> remaining</span>
            </div>
          )}
        </Card>

        <Card>
          <p className="text-sm text-muted mb-1">Anti-charity</p>
          <p className="font-medium">
            {antiCharity?.icon} {antiCharity?.name}
          </p>
          <p className="text-sm text-muted mt-1">{antiCharity?.description}</p>
        </Card>
      </div>

      {commitment.status === 'completed' && (
        <Card>
          <h2 className="text-lg font-heading font-bold mb-3">Proof of Completion</h2>
          {commitment.proof_url && (
            <a
              href={commitment.proof_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-500 hover:underline mb-2"
            >
              View work <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {commitment.proof_note && (
            <p className="text-muted">{commitment.proof_note}</p>
          )}
          <p className="text-sm text-muted mt-3">
            Completed {new Date(commitment.completed_at!).toLocaleDateString()}
          </p>
        </Card>
      )}

      {commitment.status === 'failed' && (
        <Card className="border-red-500 bg-red-50">
          <h2 className="text-lg font-heading font-bold text-red-600 mb-2">Deadline Missed</h2>
          <p className="text-muted">
            Your card was charged {formatCents(commitment.stake_cents)} for {antiCharity?.name}.
          </p>
          {commitment.charged_at && (
            <p className="text-sm text-muted mt-2">
              Charged {new Date(commitment.charged_at).toLocaleDateString()}
            </p>
          )}
        </Card>
      )}

      {commitment.is_public && commitment.public_slug && (
        <Card>
          <p className="text-sm text-muted mb-1">Public accountability page</p>
          <Link
            href={`/c/${commitment.public_slug}`}
            className="text-amber-500 hover:underline"
          >
            staked.so/c/{commitment.public_slug}
          </Link>
        </Card>
      )}
    </div>
  )
}
