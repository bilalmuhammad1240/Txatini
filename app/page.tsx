import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';

const CATEGORY_LABELS: Record<string, string> = {
  tempero: 'Temperos',
  marinada: 'Marinadas',
  especiaria: 'Especiarias',
  condimento: 'Condimentos',
  outro: 'Outros',
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(8);

  const products = (featuredProducts as Product[]) ?? [];

  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).slice(0, 5);

  return (
    <div>
      {/* Hero — verde escuro, sem gradiente, sem brilho */}
      <section className="bg-txatini-green px-5 py-14 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/50">
          Txatiní
        </p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
          Sabor que lembra casa
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/70">
          Temperos para a tua comida do dia a dia. Sabor garantido, sem
          complicação.
        </p>
        <div className="mt-7">
          <Link
            href="/loja"
            className="inline-block rounded-lg bg-txatini-orange px-8 py-3 text-sm font-bold text-white"
          >
            Ver Temperos
          </Link>
        </div>
      </section>

      {/* Categorias */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-5xl px-5 py-8">
          <h2 className="mb-4 text-base font-extrabold text-txatini-green">
            Categorias
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/loja?categoria=${cat}`}
                className="shrink-0 rounded-lg border border-txatini-green/15 bg-txatini-surface px-4 py-2 text-sm font-semibold text-txatini-ink"
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Produtos em destaque */}
      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-txatini-green">
            Produtos em destaque
          </h2>
          <Link href="/loja" className="text-sm font-semibold text-txatini-orange">
            Ver todos
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-txatini-ink/50">
            Ainda não há produtos disponíveis. Volta em breve!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
