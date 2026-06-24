import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { SettingsMap } from '@/types/settings';
import HeroBanner from '@/components/HeroBanner';
import HomeLojaClient from '@/components/HomeLojaClient';
import { Product } from '@/types/product';

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: allProducts }, { data: settingsRows }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false }),
    supabase.from('settings').select('key, value'),
  ]);

  const products = (allProducts as Product[]) ?? [];

  const settings: SettingsMap = Object.fromEntries(
    (settingsRows ?? []).map((r: { key: string; value: string }) => [r.key, r.value])
  );

  const tagline = settings.store_tagline || 'Sabor que lembra casa';

  return (
    <div>
      <HeroBanner tagline={tagline} />
      <Suspense fallback={null}>
        <HomeLojaClient initialProducts={products} />
      </Suspense>
    </div>
  );
}
