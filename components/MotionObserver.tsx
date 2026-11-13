'use client';

import {usePathname} from 'next/navigation';
import {useEffect} from 'react';

/**
 * Icon motions (see app/motions.css):
 * - pops `.icon-pop` icons as they scroll into view
 * - on touch screens, makes a tapped card's `.icon-jump` icon do one jump
 */
export function MotionObserver() {
  const pathname = usePathname();

  useEffect(() => {
    (window as Window & {__wfcMotion?: boolean}).__wfcMotion = true;
  }, []);

  useEffect(() => {
    if (!document.documentElement.classList.contains('motion')) return;

    const observer = new IntersectionObserver(
      entries => {
        let batchIndex = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.setProperty('--pop-delay', `${Math.min(batchIndex, 4) * 40}ms`);
          el.classList.add('is-in');
          observer.unobserve(el);
          batchIndex++;
        }
      },
      {threshold: 0.5},
    );
    document.querySelectorAll('.icon-pop:not(.is-in)').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!document.documentElement.classList.contains('motion')) return;

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') return;
      const icon = (event.target as Element | null)?.closest('.group')?.querySelector('.icon-jump');
      if (!icon) return;
      icon.classList.remove('is-jumping');
      void (icon as HTMLElement).offsetWidth; // restart the animation on repeated taps
      icon.classList.add('is-jumping');
      icon.addEventListener('animationend', () => icon.classList.remove('is-jumping'), {once: true});
    };
    document.addEventListener('pointerdown', onPointerDown, {passive: true});
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return null;
}
