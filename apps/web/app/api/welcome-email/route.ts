import { NextRequest, NextResponse } from 'next/server'
import { getResend, FROM_EMAIL } from '@/lib/resend'

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Staked — time to make your deadlines real',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #1c1917; margin-bottom: 16px;">Welcome to Staked!</h1>
          <p style="font-size: 16px; line-height: 24px; color: #3f3f46; margin-bottom: 8px;">
            You just took the first step toward actually hitting your deadlines.
          </p>
          <p style="font-size: 16px; line-height: 24px; color: #3f3f46; margin-bottom: 24px;">
            Here's how to get started:
          </p>
          <ol style="font-size: 16px; line-height: 28px; color: #3f3f46; margin-bottom: 24px; padding-left: 20px;">
            <li>Create your first commitment</li>
            <li>Set a realistic deadline</li>
            <li>Stake an amount that motivates you ($25 is a good start)</li>
            <li>Ship it and prove completion</li>
          </ol>
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://staked.bootstrapquant.com/commitments/new"
               style="background-color: #dc2626; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; display: inline-block;">
              Create Your First Commitment
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;" />
          <p style="font-size: 12px; color: #a8a29e;">
            Staked — Deadline accountability with real money on the line.<br/>
            support@bootstrapquant.com
          </p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Welcome email failed:', err)
  }

  return NextResponse.json({ ok: true })
}
