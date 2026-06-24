'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { usePathname } from 'next/navigation';

export default function CartFab() {
  const { totalItems, totalPrice } = useCart();
  const pathname = usePathname();

  // Só aparece quando há itens E não estamos já no carrinho ou checkout
  if (totalItems === 0) return null;
  if (pathname === '/carrinho' || pathname === '/checkout' || pathname === '/pedido-sucesso') return null;

  return (
    <Link
      href="/carrinho"
      className="fixed bottom-20 left-4 right-4 z-40 flex items-center justify-between rounded-xl px-5 py-3.5 shadow-lg sm:left-auto sm:right-5 sm:w-72"
      style={{ background: '#1E5C2A' }}
    >
      <div className="flex items-center gap-3">
        {/* Ícone carrinho */}
        <div className="relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="h-6 w-6">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: '#E07B2A' }}
          >
            {totalItems}
          </span>
        </div>
        <span className="text-sm font-bold text-white">
          {totalItems} {totalItems === 1 ? 'produto' : 'produtos'}
        </span>
      </div>
      <span className="text-sm font-extrabold text-white">
        {totalPrice} MZN →
      </span>
    </Link>
  );
}
