'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { DeliveryType, PaymentMethod } from '@/types/order';
import { buildOrderMessage, buildWhatsAppLink } from '@/lib/whatsapp';
import { getAffiliateCode, clearAffiliateCode } from '@/lib/affiliate';
import { createClient } from '@/lib/supabase/client';
import { SettingsMap } from '@/types/settings';

type CheckoutStep = 'form' | 'mpesa_waiting' | 'mpesa_success' | 'mpesa_failed';

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
  const [step, setStep] = useState<CheckoutStep>('form');
  const [mpesaMessage, setMpesaMessage] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('settings').select('key, value').then(({ data }) => {
      if (data) {
        setSettings(
          Object.fromEntries(
            data.map((r: { key: string; value: string }) => [r.key, r.value])
          )
        );
      }
    });
  }, []);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="text-sm text-txatini-muted">O teu carrinho está vazio.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 rounded-lg bg-txatini-orange px-6 py-3 text-sm font-bold text-white"
        >
          Ver Temperos
        </button>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // Ecrã de espera M-Pesa
  // ────────────────────────────────────────────────
  if (step === 'mpesa_waiting') {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <div className="mb-5 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-txatini-surface border-t-txatini-green" />
        </div>
        <h2 className="text-lg font-extrabold text-txatini-green">
          A processar pagamento…
        </h2>
        <p className="mt-2 text-sm text-txatini-muted">
          Verifica o teu telemóvel — deves receber um popup M-Pesa para confirmar o pagamento de <strong>{totalPrice} MZN</strong>.
        </p>
        <p className="mt-4 text-xs text-txatini-muted">
          Insere o teu PIN M-Pesa para confirmar. Não feches esta página.
        </p>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // Sucesso M-Pesa
  // ────────────────────────────────────────────────
  if (step === 'mpesa_success') {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="text-5xl">✅</p>
        <h2 className="mt-4 text-xl font-extrabold text-txatini-green">
          Pagamento confirmado!
        </h2>
        <p className="mt-2 text-sm text-txatini-muted">{mpesaMessage}</p>
        <button
          onClick={() => router.push('/')}
          className="mt-8 block w-full rounded-lg bg-txatini-orange py-3 text-sm font-bold text-white"
        >
          Continuar a comprar
        </button>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // Falha M-Pesa
  // ────────────────────────────────────────────────
  if (step === 'mpesa_failed') {
    return (
      <div className="mx-auto max-w-md px-5 py-16 text-center">
        <p className="text-5xl">❌</p>
        <h2 className="mt-4 text-xl font-extrabold text-txatini-ink">
          Pagamento não processado
        </h2>
        <p className="mt-2 text-sm text-txatini-muted">{mpesaMessage}</p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => setStep('form')}
            className="rounded-lg bg-txatini-green py-3 text-sm font-bold text-white"
          >
            Tentar novamente
          </button>
          {orderId && (
            <button
              onClick={() => {
                const msg = buildOrderMessage({
                  name, phone, location, deliveryType, items, total: totalPrice,
                });
                window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
                clearCart();
                clearAffiliateCode();
                router.push('/pedido-sucesso');
              }}
              className="rounded-lg border border-txatini-green/20 py-3 text-sm font-semibold text-txatini-green"
            >
              Confirmar pelo WhatsApp em vez disso
            </button>
          )}
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // Formulário principal
  // ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !phone.trim() || !location.trim()) {
      setErrorMsg('Preenche o nome, telefone e localização.');
      return;
    }

    if (paymentMethod === 'mpesa' && !mpesaNumber.trim()) {
      setErrorMsg('Indica o número M-Pesa para receber o pedido de pagamento.');
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

      // 1. Criar pedido no Supabase
      const orderRes = await fetch('/api/create-order', {
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

      if (!orderRes.ok) {
        const d = await orderRes.json().catch(() => ({}));
        throw new Error(d.error || 'Não foi possível criar o pedido.');
      }

      const { order } = await orderRes.json();
      setOrderId(order.id);

      if (paymentMethod === 'mpesa') {
        // 2. Iniciar pagamento M-Pesa
        setSubmitting(false);
        setStep('mpesa_waiting');

        const mpesaRes = await fetch('/api/mpesa-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            amount: totalPrice,
            customerMsisdn: mpesaNumber.trim(),
            orderReference: order.id.slice(0, 8).toUpperCase(),
          }),
        });

        const mpesaData = await mpesaRes.json();

        if (mpesaData.success) {
          clearCart();
          clearAffiliateCode();
          setMpesaMessage(mpesaData.message || 'O teu pagamento foi confirmado. Obrigado!');
          setStep('mpesa_success');
        } else {
          setMpesaMessage(mpesaData.error || 'O pagamento não foi processado.');
          setStep('mpesa_failed');
        }
      } else {
        // WhatsApp
        clearCart();
        clearAffiliateCode();
        const msg = buildOrderMessage({
          name: name.trim(), phone: phone.trim(), location: location.trim(),
          deliveryType, items, total: totalPrice,
        });
        window.open(buildWhatsAppLink(msg), '_blank', 'noopener,noreferrer');
        router.push('/pedido-sucesso');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro inesperado. Tenta novamente.');
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-6 pb-10">
      <h1 className="mb-4 text-xl font-extrabold text-txatini-green">Checkout</h1>

      {/* Resumo */}
      <div className="mb-5 flex items-center justify-between rounded-xl bg-txatini-surface p-4">
        <span className="text-sm text-txatini-muted">
          {items.length} {items.length === 1 ? 'produto' : 'produtos'}
        </span>
        <span className="text-lg font-extrabold text-txatini-green">{totalPrice} MZN</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">Nome</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="O teu nome"
            className="w-full rounded-lg border border-txatini-green/20 bg-txatini-surface px-4 py-3 text-sm outline-none focus:border-txatini-orange" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">Telefone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="84xxxxxxx"
            className="w-full rounded-lg border border-txatini-green/20 bg-txatini-surface px-4 py-3 text-sm outline-none focus:border-txatini-orange" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">Bairro / Localização</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
            placeholder="Ex: Bairro Central, Maputo"
            className="w-full rounded-lg border border-txatini-green/20 bg-txatini-surface px-4 py-3 text-sm outline-none focus:border-txatini-orange" />
        </div>

        {/* Entrega */}
        <div>
          <span className="mb-2 block text-sm font-semibold text-txatini-ink">Entrega</span>
          <div className="flex gap-3">
            {(['entrega', 'recolha'] as const).map((tipo) => (
              <button key={tipo} type="button" onClick={() => setDeliveryType(tipo)}
                className={`flex-1 rounded-lg border-2 py-3 text-sm font-bold ${
                  deliveryType === tipo
                    ? 'border-txatini-green bg-txatini-green text-white'
                    : 'border-txatini-green/20 bg-txatini-surface text-txatini-ink'
                }`}>
                {tipo === 'entrega' ? 'Entrega' : 'Recolha'}
              </button>
            ))}
          </div>
        </div>

        {/* Pagamento */}
        <div>
          <span className="mb-2 block text-sm font-semibold text-txatini-ink">Pagamento</span>
          <div className="flex gap-3">
            <button type="button" onClick={() => setPaymentMethod('whatsapp')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-bold ${
                paymentMethod === 'whatsapp'
                  ? 'border-[#25D366] bg-[#25D366] text-white'
                  : 'border-txatini-green/20 bg-txatini-surface text-txatini-ink'
              }`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.41-1.36a9.84 9.84 0 0 0 4.63 1.17h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.83 9.83 0 0 0 12.04 2z" />
              </svg>
              WhatsApp
            </button>
            <button type="button" onClick={() => setPaymentMethod('mpesa')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 py-3 text-sm font-bold ${
                paymentMethod === 'mpesa'
                  ? 'border-[#E2001A] bg-[#E2001A] text-white'
                  : 'border-txatini-green/20 bg-txatini-surface text-txatini-ink'
              }`}>
              💳 M-Pesa
            </button>
          </div>

          {/* Campo M-Pesa */}
          {paymentMethod === 'mpesa' && (
            <div className="mt-3 rounded-xl border border-[#E2001A]/20 bg-red-50 p-4">
              <p className="mb-1 text-xs font-bold text-[#E2001A]">
                Número M-Pesa para receber o pedido de pagamento
              </p>
              <p className="mb-3 text-xs text-txatini-muted">
                Vais receber um popup no telemóvel a pedir confirmação de <strong>{totalPrice} MZN</strong>. Insere o teu PIN para pagar.
              </p>
              <input
                type="tel"
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
                placeholder="258 84 XXX XXXX"
                className="w-full rounded-lg border border-[#E2001A]/30 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#E2001A]"
              />
            </div>
          )}
        </div>

        {errorMsg && (
          <p className="text-sm font-semibold text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`mt-2 rounded-lg py-3.5 text-sm font-bold text-white disabled:opacity-50 ${
            paymentMethod === 'mpesa' ? 'bg-[#E2001A]' : 'bg-txatini-orange'
          }`}
        >
          {submitting
            ? 'A processar…'
            : paymentMethod === 'mpesa'
            ? `Pagar ${totalPrice} MZN por M-Pesa`
            : 'Finalizar pelo WhatsApp'}
        </button>
      </form>
    </div>
  );
}
