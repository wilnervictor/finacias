create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  is_special boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null check (type in ('income', 'expense')),
  description text not null,
  category text not null,
  amount numeric(12, 2) not null,
  date date not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_transactions_user on transactions(user_id);

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  nome text not null,
  valor numeric(12, 2) not null,
  cobranca text not null,
  observacoes text not null default '',
  pagamentos jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_clientes_user on clientes(user_id);
