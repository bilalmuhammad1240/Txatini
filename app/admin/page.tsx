import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: totalOrders }, { count: pendingOrders }, { count: activeProducts }] =
    await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pendente'),
      supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('active', true),
    ]);

  const stats = [
    { label: 'Total de pedidos', value: totalOrders ?? 0 },
    { label: 'Pedidos pendentes', value: pendingOrders ?? 0 },
    { label: 'Produtos ativos', value: activeProducts ?? 0 },
  ];

  return (
    <div>
      <h1 className="mb-4 text-xl font-extrabold text-txatini-green">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-txatini-green/10 bg-white p-5"
          >
            <p className="text-sm text-txatini-ink/60">{stat.label}</p>
            <p className="mt-1 text-3xl font-extrabold text-txatini-green">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
