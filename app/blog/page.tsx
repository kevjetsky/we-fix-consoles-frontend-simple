import Link from 'next/link';
import { ArrowLeft, Clock, ArrowRight, Facebook, Instagram } from 'lucide-react';

import { articles } from '@/lib/articles';

export const metadata = {
    title: 'Blog',
    description: 'Read the latest guides, repair tips, and news from We-Fix-Consoles.',
};

export default function BlogPage() {
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

            <main className="flex-1 w-full flex flex-col text-left max-w-6xl mx-auto px-5 py-8 md:py-16">
                <div className="mb-10 w-full">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-text-main dark:text-white leading-tight mb-4 tracking-tight">
                        Our Blog
                    </h1>
                    <p className="text-text-muted dark:text-slate-400 text-base md:text-xl leading-relaxed max-w-2xl">
                        Insights, guides, and repair tips straight from our tech bench. Level up your console knowledge today.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-10">
                    {articles.map(article => (
                        <article key={article.id} className="group relative flex flex-col bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all active:scale-[0.98]">
                            <Link href={`/blog/${article.slug}`} className="absolute inset-0 z-10" aria-label={`Read article: ${article.title}`}></Link>
                            <div className={`h-48 w-full bg-gradient-to-br ${article.imageColor} relative border-b border-black/5 dark:border-white/5 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity`}>
                                {/* Optional placeholder icon could go here */}
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{article.category}</span>
                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium gap-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {article.readTime}
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-primary transition-colors">{article.title}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-3">{article.excerpt}</p>

                                <div className="flex items-center text-sm font-semibold text-slate-900 dark:text-slate-200 mt-auto pt-4 border-t border-slate-200 dark:border-slate-700/50">
                                    <span className="flex-1 text-xs text-slate-500 font-medium">{article.date}</span>
                                    <span className="flex items-center gap-1 group-hover:text-primary transition-colors text-primary md:text-slate-400">
                                        Read More <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
            <footer className="w-full py-8 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center mt-auto">
                <div className="flex items-center gap-6 mb-4">
                    <a href="https://facebook.com/we.fix.consoles" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors" aria-label="Facebook">
                        <Facebook className="w-6 h-6" />
                    </a>
                    <a href="https://instagram.com/we.fix.consoles" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors" aria-label="Instagram">
                        <Instagram className="w-6 h-6" />
                    </a>
                    <a href="https://tiktok.com/@we.fix.consoles" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors" aria-label="TikTok">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                        </svg>
                    </a>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    &copy; {new Date().getFullYear()} We-Fix-Consoles. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
