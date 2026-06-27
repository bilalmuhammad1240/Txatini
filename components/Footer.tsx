export default function Footer() {
  return (
    <footer className="border-t border-txatini-green/10 bg-txatini-cream py-8 text-center">
      <p className="text-sm font-extrabold text-txatini-green">TXATINÍ</p>
      <p className="mt-1 text-xs text-txatini-muted">Sabor que lembra casa.</p>
      <p className="mt-4 text-xs text-txatini-muted">
        © {new Date().getFullYear()} Txatiní. Todos os direitos reservados.
      </p>
    </footer>
  );
}
