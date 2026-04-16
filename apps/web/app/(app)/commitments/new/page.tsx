'use client'

import { useEffect, useState } from 'react'
import { CommitmentForm } from '@/components/commitment-form'
import { TEMPLATES, type CommitmentTemplate } from '@/lib/templates'

export default function NewCommitmentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [initialData, setInitialData] = useState<Record<string, unknown>>({})

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
                    ? 'border-amber-500 bg-amber-500/10 text-amber-500'
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
