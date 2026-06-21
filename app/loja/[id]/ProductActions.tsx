'use client';

import { useRouter } from 'next/navigation';
import { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { buildDirectProductMessage, buildWhatsAppLink } from '@/lib/whatsapp';

interface ProductActionsProps {
  product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(product, 1);
    router.push('/carrinho');
  };

  const directLink = buildWhatsAppLink(
    buildDirectProductMessage(product.name, product.price)
  );

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className="flex-1 rounded-xl bg-txatini-orange py-3 text-sm font-bold text-white disabled:opacity-40"
      >
        Adicionar ao carrinho
      </button>
      <a
        href={directLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 rounded-xl border-2 border-[#25D366] py-3 text-center text-sm font-bold text-[#1B7A43]"
      >
        Comprar no WhatsApp
      </a>
    </div>
  );
}
