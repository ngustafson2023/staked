import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, ArrowRight, Target, DollarSign, Zap } from 'lucide-react'
import { formatCents } from '@/lib/utils'

interface PublicCommitment {
  id: string
  title: string
  stake_cents: number
  status: string
  anti_charity: string
  deadline: string
  created_at: string
}

async function getPublicFeed(): Promise<PublicCommitment[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/public-feed`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

const statusBadgeVariant: Record<string, string> = {
  active: 'default',
  completed: 'success',
  failed: 'destructive',
}

export default async function LandingPage() {
  const feed = await getPublicFeed()

  return (
    <>
      {/* Hero */}
      <section className="bg-zinc-950 text-zinc-50">
        <div className="max-w-4xl mx-auto px-6 py-24 lg:py-32 text-center">
          <Badge className="mb-6 bg-amber-500/10 text-amber-400 border-amber-500/20">
            Accountability, reimagined
          </Badge>
          <h1 className="text-5xl lg:text-[60px] font-heading font-bold leading-tight mb-6">
            Stop missing deadlines.
            <br />
            <span className="text-amber-500">Put your money where your mouth is.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
            Set a deadline for your work. Stake real money on it. If you miss it, your money goes
            to an organization you&apos;d hate to support. Actually ship.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-base">
              Start Your First Commitment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-zinc-500 mt-4">No credit card required to sign up</p>
        </div>
      </section>

      {/* Live Stakes / Social Proof Feed */}
      <section className="bg-zinc-950 text-zinc-50 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-heading font-bold text-center mb-8">
            What people are staking
          </h2>
          {feed.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin">
              {feed.map((item) => (
                <Card
                  key={item.id}
                  className="min-w-[280px] max-w-[320px] shrink-0 bg-zinc-900 border-zinc-800"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={statusBadgeVariant[item.status] as 'default'}
                      className={
                        item.status === 'active'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : undefined
                      }
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="font-heading font-bold text-zinc-100 mb-1 truncate">
                    {item.title}
                  </p>
                  <p className="text-sm text-amber-400">
                    {formatCents(item.stake_cents)} on the line
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-zinc-500">
              Be the first to stake something publicly
            </p>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-background py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-heading font-bold text-center mb-12">How it works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Target,
                title: 'Set your deadline',
                description: 'Define what you\'re shipping and when. Be specific — this is a commitment, not a wish.',
              },
              {
                icon: DollarSign,
                title: 'Stake real money',
                description: 'Put $25–$5,000 on the line. Choose an anti-charity — an org you\'d hate to fund.',
              },
              {
                icon: Zap,
                title: 'Ship or pay',
                description: 'Complete your work before the deadline and your money stays safe. Miss it, and it\'s gone.',
              },
            ].map((step, i) => (
              <Card key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 mb-4">
                  <step.icon className="h-6 w-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">{step.title}</h3>
                <p className="text-muted">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="bg-zinc-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">Why it works</h2>
          <p className="text-lg text-muted mb-4">
            Loss aversion is one of the most powerful forces in human psychology. Research shows
            that <strong className="text-foreground">losing $50 hurts twice as much as gaining $50 feels good</strong>.
          </p>
          <p className="text-lg text-muted">
            Staked turns that cognitive bias into a productivity engine. When real money is on the
            line — going to a cause you actively oppose — procrastination becomes genuinely painful.
          </p>
        </div>
      </section>

      {/* Anti-Charity */}
      <section className="bg-background py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading font-bold mb-4">Your money goes somewhere that hurts</h2>
          <p className="text-lg text-muted mb-8">
            Pick the organization you&apos;d hate to support the most. That&apos;s where your money goes if you fail.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 text-left">
            {[
              { name: 'NRA Foundation', icon: '🔫' },
              { name: 'Planned Parenthood', icon: '🏥' },
              { name: 'Trump 2028 Campaign', icon: '🏛️' },
              { name: 'ACLU', icon: '⚖️' },
              { name: 'Heritage Foundation', icon: '🦅' },
            ].map((charity) => (
              <Card key={charity.name} className="flex items-center gap-3">
                <span className="text-2xl">{charity.icon}</span>
                <span className="font-medium">{charity.name}</span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-zinc-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-heading font-bold text-center mb-12">Simple pricing</h2>
          <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
            <Card>
              <h3 className="text-xl font-heading font-bold mb-1">Free</h3>
              <p className="text-3xl font-heading font-bold mb-4">$0<span className="text-base font-normal text-muted">/mo</span></p>
              <ul className="space-y-2 mb-6">
                {['3 active commitments', 'Up to $100 stake', 'Standard anti-charities', 'Email reminders'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-muted" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </Card>
            <Card className="border-amber-500 relative">
              <Badge className="absolute -top-3 right-4">Popular</Badge>
              <h3 className="text-xl font-heading font-bold mb-1">Pro</h3>
              <p className="text-3xl font-heading font-bold mb-4">$15<span className="text-base font-normal text-muted">/mo</span></p>
              <ul className="space-y-2 mb-6">
                {['Unlimited commitments', 'Up to $5,000 stake', 'Custom deadline times', 'Public accountability page', 'Commitment history export'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-amber-500" />
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
      </section>

      {/* FAQ */}
      <section className="bg-background py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-heading font-bold text-center mb-12">FAQ</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Will I actually be charged if I miss my deadline?',
                a: 'Yes. That\'s the entire point. When you create a commitment, you authorize us to charge your card. If your deadline passes without proof of completion, you\'re charged automatically.',
              },
              {
                q: 'Can I cancel a commitment?',
                a: 'No. Once a commitment is created and your card is authorized, it cannot be cancelled. This is by design — the inability to back out is what makes it work.',
              },
              {
                q: 'What counts as "proof" of completion?',
                a: 'You submit a link to your work (GitHub repo, deployed site, shared doc) and a brief description of what you shipped. We trust you to be honest — this is about self-accountability.',
              },
              {
                q: 'Is there a grace period?',
                a: 'Yes. You have 1 hour after your deadline to submit proof of completion. After that, your card is charged automatically.',
              },
              {
                q: 'Does my money actually go to the anti-charity?',
                a: 'In our current version, charged stakes are held in our Stripe account pending donation routing. We\'re building direct donation infrastructure and will be transparent about fund allocation.',
              },
              {
                q: 'Can I get a refund?',
                a: 'Forfeited stakes are non-refundable by design. For Pro subscriptions, we offer a 7-day refund if no commitments were created. See our refund policy for details.',
              },
            ].map((faq, i) => (
              <Card key={i}>
                <h3 className="font-heading font-bold mb-2">{faq.q}</h3>
                <p className="text-muted">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-zinc-950 text-zinc-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading font-bold mb-4">Ready to actually ship?</h2>
          <p className="text-lg text-zinc-400 mb-8">
            Stop setting deadlines you know you&apos;ll miss. Put some skin in the game.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-base">
              Create Your First Commitment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
