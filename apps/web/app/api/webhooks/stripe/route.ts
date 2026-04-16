import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid signature'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (event.type) {
    case 'setup_intent.succeeded': {
      const setupIntent = event.data.object as Stripe.SetupIntent
      await supabase
        .from('commitments')
        .update({
          stripe_payment_method_id: setupIntent.payment_method as string,
        })
        .eq('stripe_setup_intent_id', setupIntent.id)
      break
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const commitmentId = paymentIntent.metadata?.commitment_id
      if (commitmentId) {
        await supabase
          .from('commitments')
          .update({
            status: 'failed',
            stripe_payment_intent_id: paymentIntent.id,
            charged_at: new Date().toISOString(),
          })
          .eq('id', commitmentId)
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const commitmentId = paymentIntent.metadata?.commitment_id
      if (commitmentId) {
        console.error(`Payment failed for commitment ${commitmentId}: ${paymentIntent.last_payment_error?.message}`)
      }
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      const plan = subscription.status === 'active' ? 'pro' : 'free'

      await supabase
        .from('profiles')
        .update({ plan, updated_at: new Date().toISOString() })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await supabase
        .from('profiles')
        .update({ plan: 'free', updated_at: new Date().toISOString() })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      console.error(`Invoice payment failed for customer ${invoice.customer}`)
      break
    }
  }

  return NextResponse.json({ received: true })
}
