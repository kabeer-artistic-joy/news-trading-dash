create table public.trade_journal (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users not null default auth.uid(), event_id text not null,
  symbol text not null, direction text check (direction in ('long','short','flat')), thesis text, entry_price numeric, exit_price numeric,
  outcome text, created_at timestamptz not null default now()
);
alter table public.trade_journal enable row level security;
create policy "Users manage their own journal" on public.trade_journal for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table public.saved_events (user_id uuid references auth.users not null default auth.uid(), event_id text not null, checklist_done boolean not null default false, primary key (user_id,event_id));
alter table public.saved_events enable row level security;
create policy "Users manage their own saved events" on public.saved_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
