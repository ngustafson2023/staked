'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ProofFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  commitmentId: string
  onSubmit: (data: { proof_url?: string; proof_note: string }) => Promise<void>
}

export function ProofForm({ open, onOpenChange, commitmentId, onSubmit }: ProofFormProps) {
  const [proofUrl, setProofUrl] = useState('')
  const [proofNote, setProofNote] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({
        proof_url: proofUrl || undefined,
        proof_note: proofNote,
      })
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>Submit Proof of Completion</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proof-url">Link to your work</Label>
            <Input
              id="proof-url"
              type="url"
              placeholder="https://github.com/you/project"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="proof-note">What did you ship?</Label>
            <Textarea
              id="proof-note"
              placeholder="Briefly describe what you completed..."
              value={proofNote}
              onChange={(e) => setProofNote(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'I Shipped It'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
