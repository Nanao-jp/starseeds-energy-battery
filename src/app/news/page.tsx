import Link from "next/link";
import { newsArticles } from "@/data/news";
import { getCategoryLabel } from "@/lib/helpers";

const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center py-16 bg-gray-50">
    <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
    <p className="mt-4 text-xl text-gray-600">{subtitle}</p>
  </div>
);

export default function NewsPage() {
  return (
    <div>
      <PageHeader title="ニュース" subtitle="最新のお知らせ一覧" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8 max-w-4xl mx-auto">
          {newsArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(article => (
            <Link key={article.id} href={`/news/${article.slug}`} className="block border-b pb-8 group">
              <div className="flex items-baseline gap-4">
                <p className="text-gray-500">{article.date}</p>
                <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                  article.category === 'press-release' ? 'bg-blue-100 text-blue-700' :
                  article.category === 'event' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {getCategoryLabel(article.category)}
                </span>
              </div>
              <h2 className="mt-2 text-2xl font-bold group-hover:text-green-600 transition-colors">
                {article.title}
              </h2>
              <p className="mt-2 text-gray-600">
                {article.summary}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
