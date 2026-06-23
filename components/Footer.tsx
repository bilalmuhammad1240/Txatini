'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Footer() {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="border-t border-txatini-green/10 bg-txatini-cream py-8 text-center text-sm text-txatini-ink/70">
      <div className="flex justify-center mb-3">
        {!logoError ? (
          <Image
            src="/logo.png"
            alt="Txatiní"
            width={80}
            height={28}
            className="object-contain opacity-70"
            onError={() => setLogoError(true)}
          />
        ) : (
          <span className="text-base font-extrabold text-txatini-green/70">TXATINÍ</span>
        )}
      </div>
      <p className="mt-1 text-xs">Sabor que lembra casa.</p>
      <p className="mt-2 text-xs">Entregas em Maputo e Moçambique.</p>
      <p className="mt-4 text-xs opacity-60">
        © {new Date().getFullYear()} Txatiní. Todos os direitos reservados.
      </p>
    </footer>
  );
}
