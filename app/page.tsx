'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageSquare, ShieldCheck, Truck, Banknote, Phone, Cable, Fan, Joystick } from 'lucide-react';


export default function Home() {
  return (
    <>
      <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide flex flex-col items-center w-full">
        <section className="px-5 pt-8 md:pt-20 pb-10 flex flex-col items-center text-center w-full max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-text-main dark:text-white leading-tight mb-4 tracking-tight pt-4">
            We Fix Consoles.<br />
            <span className="text-primary">Fast &amp; Reliable.</span>
          </h2>
          <p className="text-text-muted dark:text-slate-400 text-base md:text-xl leading-relaxed max-w-[320px] md:max-w-xl mb-8">
            Expert repairs with a 90-day warranty. Free mobile service directly to you. No repair, no fee guarantee.
          </p>
          <div className="flex flex-col md:flex-row w-full max-w-sm md:max-w-2xl gap-3 md:gap-6 justify-center">
            <Link href="/services" className="w-full h-14 bg-gradient-to-r from-primary via-cyan-400 to-primary animate-gradient-x hover:brightness-110 active:scale-[0.98] transition-all text-white rounded-xl font-bold text-base shadow-lg shadow-primary/25 flex items-center justify-center gap-2">
              View Services
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="sms:+15055243280" className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all text-text-main dark:text-white rounded-xl font-bold text-base flex items-center justify-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Get SMS Quote
            </a>
          </div>
        </section>

        <section className="px-5 py-6 md:py-10 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-text-main dark:text-white">90-Day Warranty</h3>
                <p className="text-xs text-text-muted dark:text-slate-400 mt-1">Peace of mind included.</p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-text-main dark:text-white">We Come to You</h3>
                <p className="text-xs text-text-muted dark:text-slate-400 mt-1">Free mobile service.</p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-start gap-3 col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Banknote className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-main dark:text-white">No Repair, No Fee</h3>
              </div>
              <p className="text-sm text-text-muted dark:text-slate-400">If we can&apos;t fix your console, you don&apos;t pay a single cent. It&apos;s our promise to you.</p>
            </div>
          </div>
        </section>

        <section className="px-5 py-6 md:py-10 w-full max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 md:mb-8">
            <h3 className="text-lg md:text-2xl font-bold text-text-main dark:text-white">Popular Repairs</h3>
            <Link href="/services" className="text-primary text-sm md:text-base font-semibold hover:text-primary-dark">View all</Link>
          </div>
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6">
            <Link href="/services" className="group flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]">
              <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-12 group-hover:bg-primary group-hover:text-white transition-colors">
                <Cable className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col text-left">
                <h4 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal truncate">HDMI Port Replacement</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">PS5, Xbox Series X</p>
              </div>
              <div className="shrink-0 flex flex-col items-end">
                <span className="text-slate-900 dark:text-slate-100 text-base font-bold">$95.00</span>
                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 font-bold">Same Day</span>
              </div>
            </Link>

            <Link href="/services" className="group flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]">
              <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-12 group-hover:bg-primary group-hover:text-white transition-colors">
                <Fan className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col text-left">
                <h4 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal truncate">Deep Cleaning</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Deep cleaning &amp; Thermal paste</p>
              </div>
              <div className="shrink-0 flex flex-col items-end">
                <span className="text-slate-900 dark:text-slate-100 text-base font-bold">$69.99</span>
                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 font-bold">Same Day</span>
              </div>
            </Link>

            <Link href="/services" className="group flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]">
              <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-12 group-hover:bg-primary group-hover:text-white transition-colors">
                <Joystick className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col text-left">
                <h4 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal truncate">Full Controller Refresh</h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Both sticks + cleaning</p>
              </div>
              <div className="shrink-0 flex flex-col items-end">
                <span className="text-slate-900 dark:text-slate-100 text-base font-bold">$35.00</span>
                <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 font-bold">Same Day</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="px-5 py-6 mb-4 md:py-12 w-full max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 md:p-12 text-white text-center shadow-lg shadow-blue-500/20">
            <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-4">Unsure what&apos;s wrong?</h3>
            <p className="text-blue-100 text-sm md:text-lg mb-6 md:mb-8 max-w-xl mx-auto">Our experts can diagnose your console issues quickly.</p>
            <a href="tel:+15055243280" className="w-full md:w-auto md:px-12 h-12 md:h-14 bg-white text-primary font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors mx-auto text-base">
              <Phone className="w-5 h-5" />
              Call for Free Advice
            </a>
          </div>
        </section>
      </main>
      <footer className="w-full py-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center mt-auto">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} We-Fix-Consoles. All rights reserved.
        </p>
      </footer>
    </>);
}
