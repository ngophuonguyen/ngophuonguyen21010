-- Run once in the project's SQL Editor. No keys or passwords belong in this file.
create table if not exists public.learning_items (
 user_id uuid not null references auth.users(id) on delete cascade,
 category text not null check (category in ('day','word','listening','attempt')),
 item_id text not null check (length(item_id) between 1 and 200),
 value jsonb not null,
 updated_at timestamptz not null default now(),
 primary key(user_id,category,item_id),
 constraint learning_value_size check (pg_column_size(value) <= 8192),
 constraint learning_value_valid check ((
  (category in ('day','word','listening') and jsonb_typeof(value) = 'boolean') or
  (category='attempt' and jsonb_typeof(value)='object'
   and jsonb_typeof(value->'score')='number' and jsonb_typeof(value->'total')='number'
   and (value->>'score')::numeric>=0 and (value->>'total')::numeric>0
   and (value->>'score')::numeric<=(value->>'total')::numeric)
 ) is true)
);
alter table public.learning_items enable row level security;
revoke all on public.learning_items from anon;
grant select, insert, update, delete on public.learning_items to authenticated;
drop policy if exists "Own learning records" on public.learning_items;
create policy "Own learning records" on public.learning_items
 for all to authenticated using ((select auth.uid()) = user_id)
 with check ((select auth.uid()) = user_id);
create or replace function public.touch_learning_item() returns trigger language plpgsql set search_path='' as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists learning_items_updated on public.learning_items;
create trigger learning_items_updated before update on public.learning_items
 for each row execute function public.touch_learning_item();
