import { LucideIcon } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  price: string | React.ReactNode;
  turnaround: string;
  titleTruncate?: boolean;
  descriptionHighlight?: boolean;
  descriptionTruncate?: boolean;
  href?: string;
}

export function ServiceCard({
  icon: Icon,
  title,
  description,
  price,
  turnaround,
  titleTruncate = true,
  descriptionHighlight = false,
  descriptionTruncate = false,
  href
}: ServiceCardProps) {
  const content = (
    <>
      <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-12 group-hover:bg-primary group-hover:text-white transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col text-left">
        <h3 className={`text-slate-900 dark:text-slate-100 text-base font-bold leading-normal ${titleTruncate ? 'truncate' : ''}`.trim()}>
          {title}
        </h3>
        <p className={`${descriptionHighlight ? 'text-primary' : 'text-slate-500 dark:text-slate-400'} text-xs font-medium ${descriptionTruncate ? 'truncate' : ''}`.trim()}>
          {description}
        </p>
      </div>
      <div className="shrink-0 flex flex-col items-end">
        {typeof price === 'string' ? (
          <span className="text-slate-900 dark:text-slate-100 text-base font-bold">{price}</span>
        ) : (
          price
        )}
        <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 font-bold">
          {turnaround}
        </span>
      </div>
    </>
  );

  const containerClasses = "group flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all active:scale-[0.98]";

  if (href) {
    return (
      <Link href={href} className={containerClasses}>
        {content}
      </Link>
    );
  }

  return (
    <div className={containerClasses}>
      {content}
    </div>
  );
}
