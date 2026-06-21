'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Order, OrderStatus } from '@/types/order';

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
        : await baseQuery
            .eq('status', filter)
            .order('created_at', { ascending: false });

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

  return (
    <div>
      <h1 className="mb-4 text-xl font-extrabold text-txatini-green">
        Pedidos
      </h1>

      <div className="mb-4 flex gap-2 overflow-x-auto">
        {(['todos', 'pendente', 'em_preparacao', 'entregue'] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                filter === status
                  ? 'bg-txatini-green text-white'
                  : 'border border-txatini-green/20 bg-white text-txatini-ink'
              }`}
            >
              {status === 'todos' ? 'Todos' : STATUS_LABELS[status]}
            </button>
          )
        )}
      </div>

      {loading && <p className="text-sm text-txatini-ink/60">A carregar...</p>}

      {!loading && orders.length === 0 && (
        <p className="text-sm text-txatini-ink/60">
          Nenhum pedido encontrado.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {orders.map((order) => {
          const isExpanded = expandedId === order.id;

          return (
            <div
              key={order.id}
              className="rounded-2xl border border-txatini-green/10 bg-white p-4"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                className="flex w-full items-center justify-between text-left"
              >
                <div>
                  <p className="text-sm font-bold text-txatini-ink">
                    {order.user_name} · {order.phone}
                  </p>
                  <p className="text-xs text-txatini-ink/60">
                    {new Date(order.created_at).toLocaleString('pt-PT')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-txatini-green">
                    {order.total} MZN
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[order.status]}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-3 border-t border-txatini-green/10 pt-3">
                  <p className="text-xs font-semibold text-txatini-ink/60">
                    {order.delivery_type === 'entrega' ? 'Entrega' : 'Recolha'}{' '}
                    · {order.location}
                  </p>

                  <ul className="mt-2 flex flex-col gap-1">
                    {order.order_items?.map((item) => (
                      <li key={item.id} className="text-sm text-txatini-ink">
                        {item.product_name} x{item.quantity} —{' '}
                        {item.price * item.quantity} MZN
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 flex gap-2">
                    {(['pendente', 'em_preparacao', 'entregue'] as const).map(
                      (status) => (
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
                      )
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
