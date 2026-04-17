'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CommitmentForm } from '@/components/commitment-form'
import { TEMPLATES, type CommitmentTemplate } from '@/lib/templates'

export default function NewCommitmentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [initialData, setInitialData] = useState<Record<string, unknown>>({})
  const [plan, setPlan] = useState<string>('free')

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
    fetch('/api/profile').then(r => r.json()).then(d => setPlan(d.plan || 'free'))
  }, [])

  function handleTemplateSelect(template: CommitmentTemplate) {
    setSelectedTemplate(template.id)
    const deadlineDate = new Date()
    deadlineDate.setDate(deadlineDate.getDate() + template.defaultDaysFromNow)
    setInitialData({
      title: template.description,
      stake_cents: template.defaultStakeCents,
      deadline: deadlineDate.toISOString().split('T')[0],
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-heading font-bold mb-8">New Commitment</h1>

      {plan === 'free' && (
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm">
          <span className="text-amber-500 font-medium">Free plan:</span>
          <span className="text-muted ml-1">3 active commitments · $100 max stake · No public pages</span>
          <Link href="/billing" className="ml-3 text-amber-500 underline underline-offset-2">Upgrade →</Link>
        </div>
      )}

      {/* Template chips */}
      <div className="mb-8">
        <p className="text-sm text-muted mb-3">Start from a template</p>
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template)}
                className={`shrink-0 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-zinc-400'
                }`}
              >
                <span>{template.emoji}</span>
                <span>{template.title}</span>
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {clientSecret ? (
        <CommitmentForm
          key={selectedTemplate || 'default'}
          clientSecret={clientSecret}
          initialData={initialData}
        />
      ) : (
        <p className="text-muted">Setting up payment...</p>
      )}
    </div>
  )
}
