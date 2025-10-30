import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppLayout } from '@/components/layout/app-layout';
import { IncidentsProvider } from '@/context/incidents-context';

export const metadata: Metadata = {
  title: 'SecureFlow AI',
  description: 'An intelligent multi-agent system for cybersecurity threat detection.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <IncidentsProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </IncidentsProvider>
        <Toaster />
      </body>
    </html>
  );
}
