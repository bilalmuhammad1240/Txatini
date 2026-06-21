'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { NewProduct, Product, ProductCategory } from '@/types/product';

interface ProductFormProps {
  initialProduct?: Product;
}

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'tempero', label: 'Tempero' },
  { value: 'marinada', label: 'Marinada' },
  { value: 'especiaria', label: 'Especiaria' },
  { value: 'condimento', label: 'Condimento' },
  { value: 'outro', label: 'Outro' },
];

export default function ProductForm({ initialProduct }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name ?? '');
  const [description, setDescription] = useState(
    initialProduct?.description ?? ''
  );
  const [price, setPrice] = useState(
    initialProduct ? String(initialProduct.price) : ''
  );
  const [category, setCategory] = useState<ProductCategory>(
    initialProduct?.category ?? 'tempero'
  );
  const [stock, setStock] = useState(
    initialProduct ? String(initialProduct.stock) : '0'
  );
  const [active, setActive] = useState(initialProduct?.active ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialProduct?.image_url ?? null
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !price) {
      setError('Preenche o nome e o preço.');
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    try {
      let imageUrl = initialProduct?.image_url ?? null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('txatini-product-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          throw new Error('Não foi possível enviar a imagem.');
        }

        const { data: publicUrlData } = supabase.storage
          .from('txatini-product-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const payload: NewProduct = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        image_url: imageUrl,
        category,
        stock: Number(stock),
        active,
      };

      if (isEditing && initialProduct) {
        const { error: updateError } = await supabase
          .from('products')
          .update(payload)
          .eq('id', initialProduct.id);

        if (updateError) throw new Error('Não foi possível atualizar o produto.');
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert(payload);

        if (insertError) throw new Error('Não foi possível criar o produto.');
      }

      router.push('/admin/produtos');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro inesperado. Tenta novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1 block text-sm font-semibold text-txatini-ink">
          Nome
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-txatini-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-txatini-orange"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-txatini-ink">
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-txatini-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-txatini-orange"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">
            Preço (MZN)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-xl border border-txatini-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-txatini-orange"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">
            Stock
          </label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full rounded-xl border border-txatini-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-txatini-orange"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-txatini-ink">
          Categoria
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory)}
          className="w-full rounded-xl border border-txatini-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-txatini-orange"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-txatini-ink">
          Imagem
        </label>
        {imagePreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreview}
            alt="Pré-visualização"
            className="mb-2 h-32 w-32 rounded-xl object-cover"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold text-txatini-ink">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
          className="h-4 w-4"
        />
        Produto ativo (visível na loja)
      </label>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-xl bg-txatini-orange py-3 text-sm font-bold text-white disabled:opacity-50"
      >
        {submitting
          ? 'A guardar...'
          : isEditing
          ? 'Guardar alterações'
          : 'Criar produto'}
      </button>
    </form>
  );
}
