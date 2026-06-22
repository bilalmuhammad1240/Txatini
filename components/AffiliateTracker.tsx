'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { saveAffiliateCode } from '@/lib/affiliate';

export default function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref && ref.trim().length > 0) {
      saveAffiliateCode(ref.trim().toUpperCase());
    }
  }, [searchParams]);

  return null; // componente invisível — só corre lógica
}
