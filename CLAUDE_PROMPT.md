# Build: Staked — Deadline Accountability SaaS

## What you're building
**Staked** is a professional deadline accountability app. Users set work deadlines, stake real money on them via Stripe, and automatically lose that money to an anti-charity if they miss the deadline.

Tagline: *Set a deadline. Put money on it. Actually ship.*

Target user: Solo freelancers, indie makers, remote professionals who want skin in the game on work deliverables.

---

## Tech Stack
- **Monorepo**: Turborepo with `apps/web` (Next.js 15 App Router) and `packages/core`
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (Postgres + SSR auth)
- **Payments**: Stripe (payment method authorization on commitment creation, charge on failure)
- **Fonts**: Geist (body) + Cal Sans or Space Grotesk (headings)
- **Icons**: lucide-react only

## Environment Variables (will be set in Vercel — use process.env)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL
```

---

## Design Rules (follow strictly)

**Color palette:**
- Primary: zinc/slate neutrals + one accent color: amber-500 (#F59E0B) for CTAs and stakes
- Background: white (#fafafa light, #09090b dark)
- Text: zinc-900 light, zinc-50 dark
- Danger/failure: red-500
- Success: emerald-500
- Never pure black/white

**Typography:**
- Headings: Space Grotesk 700 (via Google Fonts next/font or `npm install @fontsource/space-grotesk`)
- Body: Geist (via `npm install geist`)
- Scale: hero 60px, h1 48px, h2 36px, h3 24px, body 16px
- Never set body text below 16px

**Spacing:** 4px grid. Cards: 24px padding, 12px radius. Buttons: py-3 px-6.

**Aesthetic:** Clean, serious, professional. NOT gamified. NOT consumer. Think Linear or Stripe's design sensibility — not Duolingo. Dark, high-contrast landing page hero. Clean white dashboard.

**Buttons:**
- Primary: amber-500 bg, zinc-900 text, hover amber-400
- Secondary: zinc-900 bg, white text
- Destructive: red-500
- All buttons: font-medium, rounded-lg, transition-colors

---

## Database Schema (Supabase)

```sql
-- Users table extends auth.users
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  stripe_customer_id text,
  plan text default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz default now()
);

-- Commitments
create table public.commitments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  deadline timestamptz not null,
  stake_cents integer not null check (stake_cents >= 1000), -- min $10
  anti_charity text not null default 'nra', -- nra | planned_parenthood | trump_campaign | aclu
  status text default 'active' check (status in ('active', 'completed', 'failed', 'cancelled')),
  proof_url text,
  proof_note text,
  stripe_payment_method_id text,
  stripe_setup_intent_id text,
  stripe_payment_intent_id text, -- set when charged
  is_public boolean default false,
  public_slug text unique,
  completed_at timestamptz,
  charged_at timestamptz,
  grace_period_ends_at timestamptz, -- deadline + 1 hour
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.commitments enable row level security;

-- RLS Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own commitments" on public.commitments for select using (auth.uid() = user_id);
create policy "Users can insert own commitments" on public.commitments for insert with check (auth.uid() = user_id);
create policy "Users can update own commitments" on public.commitments for update using (auth.uid() = user_id);
-- Public commitments viewable by anyone
create policy "Public commitments are viewable" on public.commitments for select using (is_public = true);

-- Trigger: create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## App Structure

```
apps/web/
├── app/
│   ├── (marketing)/           # Public pages
│   │   ├── page.tsx           # Landing page
│   │   ├── pricing/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   └── refund-policy/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (app)/                 # Authenticated
│   │   ├── layout.tsx         # Sidebar layout
│   │   ├── dashboard/page.tsx
│   │   ├── commitments/
│   │   │   ├── new/page.tsx   # Create commitment
│   │   │   └── [id]/page.tsx  # Commitment detail
│   │   ├── settings/page.tsx
│   │   └── billing/page.tsx
│   ├── c/[slug]/page.tsx      # Public commitment page
│   ├── api/
│   │   ├── webhooks/stripe/route.ts
│   │   ├── commitments/
│   │   │   ├── route.ts       # GET, POST
│   │   │   └── [id]/
│   │   │       ├── route.ts   # GET, PATCH
│   │   │       └── complete/route.ts
│   │   ├── stripe/
│   │   │   ├── setup-intent/route.ts
│   │   │   └── portal/route.ts
│   │   └── cron/check-deadlines/route.ts
│   ├── layout.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/                    # shadcn components
│   ├── commitment-card.tsx
│   ├── commitment-form.tsx
│   ├── stake-input.tsx
│   ├── countdown-timer.tsx
│   ├── proof-form.tsx
│   └── nav/
│       ├── sidebar.tsx
│       └── top-bar.tsx
└── lib/
    ├── supabase/
    │   ├── client.ts
    │   ├── server.ts
    │   └── middleware.ts
    ├── stripe.ts
    ├── anti-charities.ts
    └── utils.ts
```

---

## Core User Flows

### 1. Landing Page
Dark hero (zinc-950 bg). Large headline: "Stop missing deadlines. Put your money where your mouth is." Subtext explaining the concept. Single CTA: "Start Your First Commitment →" (amber). 

Below fold (white bg):
- How it works (3 steps: Set deadline → Stake money → Ship or pay)
- Why it works (psychology: loss aversion is 2x more motivating than gain)
- Anti-charity section: "Your money goes somewhere that hurts"
- Pricing (2 tiers: Free + Pro)
- FAQ (6 questions)
- Footer

### 2. Signup/Login
Supabase magic link auth (email only — no password). Clean centered card, Space Grotesk heading "Ready to stop procrastinating?", email input, submit button. After signup → dashboard.

### 3. Create Commitment (`/dashboard/commitments/new`)
Multi-section form:
1. **What are you committing to?** (title + description textarea)
2. **When is your deadline?** (date + time picker, timezone shown)
3. **How much are you staking?** (dollar input with preset buttons: $25, $50, $100, $250)
4. **Where does your money go if you fail?** (anti-charity selector with brief descriptions)
5. **Make it public?** (toggle — creates public accountability page)

Final step: Stripe payment method capture (SetupIntent). Card input via Stripe Elements. Show: "We're authorizing your card now. You will ONLY be charged if you miss your deadline. No charge if you complete it."

On form submission:
- Create Stripe SetupIntent
- Embed Stripe Elements card form
- On success: create commitment record with `stripe_setup_intent_id`

### 4. Dashboard
Top KPI row: Active commitments count | Total staked | Completion rate | Money saved

Commitments list (card per commitment):
- Title + deadline countdown ("2 days, 4 hours left")
- Stake amount (amber badge)
- Status indicator (green=active, red=past due/in grace period, gray=completed)
- Quick actions: "Mark Complete" | "View Details"

Color coding:
- >24h remaining: zinc border
- <24h remaining: amber border + amber countdown
- In grace period (<1h): red border, pulsing red dot
- Completed: green border, checkmark
- Failed/charged: red bg tint, skull emoji

### 5. Complete a Commitment
When user clicks "Mark Complete":
- Modal with proof form
- URL field (required if possible — link to the work)
- Notes field (2-3 sentences about what was shipped)
- Submit button "I Shipped It ✓"
- On completion: update status to 'completed', record proof

### 6. Deadline Expiry Flow (cron job)
`/api/cron/check-deadlines` — runs every hour via Vercel cron (daily on Hobby, so use client-side countdown + grace period logic instead)

Actually since Vercel Hobby only allows daily crons, implement this differently:
- Set `grace_period_ends_at = deadline + 1 hour` on creation
- When user visits dashboard, check if any commitments have passed grace period
- API endpoint to trigger charge: POST `/api/commitments/[id]/charge`
- The charge fires when:
  a) User loads dashboard and an overdue commitment is found (client triggers), OR
  b) Vercel daily cron catches anything missed

### 7. Public Commitment Page (`/c/[slug]`)
Public-facing accountability page when `is_public = true`:
- Large heading: "[User name] has committed to:"
- Commitment title + description
- Countdown timer (live, updates every second)
- Stake amount: "with $X on the line"
- Status: Active / Completed / Failed
- Footer: "Create your own commitment at staked.so"

---

## API Routes

### POST /api/stripe/setup-intent
Creates Stripe SetupIntent for the authenticated user.
```typescript
// Creates customer if not exists, returns client_secret
```

### POST /api/commitments
Creates a commitment after successful Stripe setup.
```typescript
body: {
  title, description, deadline, stake_cents,
  anti_charity, is_public, stripe_setup_intent_id
}
```

### PATCH /api/commitments/[id]
Update status (admin use only for charging).

### POST /api/commitments/[id]/complete
Mark as complete with proof.
```typescript
body: { proof_url?, proof_note }
// Validates: deadline not yet passed OR within grace period
// Updates status to 'completed'
```

### POST /api/commitments/[id]/charge
Charge the card (called when grace period expires).
```typescript
// Creates PaymentIntent using saved SetupIntent's payment method
// amount: commitment.stake_cents
// Charge goes to Stripe - we'll add charity routing later
// Update status to 'failed', record stripe_payment_intent_id
```

### POST /api/webhooks/stripe
Handle: setup_intent.succeeded, payment_intent.succeeded, payment_intent.payment_failed

---

## Anti-Charity Options

```typescript
export const ANTI_CHARITIES = [
  {
    id: 'nra',
    name: 'NRA Foundation',
    description: 'National Rifle Association',
    icon: '🔫',
  },
  {
    id: 'planned_parenthood',
    name: 'Planned Parenthood',
    description: 'Reproductive health organization',
    icon: '🏥',
  },
  {
    id: 'trump_campaign',
    name: 'Trump 2028 Campaign',
    description: 'Political campaign fund',
    icon: '🏛️',
  },
  {
    id: 'aclu',
    name: 'ACLU',
    description: 'American Civil Liberties Union',
    icon: '⚖️',
  },
  {
    id: 'heritage_foundation',
    name: 'Heritage Foundation',
    description: 'Conservative think tank',
    icon: '🦅',
  },
]
```

(Note: In MVP, the money stays in the Stripe account — routing to actual charities is v2. The anti-charity selection is the psychological mechanism. Be transparent in ToS that v1 funds are held pending charity routing implementation.)

---

## Pricing Page

**Free**
- 3 active commitments
- Up to $100 stake
- Standard anti-charities
- Email reminders
- $0/mo

**Pro** ← highlight this one
- Unlimited commitments
- Up to $5,000 stake
- Custom deadline times
- Public accountability page
- Commitment history export
- $15/mo

---

## Legal Pages (required before launch)

### Privacy Policy
Standard SaaS privacy policy covering:
- Data collected (email, payment method via Stripe - we don't store card numbers)
- Stripe processes payments (link to Stripe's privacy policy)
- No selling of data
- Email for contact: privacy@staked.so

### Terms of Service
Key sections:
- Commitments are binding — you authorize us to charge your card
- Grace period: 1 hour after deadline to submit proof
- No refunds on forfeited stakes (by design)
- Auto-renewal disclosure for Pro
- We reserve the right to cancel service

### Refund Policy
- Pro subscription: refund within 7 days if no commitments created
- Forfeited stakes: no refunds (this is the entire point of the product)
- If charged in error (technical bug): full refund within 30 days

---

## SEO & Metadata

Root layout metadata:
```typescript
export const metadata: Metadata = {
  title: 'Staked — Deadline Accountability with Real Money',
  description: 'Stop missing deadlines. Set a commitment, stake real money, prove you shipped. The accountability app for people who ship.',
  keywords: ['accountability app', 'deadline commitment', 'productive habits', 'commitment device', 'stake money on goals'],
  openGraph: {
    title: 'Staked — Put Money on Your Deadlines',
    description: 'The accountability app built for professionals who ship.',
    url: 'https://staked.so',
    type: 'website',
  },
}
```

---

## Key Implementation Notes

1. **Stripe Setup Intent flow:**
   - Create SetupIntent on the backend (never expose secret key to frontend)
   - Use Stripe.js + Elements on frontend to collect card
   - On `setup_intent.succeeded` webhook: mark commitment as "funded"
   - On charge: create PaymentIntent from the SetupIntent's payment method

2. **Countdown timer:** Client-side only, uses `useEffect` + `setInterval`. Format as "Xd Xh Xm" when >24h, "X:XX:XX" when <24h.

3. **Grace period logic:** `grace_period_ends_at = deadline + 1 hour`. In grace period = between deadline and grace_period_ends_at. Charge fires when grace period ends.

4. **Public slugs:** Generate as `${adjective}-${noun}-${4digits}` (e.g., "brave-ship-4821") to avoid sequential IDs.

5. **Email reminders:** Use Supabase Edge Functions or a simple `/api/cron/send-reminders` with Resend or Nodemailer. For MVP, skip email and use dashboard-only.

6. **Auth middleware:** Use Supabase SSR middleware to protect `/dashboard/*` routes. Redirect unauthenticated users to `/login`.

---

## When finished

1. Run `git add -A && git commit -m "feat: initial Staked app build" && git push origin main`
2. Run: `openclaw system event --text "Done: Staked app built and pushed to GitHub. Ready for Supabase + Stripe + Vercel setup." --mode now`
