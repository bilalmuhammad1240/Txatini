import Link from 'next/link';
import Logo from '@/components/Logo';

interface HeroBannerProps {
  tagline?: string;
}

export default function HeroBanner({
  tagline = 'Sabor que lembra casa',
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden bg-txatini-green">
      {/* Padrão de fundo — círculos subtis evocando especiarias */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="spice-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="4" fill="white" />
              <circle cx="40" cy="30" r="6" fill="white" />
              <circle cx="55" cy="55" r="3" fill="white" />
              <circle cx="25" cy="50" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#spice-pattern)" />
        </svg>
      </div>

      {/* Gradiente lateral direito — laranja subtil */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-txatini-orange/20" />

      <div className="relative px-5 py-14 text-center">
        {/* Logo light no banner */}
        <div className="mb-5 flex justify-center">
          <Logo variant="light" size="lg" href="/" />
        </div>

        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          {tagline}
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/65">
          Temperos para o dia a dia. Entrega rápida em Maputo.
        </p>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/loja"
            className="inline-block rounded-lg bg-txatini-orange px-8 py-3 text-sm font-bold text-white shadow-sm active:opacity-90"
          >
            Ver Temperos
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white active:opacity-90"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.36a9.84 9.84 0 0 0 4.63 1.17h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2zm0 1.8c2.16 0 4.18.84 5.7 2.37a8.02 8.02 0 0 1 2.36 5.74c0 4.47-3.64 8.11-8.12 8.11a8.1 8.1 0 0 1-4.11-1.12l-.3-.17-3.03.77.81-2.95-.19-.31a8.06 8.06 0 0 1-1.24-4.33c0-4.48 3.65-8.11 8.12-8.11zm-4.5 4.5c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.34.99 2.5c.12.16 1.69 2.7 4.16 3.69 2.06.82 2.48.66 2.93.62.45-.04 1.45-.59 1.65-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.45-.71-1.67-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.96-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42z" />
            </svg>
            Falar connosco
          </a>
        </div>
      </div>
    </section>
  );
}
