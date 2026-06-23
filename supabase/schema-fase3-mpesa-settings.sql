-- ========================================
-- TXATINÍ — FASE 3: M-PESA + CONFIGURAÇÕES
-- Corre no SQL Editor do Supabase.
-- Incremental — não apaga nada existente.
-- ========================================

-- ========================================
-- TABELA: txatini.settings (configurações globais da loja)
-- ========================================
create table if not exists txatini.settings (
  key text primary key,
  value text not null,
  label text,           -- nome legível para o admin
  updated_at timestamptz not null default now()
);

-- Valores por defeito
insert into txatini.settings (key, value, label) values
  ('whatsapp_number',     '258879197409',   'Número WhatsApp Business'),
  ('store_name',          'Txatiní',        'Nome da loja'),
  ('store_tagline',       'Sabor que lembra casa', 'Frase principal'),
  ('default_commission',  '10',             'Comissão padrão revendedores (%)'),
  ('mpesa_number',        '258879197409',   'Número M-Pesa para pagamentos'),
  ('mpesa_name',          'Txatiní Temperos','Nome M-Pesa (aparece no checkout'),
  ('delivery_fee',        '0',              'Taxa de entrega (MZN, 0 = grátis)')
on conflict (key) do nothing;

-- ========================================
-- ADICIONAR COLUNAS M-PESA À TABELA orders
-- ========================================
alter table txatini.orders
  add column if not exists payment_method text not null default 'whatsapp'
    check (payment_method in ('whatsapp', 'mpesa')),
  add column if not exists mpesa_number text,
  add column if not exists payment_status text not null default 'pendente'
    check (payment_status in ('pendente', 'confirmado', 'falhado'));

-- ========================================
-- RLS: settings
-- ========================================
alter table txatini.settings enable row level security;

-- Qualquer pessoa pode LER configurações (necessário para o site público mostrar nome, tagline, etc.)
drop policy if exists "Settings são públicas para leitura" on txatini.settings;
create policy "Settings são públicas para leitura"
  on txatini.settings for select
  to anon, authenticated
  using (true);

-- Só admins podem alterar configurações
drop policy if exists "Admins gerem settings" on txatini.settings;
create policy "Admins gerem settings"
  on txatini.settings for all
  to authenticated
  using (true)
  with check (true);

-- Permissões
grant all on txatini.settings to anon, authenticated, service_role;

-- Recarregar schema cache
notify pgrst, 'reload schema';
