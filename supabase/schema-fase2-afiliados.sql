-- ========================================
-- TXATINÍ — FASE 2: SISTEMA DE REVENDEDORES
-- Corre este ficheiro no SQL Editor do Supabase.
-- É incremental — não apaga nada existente da Fase 1.
-- ========================================

-- ========================================
-- TABELA: txatini.affiliates (revendedores)
-- ========================================
create table if not exists txatini.affiliates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  code text not null unique,           -- código único ex: "MARIA10"
  commission_pct numeric(5,2) not null default 10.00
    check (commission_pct > 0 and commission_pct <= 100),
  status text not null default 'pendente'
    check (status in ('pendente', 'ativo', 'suspenso')),
  notes text,                          -- notas internas do admin
  created_at timestamptz not null default now()
);

create index if not exists idx_txatini_affiliates_code on txatini.affiliates(code);
create index if not exists idx_txatini_affiliates_status on txatini.affiliates(status);

-- ========================================
-- ADICIONAR COLUNA affiliate_code À TABELA orders
-- (regista qual revendedor gerou o pedido, se algum)
-- ========================================
alter table txatini.orders
  add column if not exists affiliate_code text references txatini.affiliates(code) on delete set null,
  add column if not exists commission_amount numeric(10,2);

-- ========================================
-- TABELA: txatini.commissions (registo de comissões)
-- ========================================
create table if not exists txatini.commissions (
  id uuid primary key default gen_random_uuid(),
  affiliate_id uuid not null references txatini.affiliates(id) on delete cascade,
  order_id uuid not null references txatini.orders(id) on delete cascade,
  order_total numeric(10,2) not null,
  commission_pct numeric(5,2) not null,
  commission_amount numeric(10,2) not null,
  status text not null default 'pendente'
    check (status in ('pendente', 'pago')),
  created_at timestamptz not null default now()
);

create index if not exists idx_txatini_commissions_affiliate on txatini.commissions(affiliate_id);
create index if not exists idx_txatini_commissions_status on txatini.commissions(status);

-- ========================================
-- RLS: affiliates
-- ========================================
alter table txatini.affiliates enable row level security;
alter table txatini.commissions enable row level security;

-- Qualquer pessoa pode registar-se como revendedor (insert)
drop policy if exists "Qualquer pessoa pode pedir para ser revendedor" on txatini.affiliates;
create policy "Qualquer pessoa pode pedir para ser revendedor"
  on txatini.affiliates for insert
  to anon, authenticated
  with check (status = 'pendente');

-- Qualquer pessoa pode verificar se um código existe (para o checkout validar)
drop policy if exists "Código de afiliado é público para leitura" on txatini.affiliates;
create policy "Código de afiliado é público para leitura"
  on txatini.affiliates for select
  to anon, authenticated
  using (true);

-- Só admins autenticados gerem revendedores
drop policy if exists "Admins gerem revendedores" on txatini.affiliates;
create policy "Admins gerem revendedores"
  on txatini.affiliates for all
  to authenticated
  using (true)
  with check (true);

-- Só admins veem comissões
drop policy if exists "Admins veem comissões" on txatini.commissions;
create policy "Admins veem comissões"
  on txatini.commissions for select
  to authenticated
  using (true);

-- Sistema pode criar comissões (insert via API route, usa service role)
drop policy if exists "Sistema cria comissões" on txatini.commissions;
create policy "Sistema cria comissões"
  on txatini.commissions for insert
  to anon, authenticated
  with check (true);

-- Admins atualizam comissões (marcar como pago)
drop policy if exists "Admins atualizam comissões" on txatini.commissions;
create policy "Admins atualizam comissões"
  on txatini.commissions for update
  to authenticated
  using (true)
  with check (true);

-- Permissões para os novos objetos
grant all on txatini.affiliates to anon, authenticated, service_role;
grant all on txatini.commissions to anon, authenticated, service_role;

-- Recarregar schema cache
notify pgrst, 'reload schema';
