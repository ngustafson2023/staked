import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('commitments')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, deadline, stake_cents, anti_charity, is_public, stripe_setup_intent_id } = body

  if (!title || !deadline || !stake_cents || !anti_charity || !stripe_setup_intent_id) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (stake_cents < 1000) {
    return NextResponse.json({ error: 'Minimum stake is $10' }, { status: 400 })
  }

  // Free tier limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()
  const plan = profile?.plan || 'free'

  if (plan !== 'pro') {
    const { count } = await supabase
      .from('commitments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'active')

    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: 'Free plan is limited to 3 active commitments. Upgrade to Pro for unlimited.', code: 'LIMIT_COMMITMENTS' },
        { status: 403 }
      )
    }

    if (stake_cents > 10000) {
      return NextResponse.json(
        { error: 'Free plan is limited to $100 stake. Upgrade to Pro for up to $5,000.', code: 'LIMIT_STAKE' },
        { status: 403 }
      )
    }

    if (is_public) {
      return NextResponse.json(
        { error: 'Public commitments require Pro. Upgrade to share your accountability page.', code: 'LIMIT_PUBLIC' },
        { status: 403 }
      )
    }

    const recurrence = body.recurrence || 'none'
    if (recurrence !== 'none') {
      return NextResponse.json(
        { error: 'Recurring commitments require Pro.', code: 'LIMIT_RECURRING' },
        { status: 403 }
      )
    }
  }

  const deadlineDate = new Date(deadline)
  const gracePeriodEndsAt = new Date(deadlineDate.getTime() + 60 * 60 * 1000).toISOString()

  const recurrence = body.recurrence || 'none'

  const commitmentData: Record<string, unknown> = {
    user_id: user.id,
    title,
    description: description || null,
    deadline,
    stake_cents,
    anti_charity,
    is_public: is_public || false,
    stripe_setup_intent_id,
    grace_period_ends_at: gracePeriodEndsAt,
    recurrence,
  }

  if (is_public) {
    commitmentData.public_slug = generateSlug()
  }

  const { data, error } = await supabase
    .from('commitments')
    .insert(commitmentData)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
