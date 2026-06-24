'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Order, OrderStatus, PaymentStatus } from '@/types/order';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pendente: 'Pendente',
  em_preparacao: 'Em preparação',
  entregue: 'Entregue',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pendente: 'bg-yellow-100 text-yellow-700',
  em_preparacao: 'bg-blue-100 text-blue-700',
  entregue: 'bg-green-100 text-green-700',
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pendente: 'Pagamento pendente',
  confirmado: 'Pago',
  falhado: 'Falhado',
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pendente: 'bg-orange-100 text-orange-700',
  confirmado: 'bg-green-100 text-green-700',
  falhado: 'bg-red-100 text-red-700',
};

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'todos'>('todos');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const baseQuery = supabase.from('orders').select('*, order_items(*)');

    const { data } =
      filter === 'todos'
        ? await baseQuery.order('created_at', { ascending: false })
        : await baseQuery.eq('status', filter).order('created_at', { ascending: false });

    setOrders((data as Order[]) ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const supabase = createClient();
    await supabase.from('orders').update({ status }).eq('id', orderId);
    fetchOrders();
  };

  const updatePaymentStatus = async (orderId: string, payment_status: PaymentStatus) => {
    const supabase = createClient();
    await supabase.from('orders').update({ payment_status }).eq('id', orderId);
    fetchOrders();
  };

  return (
    <div>
      <h1 className="mb-4 text-xl font-extrabold text-txatini-green">Pedidos</h1>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {(['todos', 'pendente', 'em_preparacao', 'entregue'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold ${
              filter === status
                ? 'bg-txatini-green text-white'
                : 'border border-txatini-green/20 bg-txatini-surface text-txatini-ink'
            }`}
          >
            {status === 'todos' ? 'Todos' : STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-txatini-muted">A carregar...</p>}
      {!loading && orders.length === 0 && (
        <p className="text-sm text-txatini-muted">Nenhum pedido encontrado.</p>
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const isExpanded = expandedId === order.id;
          const isMpesa = order.payment_method === 'mpesa';

          return (
            <div
              key={order.id}
              className="rounded-xl border border-txatini-green/10 bg-txatini-surface"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="flex w-full items-start justify-between gap-3 p-4 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-txatini-ink">
                    {order.user_name} · {order.phone}
                  </p>
                  <p className="text-xs text-txatini-muted">
                    {new Date(order.created_at).toLocaleString('pt-PT')}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                    {isMpesa && (
                      <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${PAYMENT_STATUS_COLORS[order.payment_status || 'pendente']}`}>
                        M-Pesa · {PAYMENT_STATUS_LABELS[order.payment_status || 'pendente']}
                      </span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-sm font-extrabold text-txatini-green">
                  {order.total} MZN
                </span>
              </button>

              {isExpanded && (
                <div className="border-t border-txatini-green/10 p-4">
                  <p className="text-xs font-semibold text-txatini-muted mb-3">
                    {order.delivery_type === 'entrega' ? 'Entrega' : 'Recolha'} · {order.location}
                  </p>

                  {/* Dados M-Pesa */}
                  {isMpesa && order.mpesa_number && (
                    <div className="mb-3 rounded-lg border border-[#E2001A]/20 bg-red-50 p-3">
                      <p className="text-xs font-bold text-[#E2001A]">M-Pesa</p>
                      <p className="text-sm font-semibold text-txatini-ink mt-0.5">
                        {order.mpesa_number}
                      </p>
                      <div className="mt-2 flex gap-2">
                        {order.payment_status !== 'confirmado' && (
                          <button
                            onClick={() => updatePaymentStatus(order.id, 'confirmado')}
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white"
                          >
                            ✓ Confirmar pagamento
                          </button>
                        )}
                        {order.payment_status !== 'falhado' && order.payment_status !== 'confirmado' && (
                          <button
                            onClick={() => updatePaymentStatus(order.id, 'falhado')}
                            className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600"
                          >
                            ✗ Marcar falhado
                          </button>
                        )}
                        {order.payment_status === 'confirmado' && (
                          <span className="text-xs font-semibold text-green-700">✓ Pagamento confirmado</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Itens do pedido */}
                  <ul className="mb-3 flex flex-col gap-1">
                    {order.order_items?.map((item) => (
                      <li key={item.id} className="text-sm text-txatini-ink">
                        {item.product_name} ×{item.quantity} —{' '}
                        {(item.price * item.quantity).toFixed(0)} MZN
                      </li>
                    ))}
                  </ul>

                  {/* Afiliado */}
                  {order.affiliate_code && (
                    <p className="mb-3 text-xs text-txatini-muted">
                      Revendedor: <strong>{order.affiliate_code}</strong> · comissão:{' '}
                      {order.commission_amount} MZN
                    </p>
                  )}

                  {/* Mudar status de entrega */}
                  <div className="flex flex-wrap gap-2">
                    {(['pendente', 'em_preparacao', 'entregue'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.id, status)}
                        disabled={order.status === status}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                          order.status === status
                            ? 'bg-txatini-green/10 text-txatini-green/40'
                            : 'border border-txatini-green/20 text-txatini-green'
                        }`}
                      >
                        {STATUS_LABELS[status]}
                      </button>
                    ))}
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
