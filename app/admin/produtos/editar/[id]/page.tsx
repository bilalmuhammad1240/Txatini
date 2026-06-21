import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types/product';
import ProductForm from '@/components/ProductForm';

interface EditarProdutoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarProdutoPage({
  params,
}: EditarProdutoPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-extrabold text-txatini-green">
        Editar produto
      </h1>
      <ProductForm initialProduct={product as Product} />
    </div>
  );
}
