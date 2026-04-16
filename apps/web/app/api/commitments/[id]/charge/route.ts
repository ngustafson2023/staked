import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { sendCommitmentCharged } from '@/lib/send-email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only callable by the cron job (via CRON_SECRET) or the dashboard client-side check
  // Both the cron and dashboard should pass the secret; this prevents public abuse
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const isCron = cronSecret && authHeader === `Bearer ${cronSecret}`

  const { id } = await params
  const supabase = await createServiceClient()

  // If not called by cron, verify the commitment belongs to the authenticated user
  if (!isCron) {
    const { createClient } = await import('@/lib/supabase/server')
    const userClient = await createClient()
    const { data: { user } } = await userClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Verify ownership
    const { data: owned } = await supabase
      .from('commitments')
      .select('id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    if (!owned) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  const { data: commitment, error: fetchError } = await supabase
    .from('commitments')
    .select('*, profiles(stripe_customer_id, email)')
    .eq('id', id)
    .single()

  if (fetchError || !commitment) {
    return NextResponse.json({ error: 'Commitment not found' }, { status: 404 })
  }

  if (commitment.status !== 'active') {
    return NextResponse.json({ error: 'Commitment is not active' }, { status: 400 })
  }

  // Verify grace period has expired
  const now = new Date()
  const graceEnd = new Date(commitment.grace_period_ends_at)
  if (now <= graceEnd) {
    return NextResponse.json({ error: 'Grace period has not expired yet' }, { status: 400 })
  }

  // Get payment method from SetupIntent
  const setupIntent = await getStripe().setupIntents.retrieve(commitment.stripe_setup_intent_id)
  const paymentMethodId = setupIntent.payment_method as string

  if (!paymentMethodId) {
    return NextResponse.json({ error: 'No payment method found' }, { status: 400 })
  }

  try {
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
      .eq('id', id)

    // Send charge notification email
    if (commitment.profiles?.email) {
      sendCommitmentCharged(commitment.profiles.email, {
        title: commitment.title,
        stake_cents: commitment.stake_cents,
        anti_charity: commitment.anti_charity,
      })
    }

    return NextResponse.json({ success: true, payment_intent_id: paymentIntent.id })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Charge failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
