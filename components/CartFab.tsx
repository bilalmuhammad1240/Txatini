'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { usePathname } from 'next/navigation';

export default function CartFab() {
  const { totalItems, totalPrice } = useCart();
  const pathname = usePathname();

  if (totalItems === 0) return null;
  if (pathname === '/carrinho' || pathname === '/checkout' || pathname === '/pedido-sucesso') return null;

  return (
    <Link
      href="/carrinho"
      aria-label={`Ver carrinho — ${totalItems} produtos, ${totalPrice} MZN`}
      className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full px-4 py-2.5 shadow-lg"
      style={{ background: '#1E5C2A' }}
    >
      {/* Ícone carrinho */}
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="h-5 w-5 shrink-0">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {/* Badge de quantidade */}
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ background: '#C4600A' }}
      >
        {totalItems}
      </span>
      {/* Total — visível mas compacto */}
      <span className="text-sm font-bold text-white">
        {totalPrice} MZN
      </span>
    </Link>
  );
}
