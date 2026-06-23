'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/produtos', label: 'Produtos' },
  { href: '/admin/pedidos', label: 'Pedidos' },
  { href: '/admin/revendedores', label: 'Revendedores' },
  { href: '/admin/configuracoes', label: 'Configurações' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return null;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <nav className="flex shrink-0 flex-row gap-2 overflow-x-auto sm:w-48 sm:flex-col sm:overflow-visible">
      <div className="mb-2 hidden text-sm font-extrabold text-txatini-green sm:block">
        TXATINÍ ADMIN
      </div>
      {LINKS.map((link) => {
        const isActive =
          link.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold ${
              isActive
                ? 'bg-txatini-green text-white'
                : 'bg-white text-txatini-ink border border-txatini-green/10'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="shrink-0 rounded-xl border border-txatini-green/10 bg-white px-4 py-2 text-left text-sm font-semibold text-red-600"
      >
        Sair
      </button>
    </nav>
  );
}
