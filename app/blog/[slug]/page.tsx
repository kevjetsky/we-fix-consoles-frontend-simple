import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Facebook, Instagram } from 'lucide-react';
import { articles, getArticleBySlug } from '@/lib/articles';

// Generate static params for all articles setup in the array
export function generateStaticParams() {
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const article = getArticleBySlug(resolvedParams.slug);

    if (!article) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: article.title,
        description: article.excerpt,
        keywords: article.seoKeywords.split(',').map(k => k.trim()),
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            publishedTime: article.date,
        }
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const article = getArticleBySlug(resolvedParams.slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
            <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center p-4 md:px-10 lg:px-24 justify-between w-full max-w-7xl mx-auto">
                    <Link href="/blog" className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h2 className="text-slate-900 dark:text-slate-100 text-lg md:text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-10">WE FIX CONSOLES</h2>
                </div>
            </header>

            <main className="flex-1 w-full flex flex-col items-center px-5 py-8 md:py-16">
                <article className="w-full max-w-3xl">
                    <div className="mb-8 md:mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs uppercase tracking-wider font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">{article.category}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {article.date}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {article.readTime}
                            </div>
                        </div>
                    </div>

                    <div className={`w-full h-48 md:h-80 rounded-3xl bg-gradient-to-br ${article.imageColor} mb-10 md:mb-16 shadow-lg shadow-black/5 flex items-center justify-center`}>
                        {/* Optional featured image would go here */}
                    </div>

                    <div className="prose prose-slate dark:prose-invert prose-lg max-w-none w-full">
                        {article.content.map((paragraph, index) => (
                            <p key={index} className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="mt-12 md:mt-20 p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3">Need a Console Repair?</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Our experts in Houston are ready to help point you in the right direction.</p>
                        <Link href="/services" className="inline-flex h-12 items-center justify-center px-8 bg-gradient-to-r from-primary via-cyan-400 to-primary text-white font-bold rounded-xl active:scale-[0.98] transition-all hover:brightness-110">
                            View Our Services
                        </Link>
                    </div>
                </article>
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
