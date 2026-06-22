import Link from 'next/link';

export default function RevendedorSucessoPage() {
  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <p className="text-5xl">🎉</p>
      <h1 className="mt-4 text-xl font-extrabold text-txatini-green">
        Pedido enviado!
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-txatini-ink/70">
        Recebemos o teu pedido para te tornares revendedor Txatiní. Vamos
        analisar e entrar em contacto via WhatsApp em até 24 horas com o
        teu link pessoal.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg bg-txatini-orange px-6 py-3 text-sm font-bold text-white"
      >
        Voltar à loja
      </Link>
    </div>
  );
}
