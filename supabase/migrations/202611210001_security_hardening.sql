begin;

-- Public writes must go through the bounded, rate-limited server endpoint.
revoke insert, update, delete on public.subscribers from public, anon, authenticated;
grant select, insert on public.subscribers to service_role;

-- Legacy browser-written progress is retained, but never used as verified points.
create table if not exists public.training_results (
  user_id uuid not null references auth.users(id) on delete cascade,
  game_id text not null check (game_id in ('dossie-00','dossie-01','dossie-02','dossie-03','dossie-04','dossie-05','dossie-06')),
  best_seconds integer not null check (best_seconds between 0 and 86400),
  last_seconds integer not null check (last_seconds between 0 and 86400),
  completions integer not null default 1 check (completions > 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, game_id)
);
alter table public.training_results enable row level security;
revoke all on public.training_results from public, anon, authenticated;
grant select on public.training_results to authenticated;
grant all on public.training_results to service_role;
drop policy if exists "Read own verified results" on public.training_results;
create policy "Read own verified results" on public.training_results for select to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.record_training_result(p_user_id uuid, p_game_id text, p_seconds integer)
returns void language sql security invoker set search_path = '' as $$
  insert into public.training_results(user_id, game_id, best_seconds, last_seconds)
  values (p_user_id, p_game_id, p_seconds, p_seconds)
  on conflict (user_id, game_id) do update set
    best_seconds = least(public.training_results.best_seconds, excluded.best_seconds),
    last_seconds = excluded.last_seconds,
    completions = public.training_results.completions + 1,
    updated_at = now();
$$;
revoke all on function public.record_training_result(uuid,text,integer) from public, anon, authenticated;
grant execute on function public.record_training_result(uuid,text,integer) to service_role;

create table if not exists public.subscription_request_limits (
  bucket text primary key,
  started_at timestamptz not null,
  hits integer not null
);
alter table public.subscription_request_limits enable row level security;
revoke all on public.subscription_request_limits from public, anon, authenticated;
grant all on public.subscription_request_limits to service_role;

create or replace function public.subscribe_email(p_email text, p_bucket text)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare current_hits integer;
begin
  if p_email is null or length(p_email) > 254 or p_email <> lower(btrim(p_email))
     or p_email !~ '^[^[:space:]@<>]+@[^[:space:]@<>]+\.[^[:space:]@<>]+$'
     or p_bucket is null or p_bucket !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid subscription request';
  end if;
  insert into public.subscription_request_limits as limits(bucket, started_at, hits)
  values (p_bucket, now(), 1)
  on conflict (bucket) do update set
    hits = case when limits.started_at < now() - interval '10 minutes' then 1 else limits.hits + 1 end,
    started_at = case when limits.started_at < now() - interval '10 minutes' then now() else limits.started_at end
  returning hits into current_hits;
  if current_hits > 5 then return false; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_email, 1));
  insert into public.subscribers(email)
    select p_email where not exists (select 1 from public.subscribers where lower(btrim(email)) = p_email)
    on conflict do nothing;
  delete from public.subscription_request_limits where started_at < now() - interval '1 day';
  return true;
end;
$$;
revoke all on function public.subscribe_email(text,text) from public, anon, authenticated;
grant execute on function public.subscribe_email(text,text) to service_role;

commit;
