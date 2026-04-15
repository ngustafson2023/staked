export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-heading font-bold mb-8">Refund Policy</h1>
      <div className="prose prose-zinc max-w-none space-y-6 text-muted [&_h2]:text-foreground [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_strong]:text-foreground">
        <p>Last updated: April 2026</p>

        <h2>Forfeited Stakes</h2>
        <p>
          <strong>Forfeited stakes are non-refundable.</strong> This is the entire point of Staked.
          When you create a commitment and miss your deadline, your card is charged the staked amount.
          This charge is intentional and was authorized by you at the time of commitment creation.
        </p>
        <p>
          We understand this may feel painful — that&apos;s by design. The discomfort of potential loss
          is the mechanism that drives accountability.
        </p>

        <h2>Technical Errors</h2>
        <p>
          If you were charged due to a verified technical error on our part (e.g., the system failed
          to register your proof of completion submitted before the deadline), we will issue a full
          refund within 30 days. Contact us with your commitment details and we will investigate.
        </p>

        <h2>Pro Subscription</h2>
        <p>
          Pro subscription payments are refundable within 7 days of the initial charge, provided you
          have not created any commitments during that period. After 7 days, or after creating a
          commitment on the Pro plan, subscription fees are non-refundable.
        </p>
        <p>
          You may cancel your Pro subscription at any time. Your access continues through the end
          of the current billing period.
        </p>

        <h2>How to Request a Refund</h2>
        <p>
          Email <strong>support@staked.so</strong> with your account email and a description of your
          refund request. We aim to respond within 2 business days.
        </p>
      </div>
    </div>
  )
}
