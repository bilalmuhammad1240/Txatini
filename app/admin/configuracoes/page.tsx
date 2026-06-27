'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Setting } from '@/types/settings';

const SETTING_GROUPS = [
  { title: 'Loja', keys: ['store_name', 'store_tagline'] },
  { title: 'WhatsApp', keys: ['whatsapp_number'] },
  { title: 'M-Pesa', keys: ['mpesa_number', 'mpesa_name'] },
  { title: 'Revendedores', keys: ['default_commission'] },
  { title: 'Entregas', keys: ['delivery_fee'] },
];

type UploadTarget = 'logo_url' | 'banner_url';

export default function AdminConfiguracoesPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<UploadTarget | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from('settings').select('*').order('key');
    setSettings((data as Setting[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const getValue = (key: string) =>
    key in edited ? edited[key] : settings.find((s) => s.key === key)?.value ?? '';

  const getLabel = (key: string) =>
    settings.find((s) => s.key === key)?.label ?? key;

  const handleChange = (key: string, value: string) => {
    setEdited((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (Object.keys(edited).length === 0) return;
    setSaving(true);
    const supabase = createClient();
    await Promise.all(
      Object.entries(edited).map(([key, value]) =>
        supabase.from('settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key)
      )
    );
    setEdited({});
    setSaved(true);
    setSaving(false);
    fetchSettings();
  };

  const handleMediaUpload = async (
    file: File,
    target: UploadTarget
  ) => {
    setUploadError(null);
    setUploading(target);

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png';
      const fileName = `${target === 'logo_url' ? 'logo' : 'banner'}.${ext}`;

      // Upload para o bucket txatini-media
      const { error: uploadError } = await supabase.storage
        .from('txatini-media')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw new Error(uploadError.message);

      // Obter URL pública
      const { data: urlData } = supabase.storage
        .from('txatini-media')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Guardar URL nas settings
      await supabase
        .from('settings')
        .update({ value: publicUrl, updated_at: new Date().toISOString() })
        .eq('key', target);

      fetchSettings();
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : 'Erro ao fazer upload.'
      );
    } finally {
      setUploading(null);
    }
  };

  const logoUrl = getValue('logo_url');
  const bannerUrl = getValue('banner_url');
  const hasChanges = Object.keys(edited).length > 0;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-txatini-green">Configurações</h1>
        {saved && !hasChanges && (
          <span className="text-sm font-semibold text-green-600">✓ Guardado</span>
        )}
      </div>

      {loading && <p className="text-sm text-txatini-muted">A carregar...</p>}

      {!loading && (
        <div className="flex flex-col gap-6">

          {/* ── MEDIA: Logo e Banner ── */}
          <div>
            <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-txatini-muted">
              Imagens da loja
            </h2>

            <div className="flex flex-col gap-4">

              {/* Logo */}
              <div className="rounded-xl border border-txatini-green/10 bg-txatini-surface p-4">
                <p className="mb-2 text-sm font-semibold text-txatini-ink">Logo</p>
                <div className="mb-3 flex items-center gap-4">
                  {logoUrl ? (
                    <div className="relative h-14 w-28 overflow-hidden rounded-lg border border-txatini-green/10 bg-white">
                      <Image
                        src={logoUrl}
                        alt="Logo actual"
                        fill
                        className="object-contain p-1"
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-14 w-28 items-center justify-center rounded-lg border border-dashed border-txatini-green/20 bg-white text-xs text-txatini-muted">
                      Sem logo
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-txatini-muted">PNG ou SVG recomendado</p>
                    <p className="text-xs text-txatini-muted">Fundo transparente ou branco</p>
                  </div>
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleMediaUpload(file, 'logo_url');
                  }}
                />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploading === 'logo_url'}
                  className="rounded-lg border border-txatini-green/20 bg-white px-4 py-2 text-sm font-semibold text-txatini-green disabled:opacity-50"
                >
                  {uploading === 'logo_url' ? 'A fazer upload...' : logoUrl ? 'Substituir logo' : 'Fazer upload da logo'}
                </button>
              </div>

              {/* Banner */}
              <div className="rounded-xl border border-txatini-green/10 bg-txatini-surface p-4">
                <p className="mb-2 text-sm font-semibold text-txatini-ink">Banner principal</p>
                <div className="mb-3">
                  {bannerUrl ? (
                    <div className="relative h-24 w-full overflow-hidden rounded-lg border border-txatini-green/10">
                      <Image
                        src={bannerUrl}
                        alt="Banner actual"
                        fill
                        className="object-cover object-left-top"
                      />
                    </div>
                  ) : (
                    <div className="flex h-24 w-full items-center justify-center rounded-lg border border-dashed border-txatini-green/20 bg-white text-xs text-txatini-muted">
                      Sem banner
                    </div>
                  )}
                  <p className="mt-1 text-xs text-txatini-muted">JPG ou PNG · proporção 16:7 recomendada</p>
                </div>
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleMediaUpload(file, 'banner_url');
                  }}
                />
                <button
                  onClick={() => bannerInputRef.current?.click()}
                  disabled={uploading === 'banner_url'}
                  className="rounded-lg border border-txatini-green/20 bg-white px-4 py-2 text-sm font-semibold text-txatini-green disabled:opacity-50"
                >
                  {uploading === 'banner_url' ? 'A fazer upload...' : bannerUrl ? 'Substituir banner' : 'Fazer upload do banner'}
                </button>
              </div>

              {uploadError && (
                <p className="text-sm font-semibold text-red-600">{uploadError}</p>
              )}
            </div>
          </div>

          {/* ── CONFIGURAÇÕES DE TEXTO ── */}
          {SETTING_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-txatini-muted">
                {group.title}
              </h2>
              <div className="flex flex-col gap-3">
                {group.keys.map((key) => (
                  <div key={key} className="rounded-xl border border-txatini-green/10 bg-txatini-surface p-4">
                    <label className="mb-1 block text-sm font-semibold text-txatini-ink">
                      {getLabel(key)}
                    </label>
                    <input
                      type="text"
                      value={getValue(key)}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors ${
                        key in edited
                          ? 'border-txatini-orange'
                          : 'border-txatini-green/20 focus:border-txatini-orange'
                      }`}
                    />
                    {key === 'whatsapp_number' && (
                      <p className="mt-1 text-xs text-txatini-muted">Formato: 258XXXXXXXXX</p>
                    )}
                    {key === 'default_commission' && (
                      <p className="mt-1 text-xs text-txatini-muted">Percentagem para novos revendedores (ex: 10)</p>
                    )}
                    {key === 'delivery_fee' && (
                      <p className="mt-1 text-xs text-txatini-muted">0 = entrega gratuita</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="mt-2 rounded-lg bg-txatini-green py-3 text-sm font-bold text-white disabled:opacity-40"
          >
            {saving ? 'A guardar...' : 'Guardar alterações'}
          </button>
        </div>
      )}
    </div>
  );
}
