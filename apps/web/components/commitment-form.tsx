'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { StakeInput } from '@/components/stake-input'
import { ANTI_CHARITIES } from '@/lib/anti-charities'
import type { AntiCharityId } from '@staked/core'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface FormData {
  title: string
  description: string
  deadline: string
  deadlineTime: string
  stake_cents: number
  anti_charity: AntiCharityId
  is_public: boolean
}

function CommitmentFormInner({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    deadline: '',
    deadlineTime: '23:59',
    stake_cents: 2500,
    anti_charity: 'nra',
    is_public: false,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError('')

    try {
      const { error: stripeError, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
      })

      if (stripeError) {
        setError(stripeError.message || 'Payment setup failed')
        setLoading(false)
        return
      }

      const deadline = new Date(`${form.deadline}T${form.deadlineTime}`).toISOString()

      const res = await fetch('/api/commitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description || null,
          deadline,
          stake_cents: form.stake_cents,
          anti_charity: form.anti_charity,
          is_public: form.is_public,
          stripe_setup_intent_id: setupIntent?.id,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to create commitment')
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  // Get minimum date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <h2 className="text-xl font-heading font-bold mb-4">What are you committing to?</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Commitment title</Label>
            <Input
              id="title"
              placeholder="e.g., Launch landing page for my SaaS"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="What does 'done' look like?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-heading font-bold mb-4">When is your deadline?</h2>
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="deadline">Date</Label>
            <Input
              id="deadline"
              type="date"
              min={minDate}
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              required
            />
          </div>
          <div className="w-32 space-y-2">
            <Label htmlFor="deadline-time">Time</Label>
            <Input
              id="deadline-time"
              type="time"
              value={form.deadlineTime}
              onChange={(e) => setForm({ ...form, deadlineTime: e.target.value })}
              required
            />
          </div>
        </div>
        <p className="text-sm text-muted mt-2">
          Times are in your local timezone ({Intl.DateTimeFormat().resolvedOptions().timeZone})
        </p>
      </Card>

      <Card>
        <StakeInput
          value={form.stake_cents}
          onChange={(cents) => setForm({ ...form, stake_cents: cents })}
        />
      </Card>

      <Card>
        <h2 className="text-xl font-heading font-bold mb-4">Where does your money go if you fail?</h2>
        <p className="text-sm text-muted mb-4">
          Pick an organization you&apos;d hate to fund. That&apos;s the point.
        </p>
        <div className="grid gap-3">
          {ANTI_CHARITIES.map((charity) => (
            <button
              key={charity.id}
              type="button"
              onClick={() => setForm({ ...form, anti_charity: charity.id })}
              className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                form.anti_charity === charity.id
                  ? 'border-amber-500 bg-amber-500/5'
                  : 'border-border hover:border-zinc-400'
              }`}
            >
              <span className="text-2xl">{charity.icon}</span>
              <div>
                <div className="font-medium">{charity.name}</div>
                <div className="text-sm text-muted">{charity.description}</div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heading font-bold">Make it public?</h2>
            <p className="text-sm text-muted mt-1">
              Create a public accountability page others can see
            </p>
          </div>
          <Switch
            checked={form.is_public}
            onCheckedChange={(checked) => setForm({ ...form, is_public: checked })}
          />
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-heading font-bold mb-4">Payment method</h2>
        <p className="text-sm text-muted mb-4">
          We&apos;re authorizing your card now. You will ONLY be charged if you miss your deadline. No charge if you complete it.
        </p>
        <PaymentElement />
      </Card>

      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}

      <Button type="submit" size="lg" disabled={loading || !stripe} className="w-full">
        {loading ? 'Creating commitment...' : 'Stake It'}
      </Button>
    </form>
  )
}

export function CommitmentForm({ clientSecret }: { clientSecret: string }) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#f59e0b',
            borderRadius: '8px',
          },
        },
      }}
    >
      <CommitmentFormInner clientSecret={clientSecret} />
    </Elements>
  )
}
