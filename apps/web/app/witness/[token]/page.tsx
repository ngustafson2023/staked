'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { formatCents } from '@/lib/utils'
import { CheckCircle2, XCircle, ExternalLink } from 'lucide-react'

interface WitnessData {
  title: string
  deadline: string
  stake_cents: number
  proof_url: string | null
  proof_note: string | null
  witness_status: string
}

export default function WitnessPage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<WitnessData | null>(null)
  const [loading, setLoading] = useState(true)
  const [note, setNote] = useState('')
  const [responded, setResponded] = useState(false)
  const [responseStatus, setResponseStatus] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchWitness() {
      const res = await fetch(`/api/witness/${token}`)
      if (res.ok) {
        const d = await res.json()
        setData(d)
        if (d.witness_status !== 'pending') {
          setResponded(true)
          setResponseStatus(d.witness_status)
        }
      } else {
        setError('Witness link not found or expired.')
      }
      setLoading(false)
    }
    fetchWitness()
  }, [token])

  async function handleRespond(approved: boolean) {
    const res = await fetch(`/api/witness/${token}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved, note: note || undefined }),
    })
    if (res.ok) {
      const result = await res.json()
      setResponded(true)
      setResponseStatus(result.status)
    } else {
      const result = await res.json()
      setError(result.error || 'Failed to submit response')
    }
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-muted">Loading...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-red-500">{error || 'Something went wrong'}</p>
      </div>
    )
  }

  if (responded) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-4">
        {responseStatus === 'approved' ? (
          <>
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h1 className="text-2xl font-heading font-bold">Commitment Verified</h1>
            <p className="text-muted">You approved this commitment as complete. The stake has been saved.</p>
          </>
        ) : (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <h1 className="text-2xl font-heading font-bold">Commitment Rejected</h1>
            <p className="text-muted">You rejected this proof. The commitment owner can resubmit.</p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-20 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold mb-2">Witness Verification</h1>
        <p className="text-muted">Someone asked you to verify their commitment.</p>
      </div>

      <Card>
        <h2 className="text-xl font-heading font-bold mb-3">{data.title}</h2>
        <div className="flex gap-3 mb-4">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {formatCents(data.stake_cents)} at stake
          </Badge>
          <Badge variant="secondary">
            Due {new Date(data.deadline).toLocaleDateString()}
          </Badge>
        </div>

        {(data.proof_url || data.proof_note) && (
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium mb-2">Proof of completion:</p>
            {data.proof_url && (
              <a
                href={data.proof_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline mb-2"
              >
                View work <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {data.proof_note && (
              <p className="text-muted text-sm">{data.proof_note}</p>
            )}
          </div>
        )}
      </Card>

      <Card>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a note about your decision..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => handleRespond(true)}
              className="flex-1"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRespond(false)}
              className="flex-1"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
