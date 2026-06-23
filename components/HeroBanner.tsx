import Link from 'next/link';
import Image from 'next/image';

interface HeroBannerProps {
  tagline?: string;
}

export default function HeroBanner({
  tagline = 'Sabor que lembra casa',
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden bg-txatini-green">
      {/* Imagem de fundo banner.jpg */}
      <div className="absolute inset-0">
        <Image
          src="/banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Overlay escuro para legibilidade do texto */}
        <div className="absolute inset-0 bg-txatini-green/75" />
      </div>

      <div className="relative px-5 py-14 text-center">
        {/* Logo real */}
        <div className="mb-5 flex justify-center">
          <Image
            src="/logo.png"
            alt="Txatiní"
            width={140}
            height={48}
            priority
            className="object-contain drop-shadow-sm"
          />
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
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.36a9.84 9.84 0 0 0 4.63 1.17h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2z" />
            </svg>
            Falar connosco
          </a>
        </div>
      </div>
    </section>
  );
}
