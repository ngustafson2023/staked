-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  stripe_customer_id text,
  plan text default 'free' check (plan in ('free', 'pro')),
  stripe_subscription_id text,
  created_at timestamptz default now()
);

-- Commitments
create table public.commitments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  deadline timestamptz not null,
  stake_cents integer not null check (stake_cents >= 1000),
  anti_charity text not null default 'nra',
  status text default 'active' check (status in ('active', 'completed', 'failed', 'cancelled')),
  proof_url text,
  proof_note text,
  stripe_payment_method_id text,
  stripe_setup_intent_id text,
  stripe_payment_intent_id text,
  is_public boolean default false,
  public_slug text unique,
  completed_at timestamptz,
  charged_at timestamptz,
  grace_period_ends_at timestamptz,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.commitments enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can view own commitments" on public.commitments
  for select using (auth.uid() = user_id);

create policy "Users can insert own commitments" on public.commitments
  for insert with check (auth.uid() = user_id);

create policy "Users can update own commitments" on public.commitments
  for update using (auth.uid() = user_id);

create policy "Public commitments are viewable" on public.commitments
  for select using (is_public = true);

-- Auto-create profile on signup
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

-- Index for performance
create index commitments_user_id_idx on public.commitments(user_id);
create index commitments_status_idx on public.commitments(status);
create index commitments_deadline_idx on public.commitments(deadline);
create index commitments_public_slug_idx on public.commitments(public_slug);
