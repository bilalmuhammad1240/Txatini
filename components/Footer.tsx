'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Footer() {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="border-t border-txatini-green/10 bg-txatini-cream py-8 text-center">
      <div className="flex justify-center mb-2">
        {!logoError ? (
          <Image
            src="/logo.png"
            alt="Txatiní"
            width={64}
            height={32}
            className="object-contain"
            style={{ mixBlendMode: 'multiply' }}
            onError={() => setLogoError(true)}
          />
        ) : (
          <span className="text-base font-extrabold text-txatini-green">TXATINÍ</span>
        )}
      </div>
      <p className="text-xs text-txatini-muted">Sabor que lembra casa.</p>
      <p className="mt-4 text-xs text-txatini-muted">
        © {new Date().getFullYear()} Txatiní. Todos os direitos reservados.
      </p>
    </footer>
  );
}
