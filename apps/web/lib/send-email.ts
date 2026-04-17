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
  const html = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<style>
:root { color-scheme: dark; }
body, .outer { background-color: #09090b !important; }
.card { background-color: #18181b !important; }
</style>
</head>
<body style="margin:0;padding:0;background:#09090b;" bgcolor="#09090b">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#09090b" style="background:#09090b;" class="outer">
<tr><td align="center" style="padding:40px 16px;">
<table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

<tr><td style="padding-bottom:20px;">
  <span style="font-size:20px;font-weight:700;color:#ffffff;font-family:-apple-system,sans-serif;">Staked<span style="color:#f59e0b;">&thinsp;·</span></span>
</td></tr>

<tr>
  <td bgcolor="#18181b" style="background:#18181b;border-radius:12px;padding:36px;" class="card">
    
  <p style="font-size:32px;margin:0 0 12px;">🎉</p>
  <h1 style="font-size:26px;font-weight:700;color:#ffffff;margin:0 0 8px;font-family:-apple-system,sans-serif;">You're now on Pro.</h1>
  <p style="font-size:16px;color:#a1a1aa;margin:0 0 24px;line-height:1.6;font-family:-apple-system,sans-serif;">Here's what just unlocked:</p>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
    <tr><td style="padding-bottom:14px;">
    <table cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="20" valign="top" style="padding-top:1px;font-size:16px;color:#f59e0b;font-weight:700;font-family:-apple-system,sans-serif;">✓</td>
      <td style="padding-left:10px;"><p style="font-size:15px;font-weight:600;color:#ffffff;margin:0 0 2px;font-family:-apple-system,sans-serif;">Unlimited commitments</p><p style="font-size:13px;color:#71717a;margin:0;font-family:-apple-system,sans-serif;">No cap on active stakes</p></td>
    </tr></table>
  </td></tr><tr><td style="padding-bottom:14px;">
    <table cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="20" valign="top" style="padding-top:1px;font-size:16px;color:#f59e0b;font-weight:700;font-family:-apple-system,sans-serif;">✓</td>
      <td style="padding-left:10px;"><p style="font-size:15px;font-weight:600;color:#ffffff;margin:0 0 2px;font-family:-apple-system,sans-serif;">Up to $5,000 stake</p><p style="font-size:13px;color:#71717a;margin:0;font-family:-apple-system,sans-serif;">Put serious skin in the game</p></td>
    </tr></table>
  </td></tr><tr><td style="padding-bottom:14px;">
    <table cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="20" valign="top" style="padding-top:1px;font-size:16px;color:#f59e0b;font-weight:700;font-family:-apple-system,sans-serif;">✓</td>
      <td style="padding-left:10px;"><p style="font-size:15px;font-weight:600;color:#ffffff;margin:0 0 2px;font-family:-apple-system,sans-serif;">Public accountability pages</p><p style="font-size:13px;color:#71717a;margin:0;font-family:-apple-system,sans-serif;">Share your commitments publicly</p></td>
    </tr></table>
  </td></tr><tr><td style="padding-bottom:14px;">
    <table cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="20" valign="top" style="padding-top:1px;font-size:16px;color:#f59e0b;font-weight:700;font-family:-apple-system,sans-serif;">✓</td>
      <td style="padding-left:10px;"><p style="font-size:15px;font-weight:600;color:#ffffff;margin:0 0 2px;font-family:-apple-system,sans-serif;">Recurring commitments</p><p style="font-size:13px;color:#71717a;margin:0;font-family:-apple-system,sans-serif;">Daily, weekly, or monthly repeats</p></td>
    </tr></table>
  </td></tr><tr><td style="padding-bottom:14px;">
    <table cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="20" valign="top" style="padding-top:1px;font-size:16px;color:#f59e0b;font-weight:700;font-family:-apple-system,sans-serif;">✓</td>
      <td style="padding-left:10px;"><p style="font-size:15px;font-weight:600;color:#ffffff;margin:0 0 2px;font-family:-apple-system,sans-serif;">Witness system</p><p style="font-size:13px;color:#71717a;margin:0;font-family:-apple-system,sans-serif;">Invite someone to verify your proof</p></td>
    </tr></table>
  </td></tr><tr><td style="padding-bottom:14px;">
    <table cellpadding="0" cellspacing="0" border="0"><tr>
      <td width="20" valign="top" style="padding-top:1px;font-size:16px;color:#f59e0b;font-weight:700;font-family:-apple-system,sans-serif;">✓</td>
      <td style="padding-left:10px;"><p style="font-size:15px;font-weight:600;color:#ffffff;margin:0 0 2px;font-family:-apple-system,sans-serif;">Milestone check-ins</p><p style="font-size:13px;color:#71717a;margin:0;font-family:-apple-system,sans-serif;">Log progress on long commitments</p></td>
    </tr></table>
  </td></tr>
  </table>
  <table cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#f59e0b" style="background:#f59e0b;border-radius:8px;"><a href="https://staked.bootstrapquant.com/commitments/new" style="display:block;padding:13px 28px;font-size:14px;font-weight:700;color:#18181b;text-decoration:none;font-family:-apple-system,sans-serif;">Start a Pro Commitment →</a></td></tr></table>
  <p style="margin:16px 0 0;"><a href="https://staked.bootstrapquant.com/billing" style="font-size:13px;color:#52525b;text-decoration:none;font-family:-apple-system,sans-serif;">Manage billing →</a></p>

  </td>
</tr>

<tr><td style="padding-top:20px;text-align:center;">
  <p style="font-size:12px;color:#52525b;margin:0;font-family:-apple-system,sans-serif;">Staked · <a href="mailto:support@bootstrapquant.com" style="color:#52525b;text-decoration:none;">support@bootstrapquant.com</a></p>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`
  try {
    await getResend().emails.send({ from: FROM_EMAIL, to, subject: "You\'re now on Staked Pro 🎉", html })
  } catch (err) { console.error('Pro upgrade email failed:', err) }
}
