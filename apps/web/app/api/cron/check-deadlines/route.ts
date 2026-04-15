import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { sendDeadlineReminder, sendCommitmentCharged } from '@/lib/send-email'

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

  // Send deadline reminders for commitments due in the next 25 hours
  const now = new Date()
  const reminderCutoff = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString()
  const { data: upcomingCommitments } = await supabase
    .from('commitments')
    .select('*, profiles(email)')
    .eq('status', 'active')
    .is('reminded_at', null)
    .is('charged_at', null)
    .gte('deadline', now.toISOString())
    .lte('deadline', reminderCutoff)

  const reminders = []
  for (const c of upcomingCommitments || []) {
    if (c.profiles?.email) {
      await sendDeadlineReminder(c.profiles.email, {
        title: c.title,
        stake_cents: c.stake_cents,
        deadline: c.deadline,
        id: c.id,
      })
      await supabase
        .from('commitments')
        .update({ reminded_at: now.toISOString() })
        .eq('id', c.id)
      reminders.push({ id: c.id, status: 'reminded' })
    }
  }

  // Find all active commitments where grace period has expired
  const { data: overdueCommitments, error } = await supabase
    .from('commitments')
    .select('*, profiles(stripe_customer_id, email)')
    .eq('status', 'active')
    .lt('grace_period_ends_at', now.toISOString())

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

      // Send charge notification email
      if (commitment.profiles?.email) {
        sendCommitmentCharged(commitment.profiles.email, {
          title: commitment.title,
          stake_cents: commitment.stake_cents,
          anti_charity: commitment.anti_charity,
        })
      }

      results.push({ id: commitment.id, status: 'charged' })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      results.push({ id: commitment.id, status: 'error', reason: message })
    }
  }

  return NextResponse.json({ reminders: reminders.length, processed: results.length, results })
}
