'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/CartItem';

export default function CarrinhoPage() {
  const { items, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 text-center">
        <p className="text-4xl">🛒</p>
        <h1 className="mt-3 text-lg font-extrabold text-txatini-ink">
          O teu carrinho está vazio
        </h1>
        <p className="mt-1 text-sm text-txatini-ink/60">
          Adiciona temperos para continuar.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-txatini-orange px-6 py-3 text-sm font-bold text-white"
        >
          Ver Temperos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-6 pb-32">
      <h1 className="mb-4 text-xl font-extrabold text-txatini-green">
        O teu carrinho
      </h1>

      {/* Lista de itens — fundo surface em vez de branco */}
      <div className="rounded-xl bg-txatini-surface px-4">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      {/* Total */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-txatini-surface p-4">
        <span className="text-sm font-semibold text-txatini-ink/70">Total</span>
        <span className="text-xl font-extrabold text-txatini-green">
          {totalPrice} MZN
        </span>
      </div>

      <Link
        href="/"
        className="mt-3 block text-center text-sm font-semibold text-txatini-green"
      >
        ← Continuar a comprar
      </Link>

      {/* Botão fixo no fundo */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-txatini-green/10 bg-txatini-cream p-4">
        <Link
          href="/checkout"
          className="block w-full rounded-lg bg-txatini-orange py-3.5 text-center text-sm font-bold text-white"
        >
          Finalizar pedido — {totalPrice} MZN
        </Link>
      </div>
    </div>
  );
}
