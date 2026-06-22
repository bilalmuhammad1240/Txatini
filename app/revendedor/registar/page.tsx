'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function gerarCodigo(nome: string): string {
  const base = nome
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^A-Z0-9]/g, '')       // só letras e números
    .slice(0, 6);
  const sufixo = Math.floor(Math.random() * 90 + 10); // 2 dígitos
  return `${base}${sufixo}`;
}

export default function RegistarRevendedorPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError('Preenche o nome e o telefone.');
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    // Gera código único — tenta até encontrar um que não existe
    let code = '';
    let attempts = 0;
    while (attempts < 5) {
      const candidate = gerarCodigo(name);
      const { data } = await supabase
        .from('affiliates')
        .select('code')
        .eq('code', candidate)
        .single();

      if (!data) {
        code = candidate;
        break;
      }
      attempts++;
    }

    if (!code) {
      setError('Não foi possível gerar um código único. Tenta novamente.');
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from('affiliates').insert({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || null,
      code,
      status: 'pendente',
    });

    setSubmitting(false);

    if (insertError) {
      setError('Não foi possível enviar o pedido. Tenta novamente.');
      return;
    }

    router.push('/revendedor/sucesso');
  };

  return (
    <div className="mx-auto max-w-md px-5 py-10">
      <h1 className="mb-1 text-xl font-extrabold text-txatini-green">
        Torna-te revendedor
      </h1>
      <p className="mb-6 text-sm leading-relaxed text-txatini-ink/70">
        Partilha o teu link pessoal e ganha comissão em cada venda que
        gerares. Gratuito e sem compromisso.
      </p>

      <div className="mb-6 rounded-xl bg-txatini-green/8 p-4">
        <p className="text-sm font-semibold text-txatini-green">
          Como funciona?
        </p>
        <ol className="mt-2 flex flex-col gap-1 text-sm text-txatini-ink/80">
          <li>1. Preenche o formulário abaixo</li>
          <li>2. Aprovamos o teu pedido (normalmente em 24h)</li>
          <li>3. Recebes o teu link pessoal Txatiní</li>
          <li>4. Partilhas com amigos, família, grupos</li>
          <li>5. Ganhas comissão em cada compra feita pelo teu link</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">
            Nome completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="O teu nome"
            className="w-full rounded-lg border border-txatini-green/20 bg-txatini-surface px-4 py-3 text-sm outline-none focus:border-txatini-orange"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">
            Telefone (WhatsApp)
          </label>
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
            Email <span className="font-normal text-txatini-ink/50">(opcional)</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className="w-full rounded-lg border border-txatini-green/20 bg-txatini-surface px-4 py-3 text-sm outline-none focus:border-txatini-orange"
          />
        </div>

        {error && (
          <p className="text-sm font-semibold text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-lg bg-txatini-orange py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {submitting ? 'A enviar...' : 'Enviar pedido'}
        </button>
      </form>
    </div>
  );
}
