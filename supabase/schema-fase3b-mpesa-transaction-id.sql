-- ========================================
-- TXATINÍ — FASE 3B: coluna mpesa_transaction_id
-- Corre no SQL Editor do Supabase após schema-fase3-mpesa-settings.sql
-- ========================================

alter table txatini.orders
  add column if not exists mpesa_transaction_id text;

notify pgrst, 'reload schema';
