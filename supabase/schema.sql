-- ========================================
-- TXATINÍ — SCHEMA SUPABASE (schema isolado: "txatini")
-- Corre este ficheiro completo no SQL Editor do teu projeto Supabase.
--
-- Este projeto Supabase é partilhado por vários projetos Vercel.
-- Para evitar colisões de nomes de tabelas, tudo do Txatiní vive no
-- schema "txatini" em vez de "public". Outros projetos podem ter o
-- seu próprio schema (ex: "outroprojeto") na mesma base de dados.
-- ========================================

-- Extensão para gerar UUIDs (fica em public, é partilhada por todos)
create extension if not exists "pgcrypto";

-- Cria o schema isolado do Txatiní
create schema if not exists txatini;

-- ========================================
-- TABELA: txatini.products
-- ========================================
create table if not exists txatini.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  category text not null default 'tempero'
    check (category in ('tempero', 'marinada', 'especiaria', 'condimento', 'outro')),
  stock integer not null default 0 check (stock >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ========================================
-- TABELA: txatini.orders
-- ========================================
create table if not exists txatini.orders (
  id uuid primary key default gen_random_uuid(),
  user_name text not null,
  phone text not null,
  location text not null,
  delivery_type text not null default 'entrega'
    check (delivery_type in ('entrega', 'recolha')),
  total numeric(10, 2) not null default 0,
  status text not null default 'pendente'
    check (status in ('pendente', 'em_preparacao', 'entregue')),
  created_at timestamptz not null default now()
);

-- ========================================
-- TABELA: txatini.order_items
-- ========================================
create table if not exists txatini.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references txatini.orders(id) on delete cascade,
  product_id uuid references txatini.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  price numeric(10, 2) not null check (price >= 0)
);

-- Índices úteis
create index if not exists idx_txatini_products_active on txatini.products(active);
create index if not exists idx_txatini_products_category on txatini.products(category);
create index if not exists idx_txatini_orders_status on txatini.orders(status);
create index if not exists idx_txatini_order_items_order_id on txatini.order_items(order_id);

-- ========================================
-- ROW LEVEL SECURITY
-- ========================================

alter table txatini.products enable row level security;
alter table txatini.orders enable row level security;
alter table txatini.order_items enable row level security;

-- PRODUCTS: qualquer pessoa pode ver produtos ativos (loja pública)
drop policy if exists "Produtos ativos são públicos" on txatini.products;
create policy "Produtos ativos são públicos"
  on txatini.products for select
  using (active = true);

-- PRODUCTS: utilizadores autenticados (admins) podem ver todos, incluindo inativos
drop policy if exists "Admins veem todos os produtos" on txatini.products;
create policy "Admins veem todos os produtos"
  on txatini.products for select
  to authenticated
  using (true);

-- PRODUCTS: só admins autenticados podem criar/editar/apagar
drop policy if exists "Admins gerem produtos" on txatini.products;
create policy "Admins gerem produtos"
  on txatini.products for all
  to authenticated
  using (true)
  with check (true);

-- ORDERS: qualquer pessoa (mesmo anónima) pode criar um pedido (checkout público)
drop policy if exists "Qualquer pessoa pode criar pedidos" on txatini.orders;
create policy "Qualquer pessoa pode criar pedidos"
  on txatini.orders for insert
  to anon, authenticated
  with check (true);

-- ORDERS: só admins autenticados podem ver pedidos
drop policy if exists "Admins veem pedidos" on txatini.orders;
create policy "Admins veem pedidos"
  on txatini.orders for select
  to authenticated
  using (true);

-- ORDERS: só admins autenticados podem atualizar pedidos (ex: status)
drop policy if exists "Admins atualizam pedidos" on txatini.orders;
create policy "Admins atualizam pedidos"
  on txatini.orders for update
  to authenticated
  using (true)
  with check (true);

-- ORDER_ITEMS: qualquer pessoa pode criar itens (parte do checkout)
drop policy if exists "Qualquer pessoa pode criar itens de pedido" on txatini.order_items;
create policy "Qualquer pessoa pode criar itens de pedido"
  on txatini.order_items for insert
  to anon, authenticated
  with check (true);

-- ORDER_ITEMS: só admins autenticados podem ver itens
drop policy if exists "Admins veem itens de pedido" on txatini.order_items;
create policy "Admins veem itens de pedido"
  on txatini.order_items for select
  to authenticated
  using (true);

-- ========================================
-- EXPOR O SCHEMA "txatini" À API REST DO SUPABASE
-- ========================================
-- Por defeito, a API REST do Supabase só expõe o schema "public".
-- Isto dá permissão a nível de Postgres para os roles da API usarem o
-- schema "txatini". MESMO ASSIM, tens de o adicionar manualmente em:
-- Project Settings → API → "Exposed schemas" → adicionar "txatini"
-- (Sem este passo na dashboard, o site não vai conseguir ler/escrever.)

grant usage on schema txatini to anon, authenticated, service_role;

grant all on all tables in schema txatini to anon, authenticated, service_role;
grant all on all sequences in schema txatini to anon, authenticated, service_role;

alter default privileges in schema txatini
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema txatini
  grant all on sequences to anon, authenticated, service_role;

-- ========================================
-- STORAGE: bucket para imagens de produtos
-- (Storage não tem conceito de "schema" como o Postgres — o bucket
-- já fica isolado por nome, por isso usamos um nome prefixado para
-- evitar colisão com buckets de outros projetos.)
-- ========================================
insert into storage.buckets (id, name, public)
values ('txatini-product-images', 'txatini-product-images', true)
on conflict (id) do nothing;

drop policy if exists "Txatini: imagens de produtos são públicas" on storage.objects;
create policy "Txatini: imagens de produtos são públicas"
  on storage.objects for select
  using (bucket_id = 'txatini-product-images');

drop policy if exists "Txatini: admins fazem upload de imagens" on storage.objects;
create policy "Txatini: admins fazem upload de imagens"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'txatini-product-images');

drop policy if exists "Txatini: admins atualizam imagens" on storage.objects;
create policy "Txatini: admins atualizam imagens"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'txatini-product-images');

drop policy if exists "Txatini: admins apagam imagens" on storage.objects;
create policy "Txatini: admins apagam imagens"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'txatini-product-images');

-- ========================================
-- DADOS DE EXEMPLO (opcional — apaga este bloco se não quiseres)
-- ========================================
insert into txatini.products (name, description, price, category, stock, active)
values
  ('Tempero para Frango', 'Mistura caseira pronta a usar para frango grelhado ou assado.', 80, 'tempero', 50, true),
  ('Caril Moçambicano', 'Caril em pó tradicional, picante moderado.', 95, 'especiaria', 40, true),
  ('Tempero para Peixe', 'Mistura ideal para peixe grelhado ou frito.', 75, 'tempero', 35, true),
  ('Piri-piri Tradicional', 'Molho picante caseiro, sabor autêntico.', 60, 'condimento', 60, true)
on conflict do nothing;
