import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import '@/styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import AffiliateTracker from '@/components/AffiliateTracker';

export const metadata: Metadata = {
  title: 'Txatiní — Sabor que lembra casa',
  description:
    'Temperos para comida de casa. Sabor garantido, sem complicação. Entregas em Maputo e Moçambique.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1A4230',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body className="flex min-h-screen flex-col bg-txatini-cream font-sans text-txatini-ink antialiased">
        <Suspense fallback={null}>
          <AffiliateTracker />
        </Suspense>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
