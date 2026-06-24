'use client';

import { useState, useMemo } from 'react';
import { Product, ProductCategory } from '@/types/product';
import ProductCard from '@/components/ProductCard';

const CATEGORY_LABELS: Record<string, string> = {
  todos: 'Todos',
  tempero: 'Temperos',
  marinada: 'Marinadas',
  especiaria: 'Especiarias',
  condimento: 'Condimentos',
  outro: 'Outros',
};

interface HomeLojaClientProps {
  initialProducts: Product[];
}

export default function HomeLojaClient({ initialProducts }: HomeLojaClientProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | 'todos'>('todos');

  // Categorias presentes nos produtos reais
  const categories = useMemo(() => {
    const cats = Array.from(new Set(initialProducts.map((p) => p.category)));
    return ['todos', ...cats] as (ProductCategory | 'todos')[];
  }, [initialProducts]);

  // Filtro client-side — sem chamadas extra ao Supabase
  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchCat = category === 'todos' || p.category === category;
      const matchSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [initialProducts, category, search]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-6 pb-32">

      {/* Pesquisa */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-txatini-ink/40"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar tempero..."
          className="w-full rounded-lg border border-txatini-green/20 bg-txatini-surface pl-9 pr-4 py-3 text-sm outline-none focus:border-txatini-orange"
        />
      </div>

      {/* Filtro de categorias */}
      {categories.length > 1 && (
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                category === cat
                  ? 'bg-txatini-green text-white'
                  : 'border border-txatini-green/15 bg-txatini-surface text-txatini-ink'
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>
      )}

      {/* Contagem de resultados */}
      {search && (
        <p className="mb-3 text-xs text-txatini-ink/50">
          {filtered.length} {filtered.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>
      )}

      {/* Grid de produtos */}
      {filtered.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-txatini-ink/50">Nenhum produto encontrado.</p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="mt-3 text-sm font-semibold text-txatini-orange"
            >
              Limpar pesquisa
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
