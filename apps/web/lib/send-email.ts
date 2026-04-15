import { render } from "@react-email/render";
import { getResend, FROM_EMAIL } from "./resend";
import DeadlineReminder from "@/emails/deadline-reminder";
import CommitmentCharged from "@/emails/commitment-charged";
import CommitmentCompleted from "@/emails/commitment-completed";
import WitnessInvite from "@/emails/witness-invite";

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
