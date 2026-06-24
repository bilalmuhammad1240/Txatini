'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PedidoSucessoContent() {
  const params = useSearchParams();
  const metodo = params.get('metodo');
  const mpesaNum = params.get('mpesa');
  const mpesaNome = params.get('nome');
  const total = params.get('total');
  const isMpesa = metodo === 'mpesa';

  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <p className="text-5xl">{isMpesa ? '📱' : '✅'}</p>
      <h1 className="mt-4 text-xl font-extrabold text-txatini-green">
        {isMpesa ? 'Pedido recebido!' : 'Pedido enviado!'}
      </h1>

      {isMpesa ? (
        <div className="mt-4 text-left">
          <p className="text-center text-sm text-txatini-muted mb-5">
            Para completar a tua encomenda, envia o pagamento por M-Pesa:
          </p>
          <div className="rounded-xl border border-[#E2001A]/20 bg-red-50 p-5">
            <p className="text-xs font-semibold text-[#E2001A] mb-3 uppercase tracking-wide">
              Pagamento M-Pesa
            </p>
            <div className="rounded-lg bg-white p-4 text-center mb-3">
              <p className="text-2xl font-extrabold text-txatini-ink">{mpesaNum}</p>
              <p className="text-sm text-txatini-muted">{decodeURIComponent(mpesaNome || '')}</p>
            </div>
            <p className="text-center text-lg font-extrabold text-txatini-green">
              {total} MZN
            </p>
            <ol className="mt-4 flex flex-col gap-1.5 text-sm text-txatini-ink/80">
              <li>1. Abre o M-Pesa</li>
              <li>2. Enviar Dinheiro → número acima</li>
              <li>3. Valor: <strong>{total} MZN</strong></li>
              <li>4. Guarda o comprovativo</li>
            </ol>
          </div>
          <p className="mt-4 text-center text-xs text-txatini-muted">
            Vamos confirmar o pagamento e contactar-te pelo WhatsApp.
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-txatini-muted">
          Confirma o teu pedido na conversa que abrimos no WhatsApp. Vamos
          responder o mais rápido possível.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/loja"
          className="rounded-lg bg-txatini-orange py-3 text-sm font-bold text-white"
        >
          Continuar a comprar
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-txatini-green/20 bg-txatini-surface py-3 text-sm font-bold text-txatini-green"
        >
          Voltar à Home
        </Link>
      </div>
    </div>
  );
}

export default function PedidoSucessoPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-txatini-muted">A carregar...</div>}>
      <PedidoSucessoContent />
    </Suspense>
  );
}
