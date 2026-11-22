import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repair Services & Pricing',
  description: 'Upfront console repair pricing in Houston, TX — HDMI, Ethernet and USB port repair, BIOS repair, power supply, disc drive and fan replacement, deep cleaning with liquid metal, and controller stick drift repair for PlayStation 5, PlayStation 4, Xbox Series X|S, and Xbox One. We come to you.',
  keywords: ['Console Repair Houston', 'PS5 HDMI port replacement', 'PS4 HDMI repair Houston', 'Xbox One repair Houston', 'PS5 liquid metal replacement', 'console fan replacement Houston', 'Xbox Series X repair Houston TX', 'Console deep clean Houston', 'PS5 BIOS repair Houston', 'Controller stick drift repair Houston', 'Console repair prices Houston'],
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
