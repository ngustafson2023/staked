'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle2 } from 'lucide-react'

interface Milestone {
  id: string
  note: string
  created_at: string
}

export function MilestoneSection({ commitmentId }: { commitmentId: string }) {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchMilestones() {
      const res = await fetch(`/api/commitments/${commitmentId}/milestones`)
      if (res.ok) {
        setMilestones(await res.json())
      }
    }
    fetchMilestones()
  }, [commitmentId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!note.trim()) return
    setLoading(true)
    const res = await fetch(`/api/commitments/${commitmentId}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    })
    if (res.ok) {
      const milestone = await res.json()
      setMilestones([...milestones, milestone])
      setNote('')
    }
    setLoading(false)
  }

  return (
    <Card>
      <h2 className="text-lg font-heading font-bold mb-4">Milestone Check-ins</h2>

      {milestones.length > 0 && (
        <div className="space-y-3 mb-6">
          {milestones.map((m) => (
            <div key={m.id} className="flex gap-3">
              <div className="flex flex-col items-center">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-1" />
                {milestones.indexOf(m) < milestones.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-1" />
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm">{m.note}</p>
                <p className="text-xs text-muted mt-1">
                  {new Date(m.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="milestone-note">Log a check-in</Label>
          <Textarea
            id="milestone-note"
            placeholder="What progress have you made?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />
        </div>
        <Button type="submit" size="sm" disabled={loading || !note.trim()}>
          {loading ? 'Saving...' : 'Add Check-in'}
        </Button>
      </form>
    </Card>
  )
}
