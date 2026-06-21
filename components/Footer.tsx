export default function Footer() {
  return (
    <footer className="border-t border-txatini-green/10 bg-txatini-cream py-8 text-center text-sm text-txatini-ink/70">
      <p className="font-semibold text-txatini-green">TXATINÍ</p>
      <p className="mt-1">Sabor que lembra casa.</p>
      <p className="mt-3">Entregas em Maputo e Moçambique.</p>
      <p className="mt-4 text-xs">
        © {new Date().getFullYear()} Txatiní. Todos os direitos reservados.
      </p>
    </footer>
  );
}
