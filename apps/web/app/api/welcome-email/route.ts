import { NextRequest, NextResponse } from 'next/server'
import { getResend, FROM_EMAIL } from '@/lib/resend'
import { render } from '@react-email/render'
import Welcome from '@/emails/welcome'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  try {
    const html = await render(Welcome())
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Staked — here's how to make your first commitment",
      html,
    })
  } catch (err) {
    console.error('Welcome email failed:', err)
  }

  return NextResponse.json({ ok: true })
}
