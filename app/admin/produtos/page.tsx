'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/types/product';

export default function AdminProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que queres apagar este produto?')) return;

    const supabase = createClient();
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const toggleActive = async (product: Product) => {
    const supabase = createClient();
    await supabase
      .from('products')
      .update({ active: !product.active })
      .eq('id', product.id);
    fetchProducts();
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold text-txatini-green">
          Produtos
        </h1>
        <Link
          href="/admin/produtos/novo"
          className="rounded-xl bg-txatini-orange px-4 py-2 text-sm font-bold text-white"
        >
          + Novo produto
        </Link>
      </div>

      {loading && (
        <p className="text-sm text-txatini-ink/60">A carregar...</p>
      )}

      {!loading && products.length === 0 && (
        <p className="text-sm text-txatini-ink/60">
          Ainda não tens produtos. Cria o primeiro.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-txatini-green/10 bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-txatini-ink">
                {product.name}
              </p>
              <p className="text-sm text-txatini-green">
                {product.price} MZN · stock: {product.stock}
              </p>
              <span
                className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                  product.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {product.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => toggleActive(product)}
                className="rounded-lg border border-txatini-green/20 px-3 py-2 text-xs font-semibold text-txatini-ink"
              >
                {product.active ? 'Desativar' : 'Ativar'}
              </button>
              <Link
                href={`/admin/produtos/editar/${product.id}`}
                className="rounded-lg border border-txatini-green/20 px-3 py-2 text-xs font-semibold text-txatini-green"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(product.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
              >
                Apagar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
