import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  // Verify cron secret for Vercel cron jobs
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Also allow without auth for development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const supabase = await createServiceClient()

  // Find all active commitments where grace period has expired
  const { data: overdueCommitments, error } = await supabase
    .from('commitments')
    .select('*, profiles(stripe_customer_id)')
    .eq('status', 'active')
    .lt('grace_period_ends_at', new Date().toISOString())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const results = []

  for (const commitment of overdueCommitments || []) {
    try {
      const setupIntent = await getStripe().setupIntents.retrieve(commitment.stripe_setup_intent_id)
      const paymentMethodId = setupIntent.payment_method as string

      if (!paymentMethodId) {
        results.push({ id: commitment.id, status: 'error', reason: 'No payment method' })
        continue
      }

      const paymentIntent = await getStripe().paymentIntents.create({
        amount: commitment.stake_cents,
        currency: 'usd',
        customer: commitment.profiles.stripe_customer_id,
        payment_method: paymentMethodId,
        off_session: true,
        confirm: true,
        description: `Staked commitment failed: ${commitment.title}`,
        metadata: {
          commitment_id: commitment.id,
          anti_charity: commitment.anti_charity,
        },
      })

      await supabase
        .from('commitments')
        .update({
          status: 'failed',
          stripe_payment_intent_id: paymentIntent.id,
          stripe_payment_method_id: paymentMethodId,
          charged_at: new Date().toISOString(),
        })
        .eq('id', commitment.id)

      results.push({ id: commitment.id, status: 'charged' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      results.push({ id: commitment.id, status: 'error', reason: message })
    }
  }

  return NextResponse.json({ processed: results.length, results })
}
