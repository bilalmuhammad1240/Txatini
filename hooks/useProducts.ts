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

      // LOG TEMPORÁRIO DE DIAGNÓSTICO — remover depois de resolver o problema
      console.log('[useProducts] supabase url:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('[useProducts] data:', data);
      console.log('[useProducts] error:', fetchError);

      if (!isMounted) return;

      if (fetchError) {
        console.error('[useProducts] Erro completo:', {
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint,
          code: fetchError.code,
        });
        setError(fetchError.message);
        setProducts([]);
      } else {
        setProducts((data as Product[]) ?? []);
      }
      setLoading(false);
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [options.category, options.search]);

  return { products, loading, error };
}
