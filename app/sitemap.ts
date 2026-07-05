import { MetadataRoute } from 'next';
import { articles } from '@/lib/articles';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://we-fix-consoles.com';

    return [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...articles.map((article) => ({
            url: `${baseUrl}/blog/${article.slug}`,
            lastModified: new Date(article.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ];
}
