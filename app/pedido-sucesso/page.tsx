import Link from 'next/link';

export default function PedidoSucessoPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl">✅</p>
      <h1 className="mt-4 text-xl font-extrabold text-txatini-green">
        Pedido recebido!
      </h1>
      <p className="mt-2 text-sm text-txatini-ink/70">
        Confirma o teu pedido na conversa que abrimos no WhatsApp. Vamos
        responder o mais rápido possível.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/loja"
          className="rounded-lg bg-txatini-orange py-3 text-sm font-bold text-white"
        >
          Voltar à loja
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-txatini-green/20 bg-white py-3 text-sm font-bold text-txatini-green"
        >
          Ir para a Home
        </Link>
      </div>
    </div>
  );
}
