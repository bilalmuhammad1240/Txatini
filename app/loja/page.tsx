'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import { ProductCategory } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import CategoryFilter from '@/components/CategoryFilter';

function LojaContent() {
  const searchParams = useSearchParams();
  const initialCategory =
    (searchParams.get('categoria') as ProductCategory | null) ?? 'todos';

  const [category, setCategory] = useState<ProductCategory | 'todos'>(
    initialCategory
  );
  const [search, setSearch] = useState('');

  const { products, loading, error } = useProducts({ category, search });

  return (
    <div className="mx-auto max-w-5xl px-5 py-7">
      <h1 className="mb-5 text-xl font-extrabold text-txatini-green">Loja</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pesquisar tempero..."
        className="mb-4 w-full rounded-lg border border-txatini-green/20 bg-txatini-surface px-4 py-3 text-sm outline-none focus:border-txatini-orange"
      />

      <div className="mb-6">
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {loading && (
        <p className="text-sm text-txatini-ink/50">A carregar produtos...</p>
      )}

      {error && (
        <p className="text-sm text-red-600">
          Não foi possível carregar os produtos. Tenta novamente.
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="text-sm text-txatini-ink/50">
          Nenhum produto encontrado.
        </p>
      )}

      {!loading && products.length > 0 && (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LojaPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-5 py-7 text-sm text-txatini-ink/50">
          A carregar...
        </div>
      }
    >
      <LojaContent />
    </Suspense>
  );
}
