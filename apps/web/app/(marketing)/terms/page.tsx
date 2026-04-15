export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-heading font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-zinc max-w-none space-y-6 text-muted [&_h2]:text-foreground [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_strong]:text-foreground">
        <p>Last updated: April 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By using Staked (&quot;the Service&quot;), you agree to these Terms of Service. If you do not
          agree, do not use the Service.
        </p>

        <h2>2. How Commitments Work</h2>
        <p>
          When you create a commitment, you authorize Staked to charge your payment method for the
          staked amount if you fail to complete your commitment by the deadline plus a 1-hour grace
          period. <strong>Commitments are binding and cannot be cancelled once created.</strong>
        </p>

        <h2>3. Payment Authorization</h2>
        <p>
          By creating a commitment, you expressly authorize us to charge your saved payment method
          for the staked amount upon failure to meet your deadline. You understand that this charge
          is not a purchase of goods or services but a voluntary forfeiture you agreed to as part
          of your accountability commitment.
        </p>

        <h2>4. Grace Period</h2>
        <p>
          All commitments include a 1-hour grace period after the stated deadline. You may submit
          proof of completion at any time before the grace period expires. After the grace period,
          your payment method will be charged automatically.
        </p>

        <h2>5. Proof of Completion</h2>
        <p>
          Proof of completion is self-reported. You are expected to honestly represent your work.
          We reserve the right to investigate and reverse completions that appear fraudulent.
        </p>

        <h2>6. No Refunds on Forfeited Stakes</h2>
        <p>
          <strong>Forfeited stakes are non-refundable.</strong> This is the core mechanism of the
          Service. By creating a commitment, you accept that missed deadlines result in irreversible
          charges.
        </p>

        <h2>7. Anti-Charity Donations</h2>
        <p>
          Forfeited stakes are designated for donation to the anti-charity organization you selected.
          In the current version, funds are held pending implementation of direct donation routing.
          We will provide transparency on fund allocation.
        </p>

        <h2>8. Pro Subscription</h2>
        <p>
          Pro subscriptions are billed monthly and auto-renew. You may cancel at any time through
          the billing portal. Cancellation takes effect at the end of the current billing period.
        </p>

        <h2>9. Termination</h2>
        <p>
          We reserve the right to suspend or terminate accounts that violate these terms or engage
          in fraudulent activity. Active commitments will still be enforced upon termination.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          Staked is provided &quot;as is&quot; without warranties. We are not liable for any indirect,
          incidental, or consequential damages arising from your use of the Service.
        </p>

        <h2>11. Contact</h2>
        <p>Questions about these terms: <strong>legal@bootstrapquant.com</strong></p>
      </div>
    </div>
  )
}
