'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface HeroBannerProps {
  tagline?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export default function HeroBanner({
  tagline = 'Sabor que lembra casa',
  logoUrl = '',
  bannerUrl = '',
}: HeroBannerProps) {
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Determina a fonte da imagem: settings (Supabase) ou public/
  const resolvedBanner = bannerUrl || '/banner.jpg';
  const resolvedLogo = logoUrl || '/logo.png';
  const hasBanner = !bannerError;
  const hasLogo = !logoError;

  return (
    <section className="relative w-full overflow-hidden bg-txatini-green">
      <div className="relative w-full" style={{ aspectRatio: '16/7', minHeight: '220px' }}>

        {/* Banner */}
        {hasBanner && (
          <Image
            src={resolvedBanner}
            alt="Txatiní — Sabor que lembra casa"
            fill
            priority
            sizes="100vw"
            className="object-cover object-left-top"
            onError={() => setBannerError(true)}
            {...(bannerUrl ? { unoptimized: true } : {})}
          />
        )}

        {/* Overlay gradiente na base para legibilidade dos botões */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(30,92,42,0.88) 0%, transparent 100%)' }}
        />

        {/* Botões na base */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-3">
          <Link
            href="/loja"
            className="flex-1 rounded-lg py-2.5 text-center text-sm font-bold text-white"
            style={{ background: '#B85510' }}
          >
            Ver Temperos
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-bold text-white"
            style={{ borderColor: 'rgba(255,255,255,0.45)', background: 'rgba(0,0,0,0.25)' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" style={{ color: '#4ADE80' }}>
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.36a9.84 9.84 0 0 0 4.63 1.17h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2z" />
            </svg>
            WhatsApp
          </a>
        </div>

        {/* Fallback quando sem banner: mostrar tagline */}
        {!hasBanner && (
          <div className="absolute inset-0 flex flex-col justify-center px-5">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#B85510' }}>
              Temperos Moçambicanos
            </p>
            <h1 className="text-3xl font-extrabold leading-tight text-white">{tagline}</h1>
          </div>
        )}
      </div>
    </section>
  );
}
