'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="border-t border-txatini-green/10 bg-txatini-cream py-10 text-center">
      <div className="flex justify-center mb-3">
        {!logoError ? (
          <Image
            src="/logo.png"
            alt="Txatiní"
            width={72}
            height={36}
            className="object-contain"
            onError={() => setLogoError(true)}
          />
        ) : (
          <span className="text-base font-extrabold text-txatini-green">TXATINÍ</span>
        )}
      </div>
      <p className="text-xs text-txatini-ink/60">Sabor que lembra casa.</p>
      <p className="mt-1 text-xs text-txatini-ink/50">Entregas em Maputo e Moçambique.</p>

      <div className="mt-4 flex justify-center gap-4 text-xs font-semibold text-txatini-green">
        <Link href="/loja" className="hover:text-txatini-orange">Loja</Link>
        <Link href="/revendedor/registar" className="hover:text-txatini-orange">Ser revendedor</Link>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-txatini-orange"
        >
          WhatsApp
        </a>
      </div>

      <p className="mt-5 text-xs text-txatini-ink/40">
        © {new Date().getFullYear()} Txatiní. Todos os direitos reservados.
      </p>
    </footer>
  );
}
