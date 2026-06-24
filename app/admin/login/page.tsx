'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError('Email ou palavra-passe incorretos.');
      return;
    }

    router.push('/admin');
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-10">
      <h1 className="mb-1 text-xl font-extrabold text-txatini-green">
        Txatiní Admin
      </h1>
      <p className="mb-6 text-sm text-txatini-muted">
        Acesso restrito à equipa.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-txatini-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-txatini-orange"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-txatini-ink">
            Palavra-passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-txatini-green/20 bg-white px-4 py-3 text-sm outline-none focus:border-txatini-orange"
          />
        </div>

        {error && (
          <p className="text-sm font-semibold text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-lg bg-txatini-green py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {loading ? 'A entrar...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
