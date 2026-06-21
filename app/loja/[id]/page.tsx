import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types/product';
import ProductActions from './ProductActions';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  const p = product as Product;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white">
        {p.image_url ? (
          <Image
            src={p.image_url}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl">
            🌶️
          </div>
        )}
      </div>

      <div className="mt-5">
        <h1 className="text-2xl font-extrabold text-txatini-ink">{p.name}</h1>
        <p className="mt-1 text-2xl font-extrabold text-txatini-green">
          {p.price} MZN
        </p>

        {p.description && (
          <p className="mt-3 text-sm leading-relaxed text-txatini-ink/80">
            {p.description}
          </p>
        )}

        {p.stock <= 0 && (
          <p className="mt-3 text-sm font-semibold text-red-600">
            Produto esgotado de momento.
          </p>
        )}

        <ProductActions product={p} />
      </div>
    </div>
  );
}
