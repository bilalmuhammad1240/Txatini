'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface HeroBannerProps {
  tagline?: string;
}

export default function HeroBanner({
  tagline = 'Sabor que lembra casa',
}: HeroBannerProps) {
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <section className="relative overflow-hidden" style={{ background: '#0F2A1E' }}>

      {/* Faixa de especiarias — assinatura visual única */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1" style={{ background: '#E07B2A' }} />
        <div className="flex-1" style={{ background: '#C8952A' }} />
        <div className="flex-1" style={{ background: '#A0522D' }} />
        <div className="flex-1" style={{ background: '#D4A017' }} />
        <div className="flex-1" style={{ background: '#8B1A1A' }} />
        <div className="flex-1" style={{ background: '#E07B2A' }} />
        <div className="flex-1" style={{ background: '#6B8E23' }} />
        <div className="flex-1" style={{ background: '#C8952A' }} />
      </div>

      {/* Imagem de fundo com overlay */}
      {!bannerError && (
        <div className="absolute inset-0 top-1.5">
          <Image
            src="/banner.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-20"
            onError={() => setBannerError(true)}
          />
        </div>
      )}

      {/* Textura de grão subtil via gradiente */}
      <div
        className="absolute inset-0 top-1.5"
        style={{
          background:
            'radial-gradient(ellipse at 80% 50%, rgba(224,123,42,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(15,42,30,0.8) 0%, transparent 50%)',
        }}
      />

      <div className="relative px-5 pt-8 pb-10">

        {/* Logo */}
        <div className="mb-8">
          {!logoError ? (
            <Image
              src="/logo.png"
              alt="Txatiní"
              width={120}
              height={40}
              priority
              className="object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div>
              <span
                className="text-2xl font-extrabold tracking-wider text-white"
                style={{ letterSpacing: '0.08em' }}
              >
                TXATINÍ
              </span>
              <div
                className="mt-1 h-0.5 w-16"
                style={{ background: '#E07B2A' }}
              />
            </div>
          )}
        </div>

        {/* Tagline — layout assimétrico, alinhado à esquerda */}
        <div className="max-w-xs">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: '#E07B2A' }}
          >
            Temperos Moçambicanos
          </p>
          <h1 className="text-3xl font-extrabold leading-tight text-white">
            {tagline}
          </h1>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Entrega rápida em Maputo e arredores.
          </p>
        </div>

        {/* Botões — lado a lado no mobile */}
        <div className="mt-8 flex gap-3">
          <Link
            href="/loja"
            className="flex-1 rounded-lg py-3 text-center text-sm font-bold text-white"
            style={{ background: '#E07B2A' }}
          >
            Ver Temperos
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold text-white"
            style={{ borderColor: 'rgba(255,255,255,0.25)' }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0" style={{ color: '#25D366' }}>
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.36a9.84 9.84 0 0 0 4.63 1.17h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2z" />
            </svg>
            WhatsApp
          </a>
        </div>

      </div>

      {/* Sombra descendente para transição suave para o fundo da página */}
      <div
        className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #E8DCCB)' }}
      />

    </section>
  );
}
