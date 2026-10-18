-- Run this SQL in Supabase Dashboard → SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null check (char_length(customer_name) between 1 and 100),
  customer_email text not null check (char_length(customer_email) between 3 and 200),
  whatsapp text,
  service text not null,
  budget text,
  deadline text,
  message text not null check (char_length(message) between 1 and 5000),
  status text not null default 'new' check (status in ('new','in_progress','completed','cancelled'))
);

alter table public.orders enable row level security;

-- Public visitors can submit a request but cannot read or update any order.
drop policy if exists "Anyone can submit an order" on public.orders;
create policy "Anyone can submit an order"
on public.orders for insert
to anon, authenticated
with check (
  status = 'new'
  and char_length(customer_name) between 1 and 100
  and char_length(customer_email) between 3 and 200
  and char_length(message) between 1 and 5000
);

-- Authenticated dashboard users can read and manage orders.
-- IMPORTANT: disable public sign-ups in Supabase Auth; create only your own admin user.
drop policy if exists "Admin can read orders" on public.orders;
create policy "Admin can read orders"
on public.orders for select
to authenticated
using (auth.uid() is not null);

drop policy if exists "Admin can update orders" on public.orders;
create policy "Admin can update orders"
on public.orders for update
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

-- No public select, update, or delete policies are created.
