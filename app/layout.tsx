import type { Metadata } from 'next';
import { Fredoka } from 'next/font/google';
import './globals.css'; // Global styles
import { GoogleAnalytics } from '@next/third-parties/google';

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
});

export const metadata: Metadata = {
  title: {
    template: '%s | We-Fix-Consoles',
    default: 'We-Fix-Consoles | Mobile Console Repair Service (PS5, Xbox, Switch)',
  },
  description: 'Expert mobile console repair in Houston, TX with no-fix-no-fee guarantee. We fix PlayStation 5 (PS5), Xbox Series X, and Nintendo Switch HDMI ports, stick drift, and overheating.',
  keywords: ['Console Repair Houston', 'PS5 HDMI port replacement', 'Xbox Series X repair Houston TX', 'Nintendo Switch stick drift fix', 'Console cleaning', 'Mobile gaming repair Houston'],
  authors: [{ name: 'We-Fix-Consoles' }],
  openGraph: {
    title: 'We-Fix-Consoles | Expert Mobile Repair',
    description: 'We come to you! Fast, reliable PS5, Xbox, and Switch repair with a 90-day warranty.',
    url: 'https://wefixconsoles.com',
    siteName: 'We-Fix-Consoles',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'We-Fix-Consoles',
    image: 'https://wefixconsoles.com/android-chrome-512x512.png',
    description: 'Mobile console repair service in Houston, TX offering PlayStation 5, Xbox Series X, and Nintendo Switch repairs directly to your door. Specializing in HDMI port replacements, overheating fixes, and stick drift.',
    telephone: '+1-505-524-3280',
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: 'Houston',
      addressRegion: 'TX',
      addressCountry: 'US'
    },
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'HDMI Port Replacement (PS5 & Xbox Series X)' },
        priceSpecification: { '@type': 'PriceSpecification', price: '95.00', priceCurrency: 'USD' }
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Console Deep Cleaning & Thermal Paste' },
        priceSpecification: { '@type': 'PriceSpecification', price: '69.99', priceCurrency: 'USD' }
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Full Controller Refresh & Stick Drift Repair' },
        priceSpecification: { '@type': 'PriceSpecification', price: '35.00', priceCurrency: 'USD' }
      }
    ]
  };

  return (
    <html lang="en" className={fredoka.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display antialiased overflow-x-hidden min-h-[100dvh]" suppressHydrationWarning>

        <div className="relative flex flex-col min-h-screen w-full bg-white dark:bg-slate-900 overflow-hidden">
          {children}
        </div>
        <GoogleAnalytics gaId="G-XCPXYK6RD2" />
      </body>
    </html>
  );
}
