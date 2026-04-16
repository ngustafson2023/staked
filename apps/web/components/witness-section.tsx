'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { UserPlus, Clock, CheckCircle2, XCircle } from 'lucide-react'

interface Witness {
  id: string
  email: string
  status: string
  note: string | null
  created_at: string
  responded_at: string | null
}

const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-primary', label: 'Pending' },
  approved: { icon: CheckCircle2, color: 'text-emerald-500', label: 'Approved' },
  rejected: { icon: XCircle, color: 'text-red-500', label: 'Rejected' },
}

export function WitnessSection({ commitmentId }: { commitmentId: string }) {
  const [witnesses, setWitnesses] = useState<Witness[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchWitnesses() {
      const res = await fetch(`/api/commitments/${commitmentId}/witness`)
      if (res.ok) {
        setWitnesses(await res.json())
      }
    }
    fetchWitnesses()
  }, [commitmentId])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    const res = await fetch(`/api/commitments/${commitmentId}/witness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.ok) {
      const witness = await res.json()
      setWitnesses([witness, ...witnesses])
      setEmail('')
    }
    setLoading(false)
  }

  return (
    <Card>
      <h2 className="text-lg font-heading font-bold mb-4">
        <UserPlus className="h-4 w-4 inline mr-2" />
        Invite Witness
      </h2>
      <p className="text-sm text-muted mb-4">
        Ask someone to verify your proof before marking complete.
      </p>

      <form onSubmit={handleInvite} className="flex gap-2 mb-4">
        <div className="flex-1">
          <Label htmlFor="witness-email" className="sr-only">Witness email</Label>
          <Input
            id="witness-email"
            type="email"
            placeholder="witness@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading} size="sm">
          {loading ? 'Sending...' : 'Send Invite'}
        </Button>
      </form>

      {witnesses.length > 0 && (
        <div className="space-y-2">
          {witnesses.map((w) => {
            const config = statusConfig[w.status] || statusConfig.pending
            const Icon = config.icon
            return (
              <div key={w.id} className="flex items-center justify-between text-sm border rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${config.color}`} />
                  <span>{w.email}</span>
                </div>
                <Badge variant={w.status === 'approved' ? 'success' : w.status === 'rejected' ? 'destructive' : 'secondary'}>
                  {config.label}
                </Badge>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
