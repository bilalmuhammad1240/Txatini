'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const { totalItems } = useCart();
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-txatini-green/10 bg-txatini-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-2">

        <Link href="/" aria-label="Txatiní — página principal">
          {!logoError ? (
            <Image
              src="/logo.png"
              alt="Txatiní"
              width={72}
              height={36}
              className="object-contain"
              style={{ mixBlendMode: 'multiply' }} // remove fundo branco — funde com o cream
              priority
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-lg font-extrabold tracking-wide text-txatini-green">
              TXATINÍ
            </span>
          )}
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/loja"
            className="text-sm font-semibold text-txatini-ink hover:text-txatini-orange transition-colors"
          >
            Loja
          </Link>
          <Link href="/carrinho" className="relative" aria-label="Carrinho">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6 text-txatini-ink hover:text-txatini-orange transition-colors"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
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
