import type { Metadata } from 'next';
import { Fredoka } from 'next/font/google';
import './globals.css'; // Global styles
import './motions.css';
import { GoogleAnalytics } from '@next/third-parties/google';
import { MotionObserver } from '@/components/MotionObserver';
import { allServices } from '@/lib/services';
import { LeadCapture } from '@/components/booking/LeadCapture';

// Turns animations on before first paint unless the visitor prefers reduced motion.
// If the app script never boots, the class is removed so nothing stays hidden.
const MOTION_BOOT = `(function(){try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('motion');setTimeout(function(){if(!window.__wfcMotion)d.classList.remove('motion')},4000)}catch(e){}})();`;

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
});

export const metadata: Metadata = {
  title: {
    template: '%s | We-Fix-Consoles',
    default: 'We-Fix-Consoles | Mobile Console Repair Service (PS5, PS4, Xbox)',
  },
  description: 'Mobile console repair in Houston, TX — we come to your door. No-fix-no-fee guarantee on PlayStation 5, PlayStation 4, Xbox Series X/S, and Xbox One HDMI ports, thermal service, and overheating repairs.',
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
    description: 'Mobile console repair service in Houston, TX offering PlayStation 5, PlayStation 4, Xbox Series X/S, and Xbox One repairs directly to your door. Specializing in HDMI port replacements, thermal service, and overheating fixes.',
    telephone: '+1-346-667-4364',
    priceRange: '$$',
    areaServed: {
      '@type': 'City',
      name: 'Houston',
      addressRegion: 'TX',
      addressCountry: 'US'
    },
    makesOffer: allServices.map((offer) => ({
      '@type': 'Offer',
      name: offer.title,
      description: offer.description,
      price: offer.price.toFixed(2),
      priceCurrency: 'USD',
      itemOffered: { '@type': 'Service', name: offer.title, description: offer.description },
    })),
  };

  return (
    <html lang="en" className={fredoka.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display antialiased overflow-x-hidden min-h-[100dvh]" suppressHydrationWarning>

        <div className="relative flex flex-col min-h-screen w-full bg-white dark:bg-slate-900 overflow-hidden">
          {children}
        </div>
        <MotionObserver />
        {process.env.NEXT_PUBLIC_BOOKING_API && <LeadCapture />}
        <GoogleAnalytics gaId="G-XCPXYK6RD2" />
      </body>
    </html>
  );
}
