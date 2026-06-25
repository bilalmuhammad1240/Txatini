'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-txatini-green/10 bg-txatini-surface shadow-sm">
      <Link href={`/loja/${product.id}`} className="block">
        <div className="relative aspect-square w-full bg-txatini-cream overflow-hidden">
          {product.image_url ? (
            <>
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center"
              />
              {/* overlay subtil para absorver brilho da imagem */}
              <div className="absolute inset-0 bg-txatini-ink/8" />
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl">
              🌶️
            </div>
          )}
          {product.stock <= 0 && (
            <span className="absolute left-2 top-2 rounded-md bg-txatini-ink/75 px-2 py-1 text-xs font-semibold text-white">
              Esgotado
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <Link href={`/loja/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-txatini-ink">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm font-extrabold text-txatini-green">
          {product.price} MZN
        </p>

        <button
          onClick={() => addItem(product, 1)}
          disabled={product.stock <= 0}
          aria-label={`Adicionar ${product.name} ao carrinho`}
          className="mt-auto rounded-lg bg-txatini-orange py-2 text-sm font-bold text-white transition-opacity active:opacity-80 disabled:opacity-40"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
