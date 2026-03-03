import type { Metadata } from 'next';
import './globals.css';
import ServiceWorkerRegisterer from '../components/ServiceWorkerRegisterer';
...
<ServiceWorkerRegisterer />

export const metadata: Metadata = {
  title: 'The Femme Reset App',
  description: 'Herramientas simples: Sueño reparador y Reset cortisol.',
  manifest: '/manifest.webmanifest',
  themeColor: '#0b1220',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Femme Reset' },
  icons: { icon: [{ url: '/icon-192.png' }], apple: [{ url: '/apple-touch-icon.png' }] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ServiceWorkerRegisterer />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
