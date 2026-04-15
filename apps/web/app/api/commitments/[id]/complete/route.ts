import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'
import { sendCommitmentCompleted } from '@/lib/send-email'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: commitment, error: fetchError } = await supabase
    .from('commitments')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !commitment) {
    return NextResponse.json({ error: 'Commitment not found' }, { status: 404 })
  }

  if (commitment.status !== 'active') {
    return NextResponse.json({ error: 'Commitment is not active' }, { status: 400 })
  }

  // Check if within grace period
  const now = new Date()
  const graceEnd = new Date(commitment.grace_period_ends_at)
  if (now > graceEnd) {
    return NextResponse.json({ error: 'Grace period has expired' }, { status: 400 })
  }

  const body = await request.json()
  const { proof_url, proof_note } = body

  if (!proof_note) {
    return NextResponse.json({ error: 'Proof note is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('commitments')
    .update({
      status: 'completed',
      proof_url: proof_url || null,
      proof_note,
      completed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Update streak (use service client for the RPC call)
  const serviceClient = await createServiceClient()
  await serviceClient.rpc('update_streak', { p_user_id: user.id })

  // Send completion email
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('current_streak')
    .eq('id', user.id)
    .single()
  sendCommitmentCompleted(
    user.email!,
    { title: commitment.title, stake_cents: commitment.stake_cents },
    profile?.current_streak || 1
  )

  // Handle recurring commitments
  if (commitment.recurrence && commitment.recurrence !== 'none') {
    const oldDeadline = new Date(commitment.deadline)
    let newDeadline: Date

    switch (commitment.recurrence) {
      case 'daily':
        newDeadline = new Date(oldDeadline.getTime() + 1 * 24 * 60 * 60 * 1000)
        break
      case 'weekly':
        newDeadline = new Date(oldDeadline.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      case 'monthly':
        newDeadline = new Date(oldDeadline.getTime() + 30 * 24 * 60 * 60 * 1000)
        break
      default:
        newDeadline = oldDeadline
    }

    const gracePeriodEndsAt = new Date(newDeadline.getTime() + 60 * 60 * 1000).toISOString()
    const parentId = commitment.parent_commitment_id || commitment.id

    const newCommitmentData: Record<string, unknown> = {
      user_id: user.id,
      title: commitment.title,
      description: commitment.description,
      deadline: newDeadline.toISOString(),
      stake_cents: commitment.stake_cents,
      anti_charity: commitment.anti_charity,
      is_public: commitment.is_public,
      stripe_setup_intent_id: commitment.stripe_setup_intent_id,
      grace_period_ends_at: gracePeriodEndsAt,
      recurrence: commitment.recurrence,
      parent_commitment_id: parentId,
    }

    if (commitment.is_public) {
      newCommitmentData.public_slug = generateSlug()
    }

    await supabase.from('commitments').insert(newCommitmentData)
  }

  return NextResponse.json(data)
}
