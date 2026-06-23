import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-txatini-green/10 bg-txatini-cream py-8 text-center text-sm text-txatini-ink/70">
      <div className="flex justify-center mb-3">
        <Image
          src="/logo.png"
          alt="Txatiní"
          width={80}
          height={28}
          className="object-contain opacity-70"
        />
      </div>
      <p className="mt-1 text-xs">Sabor que lembra casa.</p>
      <p className="mt-2 text-xs">Entregas em Maputo e Moçambique.</p>
      <p className="mt-4 text-xs opacity-60">
        © {new Date().getFullYear()} Txatiní. Todos os direitos reservados.
      </p>
    </footer>
  );
}
