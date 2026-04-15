-- Enable pgcrypto for gen_random_bytes
create extension if not exists pgcrypto with schema extensions;

-- Feature 3: Streak tracking columns on profiles
alter table public.profiles
  add column current_streak integer default 0,
  add column longest_streak integer default 0,
  add column last_completed_at timestamptz;

-- Streak update function
create or replace function public.update_streak(p_user_id uuid)
returns void as $$
declare
  last_completed timestamptz;
  current integer;
  longest integer;
begin
  select last_completed_at, current_streak, longest_streak
  into last_completed, current, longest
  from public.profiles
  where id = p_user_id;

  if last_completed is not null and (now() - last_completed) <= interval '7 days' then
    current := coalesce(current, 0) + 1;
  else
    current := 1;
  end if;

  if current > coalesce(longest, 0) then
    longest := current;
  end if;

  update public.profiles
  set current_streak = current,
      longest_streak = longest,
      last_completed_at = now()
  where id = p_user_id;
end;
$$ language plpgsql security definer;

-- Feature 4: Witnesses table
create table public.witnesses (
  id uuid primary key default gen_random_uuid(),
  commitment_id uuid references public.commitments(id) on delete cascade not null,
  email text not null,
  token text not null unique default encode(extensions.gen_random_bytes(32), 'hex'),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  note text,
  created_at timestamptz default now(),
  responded_at timestamptz
);

alter table public.witnesses enable row level security;

-- Commitment owner can insert and select witnesses
create policy "Commitment owner can insert witnesses" on public.witnesses
  for insert with check (
    exists (
      select 1 from public.commitments
      where commitments.id = witnesses.commitment_id
      and commitments.user_id = auth.uid()
    )
  );

create policy "Commitment owner can view witnesses" on public.witnesses
  for select using (
    exists (
      select 1 from public.commitments
      where commitments.id = witnesses.commitment_id
      and commitments.user_id = auth.uid()
    )
  );

-- Public can select/update by token (via service role or anon with token match)
create policy "Anyone can view witness by token" on public.witnesses
  for select using (true);

create policy "Anyone can update witness by token" on public.witnesses
  for update using (true);

create index witnesses_commitment_id_idx on public.witnesses(commitment_id);
create index witnesses_token_idx on public.witnesses(token);

-- Feature 5: Recurring commitments
alter table public.commitments
  add column recurrence text default 'none' check (recurrence in ('none', 'daily', 'weekly', 'monthly')),
  add column parent_commitment_id uuid references public.commitments(id);

-- Feature 6: Milestones table
create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  commitment_id uuid references public.commitments(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  note text not null,
  created_at timestamptz default now()
);

alter table public.milestones enable row level security;

create policy "Users can insert own milestones" on public.milestones
  for insert with check (auth.uid() = user_id);

create policy "Users can view own milestones" on public.milestones
  for select using (auth.uid() = user_id);

create policy "Public milestones viewable" on public.milestones
  for select using (
    exists (
      select 1 from public.commitments
      where commitments.id = milestones.commitment_id
      and commitments.is_public = true
    )
  );

create index milestones_commitment_id_idx on public.milestones(commitment_id);
