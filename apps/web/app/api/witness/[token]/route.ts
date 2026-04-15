import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = await createServiceClient()

  const { data: witness, error } = await supabase
    .from('witnesses')
    .select('id, status, commitment_id')
    .eq('token', token)
    .single()

  if (error || !witness) {
    return NextResponse.json({ error: 'Witness not found' }, { status: 404 })
  }

  const { data: commitment, error: commitError } = await supabase
    .from('commitments')
    .select('title, deadline, stake_cents, proof_url, proof_note')
    .eq('id', witness.commitment_id)
    .single()

  if (commitError || !commitment) {
    return NextResponse.json({ error: 'Commitment not found' }, { status: 404 })
  }

  return NextResponse.json({
    ...commitment,
    witness_status: witness.status,
  })
}
