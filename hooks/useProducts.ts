'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Product, ProductCategory } from '@/types/product';

interface UseProductsOptions {
  category?: ProductCategory | 'todos';
  search?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      let query = supabase.from('products').select('*').eq('active', true);

      if (options.category && options.category !== 'todos') {
        query = query.eq('category', options.category);
      }

      if (options.search) {
        query = query.ilike('name', `%${options.search}%`);
      }

      const { data, error: fetchError } = await query.order('created_at', {
        ascending: false,
      });

      if (!isMounted) return;

      if (fetchError) {
        setError(fetchError.message);
        setDebugInfo(
          JSON.stringify(
            {
              url: process.env.NEXT_PUBLIC_SUPABASE_URL,
              message: fetchError.message,
              details: fetchError.details,
              hint: fetchError.hint,
              code: fetchError.code,
            },
            null,
            2
          )
        );
        setProducts([]);
      } else {
        setDebugInfo(
          `url: ${process.env.NEXT_PUBLIC_SUPABASE_URL} | rows: ${data?.length ?? 0}`
        );
        setProducts((data as Product[]) ?? []);
      }
      setLoading(false);
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [options.category, options.search]);

  return { products, loading, error, debugInfo };
}
