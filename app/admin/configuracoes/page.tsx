'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Setting } from '@/types/settings';

const SETTING_GROUPS = [
  {
    title: 'Loja',
    keys: ['store_name', 'store_tagline'],
  },
  {
    title: 'WhatsApp',
    keys: ['whatsapp_number'],
  },
  {
    title: 'M-Pesa',
    keys: ['mpesa_number', 'mpesa_name'],
  },
  {
    title: 'Revendedores',
    keys: ['default_commission'],
  },
  {
    title: 'Entregas',
    keys: ['delivery_fee'],
  },
];

export default function AdminConfiguracoesPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('settings')
      .select('*')
      .order('key');
    setSettings((data as Setting[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getValue = (key: string) => {
    if (key in edited) return edited[key];
    return settings.find((s) => s.key === key)?.value ?? '';
  };

  const getLabel = (key: string) => {
    return settings.find((s) => s.key === key)?.label ?? key;
  };

  const handleChange = (key: string, value: string) => {
    setEdited((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (Object.keys(edited).length === 0) return;
    setSaving(true);

    const supabase = createClient();
    const updates = Object.entries(edited).map(([key, value]) =>
      supabase
        .from('settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
    );

    await Promise.all(updates);
    setEdited({});
    setSaved(true);
    setSaving(false);
    fetchSettings();
  };

  const hasChanges = Object.keys(edited).length > 0;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-txatini-green">
          Configurações
        </h1>
        {saved && !hasChanges && (
          <span className="text-sm font-semibold text-green-600">
            ✓ Guardado
          </span>
        )}
      </div>

      {loading && (
        <p className="text-sm text-txatini-muted">A carregar...</p>
      )}

      {!loading && (
        <div className="flex flex-col gap-6">
          {SETTING_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-txatini-muted">
                {group.title}
              </h2>
              <div className="flex flex-col gap-3">
                {group.keys.map((key) => (
                  <div
                    key={key}
                    className="rounded-xl border border-txatini-green/10 bg-txatini-surface p-4"
                  >
                    <label className="mb-1 block text-sm font-semibold text-txatini-ink">
                      {getLabel(key)}
                    </label>
                    <input
                      type={
                        key.includes('number') || key.includes('fee') || key.includes('commission')
                          ? 'text'
                          : 'text'
                      }
                      value={getValue(key)}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-colors ${
                        key in edited
                          ? 'border-txatini-orange'
                          : 'border-txatini-green/20 focus:border-txatini-orange'
                      }`}
                    />
                    {key === 'whatsapp_number' && (
                      <p className="mt-1 text-xs text-txatini-muted">
                        Formato: 258XXXXXXXXX (sem + nem espaços)
                      </p>
                    )}
                    {key === 'default_commission' && (
                      <p className="mt-1 text-xs text-txatini-muted">
                        Percentagem aplicada a novos revendedores (ex: 10)
                      </p>
                    )}
                    {key === 'delivery_fee' && (
                      <p className="mt-1 text-xs text-txatini-muted">
                        0 = entrega gratuita
                      </p>
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
