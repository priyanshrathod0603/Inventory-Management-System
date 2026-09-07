import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Inventory Management System',
  description: 'Production-grade retail POS and inventory management system',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FCF9F6] text-[#111722] font-sans antialiased selection:bg-[#FFE3DA] selection:text-[#7F240A]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
