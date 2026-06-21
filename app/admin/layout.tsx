import AdminNav from './AdminNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row">
      <AdminNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}
