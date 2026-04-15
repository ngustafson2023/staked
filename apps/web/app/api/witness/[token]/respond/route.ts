import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = await createServiceClient()

  const { data: witness, error: witnessError } = await supabase
    .from('witnesses')
    .select('id, status, commitment_id')
    .eq('token', token)
    .single()

  if (witnessError || !witness) {
    return NextResponse.json({ error: 'Witness not found' }, { status: 404 })
  }

  if (witness.status !== 'pending') {
    return NextResponse.json({ error: 'Already responded' }, { status: 400 })
  }

  const body = await request.json()
  const { approved, note } = body

  const newStatus = approved ? 'approved' : 'rejected'

  const { error: updateError } = await supabase
    .from('witnesses')
    .update({
      status: newStatus,
      note: note || null,
      responded_at: new Date().toISOString(),
    })
    .eq('id', witness.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // If approved, mark commitment as completed
  if (approved) {
    const { data: commitment } = await supabase
      .from('commitments')
      .select('id, status, user_id')
      .eq('id', witness.commitment_id)
      .single()

    if (commitment && commitment.status === 'active') {
      await supabase
        .from('commitments')
        .update({
          status: 'completed',
          proof_note: `Verified by witness${note ? ': ' + note : ''}`,
          completed_at: new Date().toISOString(),
        })
        .eq('id', commitment.id)

      // Update streak
      await supabase.rpc('update_streak', { p_user_id: commitment.user_id })
    }
  }

  return NextResponse.json({ status: newStatus })
}
