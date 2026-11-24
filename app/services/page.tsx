'use client';

import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Calendar } from 'lucide-react';
import { ServiceCard } from '@/components/ServiceCard';
import { serviceCategories, formatPrice } from '@/lib/services';

// Beta deployment only: the text button opens the online booking page.
const BOOKING_BETA = process.env.NEXT_PUBLIC_BOOKING_BETA === '1';

const FREE_BADGE = (
  <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">FREE</div>
);

export default function Services() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center p-4 md:px-10 lg:px-24 justify-between w-full max-w-7xl mx-auto">
          <Link href="/" className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg md:text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">WE FIX CONSOLES</h2>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 md:p-10 lg:px-24 pb-32 w-full max-w-7xl mx-auto">
        <div className="mb-6 md:mb-10 text-center md:text-left">
          <h1 className="text-slate-900 dark:text-slate-100 text-[32px] md:text-5xl font-extrabold leading-tight tracking-tight">Repair Services</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 md:mt-4 text-sm md:text-lg">Upfront pricing, and we come to you — every repair is done at your door, anywhere in Houston. Diagnostics are always free; all other prices are plus tax.</p>
        </div>

        {serviceCategories.map((category) => (
          <section key={category.id} className="mb-8">
            <h2 className={`text-slate-900 dark:text-slate-100 text-lg md:text-xl font-bold ${category.intro ? 'mb-1 md:mb-2' : 'mb-3 md:mb-4'}`}>{category.title}</h2>
            {category.intro && (
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 md:mb-4">{category.intro}</p>
            )}
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6">
              {category.services.map((service) => (
                <ServiceCard
                  key={service.id}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  price={service.price === 0 ? FREE_BADGE : formatPrice(service.price)}
                  turnaround={service.turnaround}
                  showTax={service.price > 0}
                  titleTruncate={false}
                  descriptionHighlight={service.highlight}
                />
              ))}
            </div>
          </section>
        ))}

        <div className="p-5 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex gap-3 mb-2">
            <ShieldCheck className="icon-pop w-6 h-6 text-primary" />
            <h3 className="text-slate-900 dark:text-slate-100 font-bold">40-Day Warranty</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            All repairs come with a standard 40-day warranty on parts and labor. We use premium quality replacement parts for lasting results.
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 w-full p-4 md:p-8 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pt-12 pointer-events-none z-40 flex justify-center">
        {BOOKING_BETA ? (
          <Link href="/book" className="pointer-events-auto w-full max-w-sm bg-gradient-to-r from-primary via-cyan-400 to-primary animate-gradient-x hover:brightness-110 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-base">
            <Calendar className="w-6 h-6" />
            Book Appointment
          </Link>
        ) : (
          <a href="sms:+13466674364?body=Hi!%20I%20would%20like%20to%20book%20an%20appointment%20for%20a%20console%20repair." className="pointer-events-auto w-full max-w-sm bg-gradient-to-r from-primary via-cyan-400 to-primary animate-gradient-x hover:brightness-110 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-base">
            <Calendar className="w-6 h-6" />
            Book Appointment
          </a>
        )}
      </div>
    </div>
  );
}
