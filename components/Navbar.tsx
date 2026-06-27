'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const [logoUrl, setLogoUrl] = useState('');
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('settings')
      .select('value')
      .eq('key', 'logo_url')
      .single()
      .then(({ data }) => {
        if (data?.value) setLogoUrl(data.value);
      });
  }, []);

  const resolvedLogo = logoUrl || '/logo.png';

  return (
    <header className="sticky top-0 z-40 border-b border-txatini-green/10 bg-txatini-cream/95 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-2">

        <Link href="/" aria-label="Txatiní — página principal">
          {!logoError ? (
            <Image
              src={resolvedLogo}
              alt="Txatiní"
              width={72}
              height={36}
              className="object-contain"
              style={{ mixBlendMode: 'multiply' }}
              priority
              onError={() => setLogoError(true)}
              {...(logoUrl ? { unoptimized: true } : {})}
            />
          ) : (
            <span className="text-lg font-extrabold tracking-wide text-txatini-green">
              TXATINÍ
            </span>
          )}
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm font-semibold text-txatini-ink hover:text-txatini-orange transition-colors">
            Início
          </Link>
          <Link href="/loja" className="text-sm font-semibold text-txatini-ink hover:text-txatini-orange transition-colors">
            Loja
          </Link>
        </div>

      </nav>
    </header>
  );
}
