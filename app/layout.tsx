import type { Metadata } from 'next';
import { Fredoka } from 'next/font/google';
import './globals.css'; // Global styles

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
});

export const metadata: Metadata = {
  title: 'We-Fix-Consoles',
  description: 'Expert console repair services',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fredoka.variable} suppressHydrationWarning>
      <body className="bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display antialiased overflow-x-hidden min-h-[100dvh]" suppressHydrationWarning>
        <div className="relative flex flex-col min-h-screen w-full bg-white dark:bg-slate-900 overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
