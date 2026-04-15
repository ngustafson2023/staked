import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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

  return NextResponse.json(data)
}
