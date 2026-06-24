'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Affiliate, AffiliateStatus, Commission } from '@/types/affiliate';

const STATUS_LABELS: Record<AffiliateStatus, string> = {
  pendente: 'Pendente',
  ativo: 'Ativo',
  suspenso: 'Suspenso',
};

const STATUS_COLORS: Record<AffiliateStatus, string> = {
  pendente: 'bg-yellow-100 text-yellow-700',
  ativo: 'bg-green-100 text-green-700',
  suspenso: 'bg-gray-100 text-gray-500',
};

export default function AdminRevendedoresPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingPct, setEditingPct] = useState<{ id: string; value: string } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const [{ data: affs }, { data: comms }] = await Promise.all([
      supabase.from('affiliates').select('*').order('created_at', { ascending: false }),
      supabase.from('commissions').select('*').order('created_at', { ascending: false }),
    ]);

    setAffiliates((affs as Affiliate[]) ?? []);
    setCommissions((comms as Commission[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateStatus = async (id: string, status: AffiliateStatus) => {
    const supabase = createClient();
    await supabase.from('affiliates').update({ status }).eq('id', id);
    fetchData();
  };

  const updateCommissionPct = async (id: string, pct: number) => {
    if (pct <= 0 || pct > 100) return;
    const supabase = createClient();
    await supabase.from('affiliates').update({ commission_pct: pct }).eq('id', id);
    setEditingPct(null);
    fetchData();
  };

  const markCommissionPaid = async (commissionId: string) => {
    const supabase = createClient();
    await supabase.from('commissions').update({ status: 'pago' }).eq('id', commissionId);
    fetchData();
  };

  const totalPendente = commissions
    .filter((c) => c.status === 'pendente')
    .reduce((sum, c) => sum + c.commission_amount, 0);

  const siteUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div>
      <h1 className="mb-4 text-xl font-extrabold text-txatini-green">
        Revendedores
      </h1>

      {/* Resumo de comissões por pagar */}
      <div className="mb-5 rounded-xl border border-txatini-green/10 bg-txatini-surface p-4">
        <p className="text-sm text-txatini-muted">Comissões por pagar</p>
        <p className="mt-1 text-2xl font-extrabold text-txatini-green">
          {totalPendente.toFixed(2)} MZN
        </p>
      </div>

      {loading && <p className="text-sm text-txatini-muted">A carregar...</p>}

      {!loading && affiliates.length === 0 && (
        <p className="text-sm text-txatini-muted">
          Nenhum pedido de revendedor ainda.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {affiliates.map((aff) => {
          const isExpanded = expandedId === aff.id;
          const affCommissions = commissions.filter((c) => c.affiliate_id === aff.id);
          const totalEarned = affCommissions.reduce((s, c) => s + c.commission_amount, 0);
          const totalPaid = affCommissions.filter((c) => c.status === 'pago').reduce((s, c) => s + c.commission_amount, 0);

          return (
            <div
              key={aff.id}
              className="rounded-xl border border-txatini-green/10 bg-txatini-surface"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : aff.id)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-txatini-ink">
                    {aff.name}
                  </p>
                  <p className="text-xs text-txatini-muted">
                    {aff.phone} · código: <span className="font-bold">{aff.code}</span>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs font-bold text-txatini-green">
                    {aff.commission_pct}%
                  </span>
                  <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[aff.status]}`}>
                    {STATUS_LABELS[aff.status]}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-txatini-green/10 p-4">

                  {/* Link do revendedor */}
                  <div className="mb-4">
                    <p className="mb-1 text-xs font-semibold text-txatini-muted">
                      Link pessoal
                    </p>
                    <p className="break-all rounded-lg bg-white px-3 py-2 text-xs font-mono text-txatini-green">
                      {siteUrl}?ref={aff.code}
                    </p>
                  </div>

                  {/* Comissão % editável */}
                  <div className="mb-4 flex items-center gap-3">
                    <p className="text-xs font-semibold text-txatini-muted">
                      Comissão:
                    </p>
                    {editingPct?.id === aff.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={editingPct.value}
                          onChange={(e) => setEditingPct({ id: aff.id, value: e.target.value })}
                          className="w-16 rounded-lg border border-txatini-green/20 px-2 py-1 text-sm"
                        />
                        <span className="text-sm">%</span>
                        <button
                          onClick={() => updateCommissionPct(aff.id, Number(editingPct.value))}
                          className="rounded-lg bg-txatini-green px-3 py-1 text-xs font-bold text-white"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditingPct(null)}
                          className="text-xs text-txatini-muted"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingPct({ id: aff.id, value: String(aff.commission_pct) })}
                        className="text-sm font-bold text-txatini-green underline decoration-dashed"
                      >
                        {aff.commission_pct}%
                      </button>
                    )}
                  </div>

                  {/* Resumo de ganhos */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-txatini-muted">Total ganho</p>
                      <p className="text-base font-extrabold text-txatini-green">
                        {totalEarned.toFixed(2)} MZN
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-3">
                      <p className="text-xs text-txatini-muted">Já pago</p>
                      <p className="text-base font-extrabold text-txatini-ink">
                        {totalPaid.toFixed(2)} MZN
                      </p>
                    </div>
                  </div>

                  {/* Comissões individuais */}
                  {affCommissions.length > 0 && (
                    <div className="mb-4">
                      <p className="mb-2 text-xs font-semibold text-txatini-muted">
                        Histórico de comissões
                      </p>
                      <div className="flex flex-col gap-2">
                        {affCommissions.map((c) => (
                          <div key={c.id} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs">
                            <span className="text-txatini-muted">
                              {new Date(c.created_at).toLocaleDateString('pt-PT')}
                              {' · '}pedido {c.order_total.toFixed(0)} MZN
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-txatini-green">
                                +{c.commission_amount.toFixed(2)} MZN
                              </span>
                              {c.status === 'pendente' ? (
                                <button
                                  onClick={() => markCommissionPaid(c.id)}
                                  className="rounded-md bg-txatini-green/10 px-2 py-0.5 font-semibold text-txatini-green"
                                >
                                  Marcar pago
                                </button>
                              ) : (
                                <span className="rounded-md bg-green-100 px-2 py-0.5 font-semibold text-green-700">
                                  Pago
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ações de status */}
                  <div className="flex flex-wrap gap-2">
                    {aff.status !== 'ativo' && (
                      <button
                        onClick={() => updateStatus(aff.id, 'ativo')}
                        className="rounded-lg bg-txatini-green px-4 py-2 text-xs font-bold text-white"
                      >
                        Aprovar
                      </button>
                    )}
                    {aff.status !== 'pendente' && (
                      <button
                        onClick={() => updateStatus(aff.id, 'pendente')}
                        className="rounded-lg border border-txatini-green/20 px-4 py-2 text-xs font-semibold text-txatini-ink"
                      >
                        Pendente
                      </button>
                    )}
                    {aff.status !== 'suspenso' && (
                      <button
                        onClick={() => updateStatus(aff.id, 'suspenso')}
                        className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-600"
                      >
                        Suspender
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
