'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/CartItem';

export default function CarrinhoPage() {
  const { items, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-4xl">🛒</p>
        <h1 className="mt-3 text-lg font-extrabold text-txatini-ink">
          O teu carrinho está vazio
        </h1>
        <p className="mt-1 text-sm text-txatini-ink/60">
          Adiciona temperos da nossa loja para continuar.
        </p>
        <Link
          href="/loja"
          className="mt-6 inline-block rounded-xl bg-txatini-orange px-6 py-3 text-sm font-bold text-white"
        >
          Ver Temperos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-4 text-xl font-extrabold text-txatini-green">
        Carrinho
      </h1>

      <div className="rounded-2xl bg-white px-4">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-4">
        <span className="text-sm font-semibold text-txatini-ink/70">
          Total
        </span>
        <span className="text-xl font-extrabold text-txatini-green">
          {totalPrice} MZN
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-4 block rounded-xl bg-txatini-orange py-3 text-center text-sm font-bold text-white"
      >
        Finalizar pedido
      </Link>

      <Link
        href="/loja"
        className="mt-3 block text-center text-sm font-semibold text-txatini-green"
      >
        Continuar a comprar
      </Link>
    </div>
  );
}
