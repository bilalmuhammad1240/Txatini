'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
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
              style={{ mixBlendMode: 'multiply' }}
              priority
              onError={() => setLogoError(true)}
            />
          ) : (
            <span className="text-lg font-extrabold tracking-wide text-txatini-green">
              TXATINÍ
            </span>
          )}
        </Link>

        {/* Só link para loja — carrinho aparece como FAB flutuante */}
        <Link
          href="/loja"
          className="text-sm font-semibold text-txatini-ink hover:text-txatini-orange transition-colors"
        >
          Loja
        </Link>

      </nav>
    </header>
  );
}
