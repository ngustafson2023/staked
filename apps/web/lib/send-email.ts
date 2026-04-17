import { render } from "@react-email/render";
import { getResend, FROM_EMAIL } from "./resend";
import DeadlineReminder from "@/emails/deadline-reminder";
import CommitmentCharged from "@/emails/commitment-charged";
import CommitmentCompleted from "@/emails/commitment-completed";
import WitnessInvite from "@/emails/witness-invite";
import ProUpgrade from "@/emails/pro-upgrade";

const BASE_URL = "https://staked.bootstrapquant.com";

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export async function sendDeadlineReminder(
  to: string,
  commitment: { title: string; stake_cents: number; deadline: string; id: string }
) {
  try {
    const hoursLeft = Math.max(
      1,
      Math.round(
        (new Date(commitment.deadline).getTime() - Date.now()) / (1000 * 60 * 60)
      )
    );
    const html = await render(
      DeadlineReminder({
        title: commitment.title,
        hoursLeft,
        stakeDollars: formatCents(commitment.stake_cents),
        commitmentUrl: `${BASE_URL}/dashboard`,
      })
    );
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `⏰ Your deadline is coming up: ${commitment.title}`,
      html,
    });
  } catch (err) {
    console.error("Failed to send deadline reminder email:", err);
  }
}

export async function sendCommitmentCharged(
  to: string,
  commitment: { title: string; stake_cents: number; anti_charity: string }
) {
  try {
    const html = await render(
      CommitmentCharged({
        title: commitment.title,
        amountDollars: formatCents(commitment.stake_cents),
        antiCharity: commitment.anti_charity,
        dashboardUrl: `${BASE_URL}/dashboard`,
      })
    );
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `💸 You missed your deadline — ${formatCents(commitment.stake_cents)} charged`,
      html,
    });
  } catch (err) {
    console.error("Failed to send commitment charged email:", err);
  }
}

export async function sendCommitmentCompleted(
  to: string,
  commitment: { title: string; stake_cents: number },
  streak: number
) {
  try {
    const html = await render(
      CommitmentCompleted({
        title: commitment.title,
        amountDollars: formatCents(commitment.stake_cents),
        streak,
        dashboardUrl: `${BASE_URL}/dashboard`,
      })
    );
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `🎉 You did it! Commitment complete`,
      html,
    });
  } catch (err) {
    console.error("Failed to send commitment completed email:", err);
  }
}

export async function sendWitnessInvite(
  to: string,
  params: {
    committerEmail: string;
    commitment: { title: string; stake_cents: number };
    token: string;
  }
) {
  try {
    const html = await render(
      WitnessInvite({
        committerName: params.committerEmail,
        title: params.commitment.title,
        stakeDollars: formatCents(params.commitment.stake_cents),
        witnessUrl: `${BASE_URL}/witness/${params.token}`,
      })
    );
    await getResend().emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${params.committerEmail} needs you to verify their commitment`,
      html,
    });
  } catch (err) {
    console.error("Failed to send witness invite email:", err);
  }
}

export async function sendProUpgradeEmail(to: string) {
  const PRO_HTML = `<!DOCTYPE html>
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
  
    <p style="font-size:28px;margin:0 0 8px;">🎉</p>
    <h1 style="font-size:26px;font-weight:700;color:#ffffff;margin:0 0 8px;">You're now on Pro.</h1>
    <p style="font-size:16px;color:#a1a1aa;margin:0 0 28px;line-height:1.6;">Here's what just unlocked:</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      
      <tr><td style="padding-bottom:14px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:20px;vertical-align:top;padding-top:2px;"><span style="color:#f59e0b;font-size:14px;">✓</span></td>
          <td style="padding-left:10px;">
            <p style="font-size:15px;font-weight:600;color:#ffffff;margin:0;">Unlimited commitments</p>
            <p style="font-size:13px;color:#71717a;margin:2px 0 0;">No cap on active stakes</p>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding-bottom:14px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:20px;vertical-align:top;padding-top:2px;"><span style="color:#f59e0b;font-size:14px;">✓</span></td>
          <td style="padding-left:10px;">
            <p style="font-size:15px;font-weight:600;color:#ffffff;margin:0;">Up to $5,000 stake</p>
            <p style="font-size:13px;color:#71717a;margin:2px 0 0;">Put serious skin in the game</p>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding-bottom:14px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:20px;vertical-align:top;padding-top:2px;"><span style="color:#f59e0b;font-size:14px;">✓</span></td>
          <td style="padding-left:10px;">
            <p style="font-size:15px;font-weight:600;color:#ffffff;margin:0;">Public accountability pages</p>
            <p style="font-size:13px;color:#71717a;margin:2px 0 0;">Share your commitments publicly</p>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding-bottom:14px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:20px;vertical-align:top;padding-top:2px;"><span style="color:#f59e0b;font-size:14px;">✓</span></td>
          <td style="padding-left:10px;">
            <p style="font-size:15px;font-weight:600;color:#ffffff;margin:0;">Recurring commitments</p>
            <p style="font-size:13px;color:#71717a;margin:2px 0 0;">Daily, weekly, or monthly repeats</p>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding-bottom:14px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:20px;vertical-align:top;padding-top:2px;"><span style="color:#f59e0b;font-size:14px;">✓</span></td>
          <td style="padding-left:10px;">
            <p style="font-size:15px;font-weight:600;color:#ffffff;margin:0;">Witness system</p>
            <p style="font-size:13px;color:#71717a;margin:2px 0 0;">Invite someone to verify your proof</p>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding-bottom:14px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:20px;vertical-align:top;padding-top:2px;"><span style="color:#f59e0b;font-size:14px;">✓</span></td>
          <td style="padding-left:10px;">
            <p style="font-size:15px;font-weight:600;color:#ffffff;margin:0;">Milestone check-ins</p>
            <p style="font-size:13px;color:#71717a;margin:2px 0 0;">Log progress on long-term commitments</p>
          </td>
        </tr></table>
      </td></tr>
    </table>

    <a href="https://staked.bootstrapquant.com/commitments/new" style="display:inline-block;background:#f59e0b;color:#18181b;padding:13px 28px;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none;letter-spacing:0.1px;">Start a Pro Commitment →</a>
    <p style="margin:16px 0 0;"><a href="https://staked.bootstrapquant.com/billing" style="font-size:13px;color:#52525b;">Manage billing</a></p>
  
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
  try {
    const { resend } = await import('./resend').then(m => ({ resend: m.getResend() }))
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "You're now on Staked Pro 🎉",
      html: PRO_HTML,
    })
  } catch (err) {
    console.error('Pro upgrade email failed:', err)
  }
}
