-- ========================================
-- TXATINÍ — FASE 4: MEDIA SETTINGS
-- Corre no SQL Editor do Supabase.
-- ========================================

-- Adicionar logo_url e banner_url às settings
insert into txatini.settings (key, value, label) values
  ('logo_url',   '', 'URL da Logo (gerido pelo admin)'),
  ('banner_url', '', 'URL do Banner (gerido pelo admin)')
on conflict (key) do nothing;

-- Criar bucket público para media da loja
insert into storage.buckets (id, name, public)
values ('txatini-media', 'txatini-media', true)
on conflict (id) do nothing;

-- Políticas do bucket
drop policy if exists "Txatini media público para leitura" on storage.objects;
create policy "Txatini media público para leitura"
  on storage.objects for select
  using (bucket_id = 'txatini-media');

drop policy if exists "Txatini admins fazem upload de media" on storage.objects;
create policy "Txatini admins fazem upload de media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'txatini-media');

drop policy if exists "Txatini admins actualizam media" on storage.objects;
create policy "Txatini admins actualizam media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'txatini-media');

drop policy if exists "Txatini admins apagam media" on storage.objects;
create policy "Txatini admins apagam media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'txatini-media');

notify pgrst, 'reload schema';
