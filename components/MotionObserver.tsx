'use client';

import {usePathname} from 'next/navigation';
import {useEffect} from 'react';

/** Adds `.is-in` (with a staggered `--reveal-delay`) to `[data-reveal]` elements as they scroll into view. */
export function MotionObserver() {
  const pathname = usePathname();

  useEffect(() => {
    (window as Window & {__wfcMotion?: boolean}).__wfcMotion = true;
    if (!document.documentElement.classList.contains('motion')) return;

    const observer = new IntersectionObserver(
      entries => {
        let batchIndex = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.setProperty('--reveal-delay', `${batchIndex * 90}ms`);
          el.classList.add('is-in');
          observer.unobserve(el);
          batchIndex++;
        }
      },
      {rootMargin: '0px 0px -8% 0px', threshold: 0.15},
    );

    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
