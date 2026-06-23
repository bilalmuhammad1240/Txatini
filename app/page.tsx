import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types/product';
import { SettingsMap } from '@/types/settings';
import ProductCard from '@/components/ProductCard';
import HeroBanner from '@/components/HeroBanner';

const CATEGORY_LABELS: Record<string, string> = {
  tempero: 'Temperos',
  marinada: 'Marinadas',
  especiaria: 'Especiarias',
  condimento: 'Condimentos',
  outro: 'Outros',
};

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: featuredProducts }, { data: settingsRows }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('settings').select('key, value'),
  ]);

  const products = (featuredProducts as Product[]) ?? [];

  const settings: SettingsMap = Object.fromEntries(
    (settingsRows ?? []).map((r: { key: string; value: string }) => [r.key, r.value])
  );

  const tagline = settings.store_tagline || 'Sabor que lembra casa';

  const categories = Array.from(new Set(products.map((p) => p.category))).slice(0, 5);

  return (
    <div>
      <HeroBanner tagline={tagline} />

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
