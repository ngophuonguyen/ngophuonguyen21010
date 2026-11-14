-- Apply after schema.sql. Progress is private to each authenticated learner.
create table if not exists public.batch_progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 batch_id text not null check(batch_id='evening-01'),
 state jsonb not null check(jsonb_typeof(state)='object' and pg_column_size(state)<=65536),
 updated_at timestamptz not null default now(),
 primary key(user_id,batch_id)
);
alter table public.batch_progress enable row level security;
revoke all on public.batch_progress from anon;
grant select,insert,update,delete on public.batch_progress to authenticated;
drop policy if exists "Own vocabulary batches" on public.batch_progress;
create policy "Own vocabulary batches" on public.batch_progress for all to authenticated
 using((select auth.uid())=user_id) with check((select auth.uid())=user_id);
drop trigger if exists batch_progress_updated on public.batch_progress;
create trigger batch_progress_updated before update on public.batch_progress for each row execute function public.touch_learning_item();
-- The atomic quota cannot be bypassed by parallel requests or direct table writes.
create table if not exists public.ai_feedback_usage (
 user_id uuid not null references auth.users(id) on delete cascade,
 usage_date date not null,
 requests integer not null default 0 check(requests between 0 and 20),
 primary key(user_id,usage_date)
);
alter table public.ai_feedback_usage enable row level security;
revoke all on public.ai_feedback_usage from anon,authenticated;
create or replace function public.claim_ai_feedback() returns boolean
 language plpgsql security definer set search_path='' as $$
 declare used integer; uid uuid := auth.uid();
 begin
  if uid is null then return false; end if;
  insert into public.ai_feedback_usage(user_id,usage_date,requests)
  values(uid,(now() at time zone 'UTC')::date,1)
  on conflict(user_id,usage_date) do update
  set requests=public.ai_feedback_usage.requests+1
  where public.ai_feedback_usage.requests<20 returning requests into used;
  return used is not null;
 end; $$;
revoke all on function public.claim_ai_feedback() from public,anon;
grant execute on function public.claim_ai_feedback() to authenticated;
