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
    default: 'We-Fix-Consoles | Mobile Console Repair Service (PS5, PS4, Xbox)',
  },
  description: 'Mobile console repair in Houston, TX — we come to your door. No-fix-no-fee guarantee on PlayStation 5, PlayStation 4, Xbox Series X/S, and Xbox One HDMI ports, liquid metal, and overheating repairs.',
  keywords: ['Console Repair Houston', 'PS5 HDMI port replacement', 'PS4 HDMI repair Houston', 'Xbox Series X repair Houston TX', 'Xbox One repair Houston', 'PS5 liquid metal replacement', 'console fan replacement Houston', 'Console cleaning', 'Mobile gaming repair Houston'],
  authors: [{ name: 'We-Fix-Consoles' }],
  openGraph: {
    title: 'We-Fix-Consoles | We Come to You',
    description: 'We come to you! Fast, reliable PS5, PS4, Xbox Series X/S, and Xbox One repair at your door with a 40-day warranty.',
    url: 'https://we-fix-consoles.com',
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
    image: 'https://we-fix-consoles.com/android-chrome-512x512.png',
    description: 'Mobile console repair service in Houston, TX offering PlayStation 5, PlayStation 4, Xbox Series X/S, and Xbox One repairs directly to your door. Specializing in HDMI port replacements, liquid metal and thermal paste service, and overheating fixes.',
    telephone: '+1-346-667-4364',
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: 'Houston',
      addressRegion: 'TX',
      addressCountry: 'US'
    },
    makesOffer: [
      { name: 'Diagnostic', description: 'Issue identification', price: '0.00' },
      { name: 'HDMI Port Repair', description: 'Standard replacement', price: '99.99' },
      { name: 'HDMI Port Repair (Advanced)', description: 'Trace/pads repair included', price: '119.99' },
      { name: 'Ethernet Port Repair', description: 'LAN port replacement', price: '99.99' },
      { name: 'USB Port Repair', description: 'Port replacement', price: '99.99' },
      { name: 'Power Supply Replacement', description: 'Full unit replacement', price: '119.99' },
      { name: 'Disk Drive Replacement', description: 'Disc drive swap', price: '95.00' },
      { name: 'Fan Replacement', description: 'Cooling fan swap', price: '79.99' },
      { name: 'Liquid Metal Replacement', description: 'PS5 / Xbox Series X — includes fan and heatsink cleaning', price: '99.99' },
      { name: 'Thermal Paste Replacement', description: 'PS4 / Xbox One — includes fan and heatsink cleaning', price: '79.99' },
      { name: 'Full Deep Clean', description: 'Complete teardown and internal cleaning, no thermal service', price: '69.99' },
      { name: 'Liquid Metal + Full Deep Clean', description: 'PS5 / Xbox Series X', price: '139.99' },
      { name: 'Thermal Paste + Full Deep Clean', description: 'PS4 / Xbox One', price: '119.99' },
      { name: 'Quick Vent Blowout', description: 'External dust removal', price: '29.99' },
      { name: 'Controller Refresh', description: 'Both sticks replaced + full cleaning', price: '45.00' },
      { name: 'HDMI Cable', description: 'High-speed 4K HDMI cable', price: '10.00' },
    ].map((offer) => ({
      '@type': 'Offer',
      name: offer.name,
      description: offer.description,
      price: offer.price,
      priceCurrency: 'USD',
      itemOffered: { '@type': 'Service', name: offer.name, description: offer.description },
    })),
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
