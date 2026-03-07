'use client';

import Link from 'next/link';
import { ArrowLeft, Stethoscope, Cable, Cpu, Wind, Fan, Gamepad2, Joystick, ShieldCheck, Calendar } from 'lucide-react';

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
          <p className="text-slate-500 dark:text-slate-400 mt-2 md:mt-4 text-sm md:text-lg">Transparent pricing for expert console repairs. Select a service to get started.</p>
        </div>

        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 lg:gap-6">
          <div className="group flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-12 group-hover:bg-primary group-hover:text-white transition-colors">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal truncate">Diagnostic</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Issue identification</p>
            </div>
            <div className="shrink-0 flex flex-col items-end">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                FREE
              </div>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 font-bold">Same Day</span>
            </div>
          </div>

          <div className="group flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-12 group-hover:bg-primary group-hover:text-white transition-colors">
              <Cable className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal truncate">HDMI Port Repair</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Standard replacement</p>
            </div>
            <div className="shrink-0 flex flex-col items-end">
              <p className="text-slate-900 dark:text-slate-100 text-base font-bold">$95.00</p>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 font-bold">Same Day</span>
            </div>
          </div>

          <div className="group flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-12 group-hover:bg-primary group-hover:text-white transition-colors">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal truncate">HDMI Port Repair (Advanced)</h3>
              <p className="text-primary text-xs font-medium">Trace/pads repair included</p>
            </div>
            <div className="shrink-0 flex flex-col items-end">
              <p className="text-slate-900 dark:text-slate-100 text-base font-bold">$120.00</p>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 font-bold">1-2 Days</span>
            </div>
          </div>

          <div className="group flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-12 group-hover:bg-primary group-hover:text-white transition-colors">
              <Wind className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal truncate">Dust Removal</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Internal air cleaning</p>
            </div>
            <div className="shrink-0 flex flex-col items-end">
              <p className="text-slate-900 dark:text-slate-100 text-base font-bold">$19.99</p>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 font-bold">Same Day</span>
            </div>
          </div>

          <div className="group flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-12 group-hover:bg-primary group-hover:text-white transition-colors">
              <Fan className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal">Deep Clean + Thermal Paste</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Liquid Metal Application</p>
            </div>
            <div className="shrink-0 flex flex-col items-end">
              <p className="text-slate-900 dark:text-slate-100 text-base font-bold">$69.99</p>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 font-bold">Same Day</span>
            </div>
          </div>

          <div className="group flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-12 group-hover:bg-primary group-hover:text-white transition-colors">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal truncate">Stick Drift Repair</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Single analog stick</p>
            </div>
            <div className="shrink-0 flex flex-col items-end">
              <p className="text-slate-900 dark:text-slate-100 text-base font-bold">$19.99</p>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 font-bold">Same Day</span>
            </div>
          </div>

          <div className="group flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]">
            <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-12 group-hover:bg-primary group-hover:text-white transition-colors">
              <Joystick className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-900 dark:text-slate-100 text-base font-bold leading-normal">Full Controller Refresh</h3>
              <p className="text-primary text-xs font-medium">Both sticks + cleaning</p>
            </div>
            <div className="shrink-0 flex flex-col items-end">
              <p className="text-slate-900 dark:text-slate-100 text-base font-bold">$35.00</p>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 font-bold">Same Day</span>
            </div>
          </div>
        </div>

        <div className="mt-8 p-5 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex gap-3 mb-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <h3 className="text-slate-900 dark:text-slate-100 font-bold">90-Day Warranty</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            All repairs come with a standard 90-day warranty on parts and labor. We use premium quality replacement parts for lasting results.
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 w-full p-4 md:p-8 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pt-12 pointer-events-none z-40 flex justify-center">
        <a href="sms:+15055243280?body=Hi!%20I%20would%20like%20to%20book%20an%20appointment%20for%20a%20console%20repair." className="pointer-events-auto w-full max-w-sm bg-gradient-to-r from-primary via-cyan-400 to-primary animate-gradient-x hover:brightness-110 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-base">
          <Calendar className="w-6 h-6" />
          Book Appointment
        </a>
      </div>
    </div>
  );
}
