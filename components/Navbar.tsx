'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-txatini-green/10 bg-txatini-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="text-xl font-extrabold tracking-tight text-txatini-green">
            TXATINÍ
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-semibold text-txatini-ink">
          <Link href="/loja" className="hover:text-txatini-orange">
            Loja
          </Link>
          <Link
            href="/carrinho"
            className="relative flex items-center gap-1 hover:text-txatini-orange"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="sr-only">Carrinho</span>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-txatini-orange text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
