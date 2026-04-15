'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Commitment } from '@staked/core'
import { CommitmentCard } from '@/components/commitment-card'
import { ProofForm } from '@/components/proof-form'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatCents } from '@/lib/utils'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [loading, setLoading] = useState(true)
  const [proofCommitmentId, setProofCommitmentId] = useState<string | null>(null)

  const fetchCommitments = useCallback(async () => {
    const res = await fetch('/api/commitments')
    if (res.ok) {
      const data = await res.json()
      setCommitments(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCommitments()
  }, [fetchCommitments])

  // Check for overdue commitments and trigger charges
  useEffect(() => {
    if (commitments.length === 0) return

    const now = new Date()
    commitments.forEach(async (c) => {
      if (c.status !== 'active') return
      const graceEnd = c.grace_period_ends_at ? new Date(c.grace_period_ends_at) : null
      if (graceEnd && now > graceEnd) {
        await fetch(`/api/commitments/${c.id}/charge`, { method: 'POST' })
        fetchCommitments()
      }
    })
  }, [commitments, fetchCommitments])

  async function handleComplete(data: { proof_url?: string; proof_note: string }) {
    if (!proofCommitmentId) return
    const res = await fetch(`/api/commitments/${proofCommitmentId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      fetchCommitments()
    }
  }

  const activeCommitments = commitments.filter((c) => c.status === 'active')
  const completedCommitments = commitments.filter((c) => c.status === 'completed')
  const totalStaked = activeCommitments.reduce((sum, c) => sum + c.stake_cents, 0)
  const completionRate = commitments.length > 0
    ? Math.round((completedCommitments.length / commitments.length) * 100)
    : 0
  const moneySaved = completedCommitments.reduce((sum, c) => sum + c.stake_cents, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <Link href="/commitments/new">
          <Button>
            <PlusCircle className="h-4 w-4" />
            New Commitment
          </Button>
        </Link>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-muted">Active</p>
          <p className="text-2xl font-heading font-bold">{activeCommitments.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Total Staked</p>
          <p className="text-2xl font-heading font-bold text-amber-500">{formatCents(totalStaked)}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Completion Rate</p>
          <p className="text-2xl font-heading font-bold">{completionRate}%</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Money Saved</p>
          <p className="text-2xl font-heading font-bold text-emerald-500">{formatCents(moneySaved)}</p>
        </Card>
      </div>

      {/* Commitments List */}
      {commitments.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-muted mb-4">No commitments yet. Ready to put some skin in the game?</p>
          <Link href="/commitments/new">
            <Button>Create Your First Commitment</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {commitments.map((commitment) => (
            <CommitmentCard
              key={commitment.id}
              commitment={commitment}
              onMarkComplete={(id) => setProofCommitmentId(id)}
            />
          ))}
        </div>
      )}

      <ProofForm
        open={!!proofCommitmentId}
        onOpenChange={(open) => !open && setProofCommitmentId(null)}
        commitmentId={proofCommitmentId || ''}
        onSubmit={handleComplete}
      />
    </div>
  )
}
