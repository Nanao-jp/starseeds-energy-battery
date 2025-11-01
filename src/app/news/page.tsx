import Link from "next/link";
import { newsArticles } from "@/data/news";
import { getCategoryLabel } from "@/lib/helpers";
import { PageHeader } from '@/components/layout/PageLayout';

export default function NewsPage() {
  return (
    <div>
      <PageHeader title="ニュース" subtitle="最新のお知らせ一覧" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8 max-w-4xl mx-auto">
          {newsArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(article => (
            <Link key={article.id} href={`/news/${article.slug}`} className="block border-b pb-8 group">
              <div className="flex items-baseline gap-4">
                <p className="text-gray-500 dark:text-muted-foreground">{article.date}</p>
                <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                  article.category === 'press-release' ? 'bg-blue-100 dark:bg-primary/20 text-blue-700 dark:text-primary' :
                  article.category === 'event' ? 'bg-purple-100 dark:bg-accent/20 text-purple-700 dark:text-accent' :
                  'bg-gray-100 dark:bg-muted text-gray-700 dark:text-muted-foreground'
                }`}>
                  {getCategoryLabel(article.category)}
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-bold group-hover:text-green-600 dark:group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-muted-foreground">
                {article.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
