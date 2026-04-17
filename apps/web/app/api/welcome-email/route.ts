import { NextRequest, NextResponse } from 'next/server'
import { getResend, FROM_EMAIL } from '@/lib/resend'

const WELCOME_HTML = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;">
<tr><td align="center" style="padding:40px 20px;">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

<!-- Logo bar -->
<tr><td style="padding-bottom:32px;">
  <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">●&nbsp;<span style="color:#f59e0b">·</span></span>
  <span style="font-size:20px;font-weight:700;color:#ffffff;">Staked</span>
</td></tr>

<!-- Card -->
<tr><td style="background:#18181b;border:1px solid #27272a;border-radius:12px;padding:40px;">
  
    <h1 style="font-size:26px;font-weight:700;color:#ffffff;margin:0 0 8px;">Welcome to Staked.</h1>
    <p style="font-size:16px;color:#a1a1aa;margin:0 0 28px;line-height:1.6;">You just committed to actually shipping. Here's how to make it count.</p>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding-bottom:16px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:36px;height:36px;background:#f59e0b;border-radius:50%;text-align:center;vertical-align:middle;">
              <span style="font-size:14px;font-weight:700;color:#18181b;">1</span>
            </td>
            <td style="padding-left:16px;">
              <p style="font-size:15px;font-weight:600;color:#ffffff;margin:0;">Create a commitment</p>
              <p style="font-size:14px;color:#71717a;margin:4px 0 0;">Name your deliverable and set a real deadline.</p>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding-bottom:16px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:36px;height:36px;background:#f59e0b;border-radius:50%;text-align:center;vertical-align:middle;">
              <span style="font-size:14px;font-weight:700;color:#18181b;">2</span>
            </td>
            <td style="padding-left:16px;">
              <p style="font-size:15px;font-weight:600;color:#ffffff;margin:0;">Stake real money</p>
              <p style="font-size:14px;color:#71717a;margin:4px 0 0;">Choose an anti-charity. Your card is authorized but not charged yet.</p>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="padding-bottom:28px;">
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:36px;height:36px;background:#f59e0b;border-radius:50%;text-align:center;vertical-align:middle;">
              <span style="font-size:14px;font-weight:700;color:#18181b;">3</span>
            </td>
            <td style="padding-left:16px;">
              <p style="font-size:15px;font-weight:600;color:#ffffff;margin:0;">Ship it — or pay for it</p>
              <p style="font-size:14px;color:#71717a;margin:4px 0 0;">Submit proof before the deadline. Miss it and the charge fires automatically.</p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>

    <div style="background:#0c0c0c;border:1px solid #27272a;border-radius:8px;padding:16px;margin-bottom:28px;">
      <p style="font-size:13px;color:#71717a;margin:0;">💡 <strong style="color:#a1a1aa;">Pro tip:</strong> Start with a stake that actually stings. $25–$50 is the sweet spot for most people.</p>
    </div>

    <a href="https://staked.bootstrapquant.com/commitments/new" style="display:inline-block;background:#f59e0b;color:#18181b;padding:13px 28px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;letter-spacing:0.1px;">Create Your First Commitment →</a>
  
</td></tr>

<!-- Footer -->
<tr><td style="padding-top:24px;text-align:center;">
  <p style="font-size:12px;color:#52525b;margin:0;">Staked · <a href="mailto:support@bootstrapquant.com" style="color:#52525b;">support@bootstrapquant.com</a></p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`

export async function POST(request: NextRequest) {
  const { email } = await request.json()
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }
  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Staked — your first commitment starts here',
      html: WELCOME_HTML,
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Welcome email failed:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
