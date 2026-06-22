'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { DeliveryType } from '@/types/order';
import { buildOrderMessage, buildWhatsAppLink } from '@/lib/whatsapp';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('entrega');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-sm text-txatini-ink/60">
          O teu carrinho está vazio.
        </p>
        <button
          onClick={() => router.push('/loja')}
          className="mt-4 rounded-xl bg-txatini-orange px-6 py-3 text-sm font-bold text-white"
        >
          Ver Temperos
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !phone.trim() || !location.trim()) {
      setErrorMsg('Preenche o nome, telefone e localização.');
      return;
    }

    setSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: name.trim(),
          phone: phone.trim(),
          location: location.trim(),
          delivery_type: deliveryType,
          items: orderItems,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Não foi possível criar o pedido.');
      }

      const whatsappMessage = buildOrderMessage({
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
        deliveryType,
        items,
        total: totalPrice,
      });

      const whatsappLink = buildWhatsAppLink(whatsappMessage);

      clearCart();
      window.open(whatsappLink, '_blank', 'noopener,noreferrer');
      router.push('/pedido-sucesso');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Erro inesperado. Tenta novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-4 text-xl font-extrabold text-txatini-green">
        Checkout
      </h1>

      <div className="mb-5 rounded-2xl bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-txatini-ink/70">
            {items.length} {items.length === 1 ? 'produto' : 'produtos'}
          </span>
          <span className="font-extrabold text-txatini-green">
            {totalPrice} MZN
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="O teu nome"
            className="w-full rounded-xl border border-txatini-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-txatini-orange"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">
            Telefone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="84xxxxxxx"
            className="w-full rounded-xl border border-txatini-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-txatini-orange"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">
            Bairro / Localização
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Bairro Central, Maputo"
            className="w-full rounded-xl border border-txatini-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-txatini-orange"
          />
        </div>

        <div>
          <span className="mb-1 block text-sm font-semibold text-txatini-ink">
            Tipo
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDeliveryType('entrega')}
              className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold ${
                deliveryType === 'entrega'
                  ? 'border-txatini-green bg-txatini-green text-white'
                  : 'border-txatini-green/20 bg-white text-txatini-ink'
              }`}
            >
              Entrega
            </button>
            <button
              type="button"
              onClick={() => setDeliveryType('recolha')}
              className={`flex-1 rounded-xl border-2 py-3 text-sm font-bold ${
                deliveryType === 'recolha'
                  ? 'border-txatini-green bg-txatini-green text-white'
                  : 'border-txatini-green/20 bg-white text-txatini-ink'
              }`}
            >
              Recolha
            </button>
          </div>
        </div>

        {errorMsg && (
          <p className="text-sm font-semibold text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-xl bg-txatini-orange py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {submitting ? 'A enviar...' : 'Finalizar pedido no WhatsApp'}
        </button>
      </form>
    </div>
  );
}
