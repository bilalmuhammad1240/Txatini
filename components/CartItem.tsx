'use client';

import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/cart';
import { useCart } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex items-center gap-3 border-b border-txatini-green/10 py-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-txatini-cream">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">
            🌶️
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-bold text-txatini-ink">
          {product.name}
        </p>
        <p className="text-sm font-semibold text-txatini-green">
          {product.price} MZN
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(product.id, quantity - 1)}
          aria-label="Diminuir quantidade"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-txatini-green/30 text-txatini-green"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-bold">{quantity}</span>
        <button
          onClick={() => updateQuantity(product.id, quantity + 1)}
          aria-label="Aumentar quantidade"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-txatini-green/30 text-txatini-green"
        >
          +
        </button>
      </div>

      <button
        onClick={() => removeItem(product.id)}
        aria-label="Remover item"
        className="ml-1 text-txatini-muted hover:text-red-500"
      >
        ✕
      </button>
    </div>
  );
}
