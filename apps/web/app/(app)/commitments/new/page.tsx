'use client'

import { useEffect, useState } from 'react'
import { CommitmentForm } from '@/components/commitment-form'

export default function NewCommitmentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function createSetupIntent() {
      const res = await fetch('/api/stripe/setup-intent', { method: 'POST' })
      if (!res.ok) {
        setError('Failed to initialize payment. Please try again.')
        return
      }
      const data = await res.json()
      setClientSecret(data.client_secret)
    }
    createSetupIntent()
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-heading font-bold mb-8">New Commitment</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {clientSecret ? (
        <CommitmentForm clientSecret={clientSecret} />
      ) : (
        <p className="text-muted">Setting up payment...</p>
      )}
    </div>
  )
}
