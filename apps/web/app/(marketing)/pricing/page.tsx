import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-heading font-bold mb-4">Simple, honest pricing</h1>
        <p className="text-lg text-muted">
          Start free. Upgrade when you need more firepower.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
        <Card>
          <h2 className="text-2xl font-heading font-bold mb-1">Free</h2>
          <p className="text-4xl font-heading font-bold mb-6">
            $0<span className="text-base font-normal text-muted">/mo</span>
          </p>
          <ul className="space-y-3 mb-8">
            {[
              '3 active commitments',
              'Up to $100 stake per commitment',
              'All anti-charity options',
              'Dashboard & countdown timers',
              '1 hour grace period',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-muted" />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/signup">
            <Button variant="outline" className="w-full">Get Started Free</Button>
          </Link>
        </Card>

        <Card className="border-primary relative">
          <Badge className="absolute -top-3 right-4">Most Popular</Badge>
          <h2 className="text-2xl font-heading font-bold mb-1">Pro</h2>
          <p className="text-4xl font-heading font-bold mb-6">
            $15<span className="text-base font-normal text-muted">/mo</span>
          </p>
          <ul className="space-y-3 mb-8">
            {[
              'Unlimited active commitments',
              'Up to $5,000 stake per commitment',
              'All anti-charity options',
              'Public accountability pages',
              'Custom deadline times',
              'Commitment history & export',
              'Priority support',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                {f}
              </li>
            ))}
          </ul>
          <Link href="/signup">
            <Button className="w-full">Start Free Trial</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
