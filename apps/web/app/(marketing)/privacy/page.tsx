export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-heading font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-zinc max-w-none space-y-6 text-muted [&_h2]:text-foreground [&_h2]:font-heading [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_strong]:text-foreground">
        <p>Last updated: April 2026</p>

        <h2>Information We Collect</h2>
        <p>
          When you create an account, we collect your <strong>email address</strong> for authentication
          and communication. When you create a commitment, we collect your <strong>payment method</strong>
          through Stripe — we never store your full card number, CVV, or other sensitive payment details
          on our servers.
        </p>

        <h2>How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide and maintain the Staked service</li>
          <li>Process payments when commitments are forfeited</li>
          <li>Send deadline reminders and account notifications</li>
          <li>Improve our service</li>
        </ul>

        <h2>Payment Processing</h2>
        <p>
          All payment processing is handled by <strong>Stripe</strong>. Your payment information is
          transmitted directly to Stripe and is subject to Stripe&apos;s privacy policy. We store
          only Stripe customer IDs and payment method references.
        </p>

        <h2>Data Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We share data
          only with Stripe for payment processing and Supabase for data storage.
        </p>

        <h2>Public Commitments</h2>
        <p>
          If you choose to make a commitment public, the commitment title, description, deadline,
          stake amount, and status will be visible to anyone with the public link. Your email address
          is never shown publicly.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain your account data for as long as your account is active. You may request deletion
          of your account and associated data by contacting us.
        </p>

        <h2>Contact</h2>
        <p>For privacy-related inquiries: <strong>privacy@bootstrapquant.com</strong></p>
      </div>
    </div>
  )
}
