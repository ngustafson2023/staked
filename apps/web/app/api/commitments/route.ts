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

  const deadlineDate = new Date(deadline)
  const gracePeriodEndsAt = new Date(deadlineDate.getTime() + 60 * 60 * 1000).toISOString()

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
