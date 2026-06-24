'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { DeliveryType, PaymentMethod } from '@/types/order';
import { buildOrderMessage, buildWhatsAppLink } from '@/lib/whatsapp';
import { getAffiliateCode, clearAffiliateCode } from '@/lib/affiliate';
import { createClient } from '@/lib/supabase/client';
import { SettingsMap } from '@/types/settings';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('entrega');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('whatsapp');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [settings, setSettings] = useState<SettingsMap>({});

  useEffect(() => {
    const supabase = createClient();
    supabase.from('settings').select('key, value').then(({ data }) => {
      if (data) {
        setSettings(Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value])));
      }
    });
  }, []);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="text-sm text-txatini-muted">O teu carrinho está vazio.</p>
        <button
          onClick={() => router.push('/loja')}
          className="mt-4 rounded-lg bg-txatini-orange px-6 py-3 text-sm font-bold text-white"
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

    if (paymentMethod === 'mpesa' && !mpesaNumber.trim()) {
      setErrorMsg('Indica o número M-Pesa para pagamento.');
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

      const affiliateCode = getAffiliateCode();

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: name.trim(),
          phone: phone.trim(),
          location: location.trim(),
          delivery_type: deliveryType,
          payment_method: paymentMethod,
          ...(mpesaNumber.trim() ? { mpesa_number: mpesaNumber.trim() } : {}),
          items: orderItems,
          ...(affiliateCode ? { affiliate_code: affiliateCode } : {}),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Não foi possível criar o pedido.');
      }

      clearCart();
      clearAffiliateCode();

      if (paymentMethod === 'mpesa') {
        // M-Pesa: redirecionar para página de instruções de pagamento
        router.push(`/pedido-sucesso?metodo=mpesa&mpesa=${settings.mpesa_number || ''}&nome=${encodeURIComponent(settings.mpesa_name || 'Txatiní')}&total=${totalPrice}`);
      } else {
        // WhatsApp: gerar mensagem e abrir
        const whatsappMessage = buildOrderMessage({
          name: name.trim(),
          phone: phone.trim(),
          location: location.trim(),
          deliveryType,
          items,
          total: totalPrice,
        });
        const whatsappLink = buildWhatsAppLink(whatsappMessage);
        window.open(whatsappLink, '_blank', 'noopener,noreferrer');
        router.push('/pedido-sucesso');
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Erro inesperado. Tenta novamente.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const mpesaStoreNumber = settings.mpesa_number || '';
  const mpesaStoreName = settings.mpesa_name || 'Txatiní';

  return (
    <div className="mx-auto max-w-md px-5 py-6">
      <h1 className="mb-4 text-xl font-extrabold text-txatini-green">Checkout</h1>

      {/* Resumo do pedido */}
      <div className="mb-5 flex items-center justify-between rounded-xl bg-txatini-surface p-4">
        <span className="text-sm text-txatini-muted">
          {items.length} {items.length === 1 ? 'produto' : 'produtos'}
        </span>
        <span className="text-lg font-extrabold text-txatini-green">
          {totalPrice} MZN
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Dados pessoais */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="O teu nome"
            className="w-full rounded-lg border border-txatini-green/20 bg-txatini-surface px-4 py-3 text-sm outline-none focus:border-txatini-orange"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">Telefone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="84xxxxxxx"
            className="w-full rounded-lg border border-txatini-green/20 bg-txatini-surface px-4 py-3 text-sm outline-none focus:border-txatini-orange"
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
            className="w-full rounded-lg border border-txatini-green/20 bg-txatini-surface px-4 py-3 text-sm outline-none focus:border-txatini-orange"
          />
        </div>

        {/* Tipo de entrega */}
        <div>
          <span className="mb-2 block text-sm font-semibold text-txatini-ink">Entrega</span>
          <div className="flex gap-3">
            {(['entrega', 'recolha'] as const).map((tipo) => (
              <button
                key={tipo}
                type="button"
                onClick={() => setDeliveryType(tipo)}
                className={`flex-1 rounded-lg border-2 py-3 text-sm font-bold capitalize ${
                  deliveryType === tipo
                    ? 'border-txatini-green bg-txatini-green text-white'
                    : 'border-txatini-green/20 bg-txatini-surface text-txatini-ink'
                }`}
              >
                {tipo === 'entrega' ? 'Entrega' : 'Recolha'}
              </button>
            ))}
          </div>
        </div>

        {/* Método de pagamento */}
        <div>
          <span className="mb-2 block text-sm font-semibold text-txatini-ink">
            Pagamento
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('whatsapp')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-bold ${
                paymentMethod === 'whatsapp'
                  ? 'border-[#25D366] bg-[#25D366] text-white'
                  : 'border-txatini-green/20 bg-txatini-surface text-txatini-ink'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.36a9.84 9.84 0 0 0 4.63 1.17h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2z" />
              </svg>
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('mpesa')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-bold ${
                paymentMethod === 'mpesa'
                  ? 'border-[#E2001A] bg-[#E2001A] text-white'
                  : 'border-txatini-green/20 bg-txatini-surface text-txatini-ink'
              }`}
            >
              M-Pesa
            </button>
          </div>

          {/* Instruções M-Pesa inline */}
          {paymentMethod === 'mpesa' && (
            <div className="mt-3 rounded-lg border border-[#E2001A]/20 bg-red-50 p-4">
              <p className="text-xs font-bold text-[#E2001A] mb-2">
                Instruções de pagamento M-Pesa:
              </p>
              <ol className="flex flex-col gap-1 text-xs text-txatini-ink/80">
                <li>1. Abre o M-Pesa no teu telemóvel</li>
                <li>2. Seleciona <strong>Enviar Dinheiro</strong></li>
                <li>3. Envia <strong>{totalPrice} MZN</strong> para:</li>
              </ol>
              <div className="mt-2 rounded-lg bg-white p-3 text-center">
                <p className="text-lg font-extrabold text-txatini-ink">{mpesaStoreNumber}</p>
                <p className="text-xs text-txatini-muted">{mpesaStoreName}</p>
              </div>
              <div className="mt-3">
                <label className="mb-1 block text-xs font-semibold text-txatini-ink">
                  O teu número M-Pesa (para confirmarmos)
                </label>
                <input
                  type="tel"
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  placeholder="84xxxxxxx"
                  className="w-full rounded-lg border border-[#E2001A]/30 bg-white px-3 py-2 text-sm outline-none focus:border-[#E2001A]"
                />
              </div>
            </div>
          )}
        </div>

        {errorMsg && (
          <p className="text-sm font-semibold text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`mt-2 rounded-lg py-3 text-sm font-bold text-white disabled:opacity-50 ${
            paymentMethod === 'mpesa' ? 'bg-[#E2001A]' : 'bg-txatini-orange'
          }`}
        >
          {submitting
            ? 'A enviar...'
            : paymentMethod === 'mpesa'
            ? 'Confirmar e pagar por M-Pesa'
            : 'Finalizar pedido no WhatsApp'}
        </button>
      </form>
    </div>
  );
}
