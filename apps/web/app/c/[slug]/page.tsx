import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { CountdownTimer } from '@/components/countdown-timer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCents } from '@/lib/utils'
import { ANTI_CHARITIES } from '@/lib/anti-charities'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServiceClient()
  const { data: commitment } = await supabase
    .from('commitments')
    .select('title, stake_cents')
    .eq('public_slug', slug)
    .eq('is_public', true)
    .single()

  if (!commitment) return { title: 'Commitment Not Found' }

  return {
    title: `${commitment.title} — Staked`,
    description: `${formatCents(commitment.stake_cents)} on the line. Watch this commitment unfold.`,
  }
}

export default async function PublicCommitmentPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServiceClient()

  const { data: commitment } = await supabase
    .from('commitments')
    .select('*')
    .eq('public_slug', slug)
    .eq('is_public', true)
    .single()

  if (!commitment) notFound()

  const antiCharity = ANTI_CHARITIES.find((c) => c.id === commitment.anti_charity)

  const statusConfig: Record<string, { color: string; text: string }> = {
    active: { color: 'text-amber-500', text: 'In Progress' },
    completed: { color: 'text-emerald-500', text: 'Completed' },
    failed: { color: 'text-red-500', text: 'Failed' },
    cancelled: { color: 'text-muted', text: 'Cancelled' },
  }

  const status = statusConfig[commitment.status] || statusConfig.active

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full text-center space-y-8">
        <div>
          <p className="text-zinc-500 text-sm mb-2 uppercase tracking-wider">Someone has committed to:</p>
          <h1 className="text-4xl font-heading font-bold">{commitment.title}</h1>
          {commitment.description && (
            <p className="text-zinc-400 mt-3">{commitment.description}</p>
          )}
        </div>

        <Card className="bg-zinc-900 border-zinc-800 text-zinc-50">
          {commitment.status === 'active' ? (
            <div>
              <p className="text-sm text-zinc-500 mb-2">Time remaining</p>
              <CountdownTimer
                deadline={commitment.deadline}
                className="text-4xl font-mono font-bold text-amber-500"
              />
            </div>
          ) : (
            <div>
              <p className="text-sm text-zinc-500 mb-2">Status</p>
              <p className={`text-2xl font-heading font-bold ${status.color}`}>
                {status.text}
              </p>
            </div>
          )}
        </Card>

        <div className="flex items-center justify-center gap-4">
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-base px-4 py-1">
            {formatCents(commitment.stake_cents)} on the line
          </Badge>
        </div>

        {antiCharity && (
          <p className="text-sm text-zinc-500">
            If missed, {formatCents(commitment.stake_cents)} goes to {antiCharity.icon} {antiCharity.name}
          </p>
        )}

        <p className="text-sm text-zinc-500">
          Deadline: {new Date(commitment.deadline).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>

        {commitment.status === 'completed' && commitment.proof_url && (
          <a
            href={commitment.proof_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-amber-500 hover:underline"
          >
            View the completed work &rarr;
          </a>
        )}

        <div className="pt-8 border-t border-zinc-800">
          <p className="text-sm text-zinc-600">
            Create your own commitment at{' '}
            <a href="https://staked.bootstrapquant.com" className="text-amber-500 hover:underline">
              staked.bootstrapquant.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
