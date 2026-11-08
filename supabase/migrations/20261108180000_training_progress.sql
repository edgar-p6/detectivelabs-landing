create table if not exists public.training_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  training_slug text not null check (char_length(training_slug) between 1 and 80),
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, training_slug)
);

alter table public.training_progress enable row level security;

revoke all on table public.training_progress from anon, authenticated;
grant select, insert, update on table public.training_progress to authenticated;

create policy "Users can read their own training progress"
  on public.training_progress for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own training progress"
  on public.training_progress for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own training progress"
  on public.training_progress for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
