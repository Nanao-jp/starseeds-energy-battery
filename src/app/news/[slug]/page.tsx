import { newsArticles } from "@/data/news";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import { getCategoryLabel } from "@/lib/helpers";

export async function generateStaticParams() {
  return newsArticles.map((article) => ({
    slug: article.slug,
  }));
}

// type NewsArticlePageProps = {
//   params: {
//     slug: string;
//   }
// };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NewsArticlePage({ params }: { params: any }) {
  const article = newsArticles.find(a => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <article className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <p className="text-gray-500">{article.date}</p>
            <span className={`text-sm font-bold px-2 py-1 rounded-full ${
              article.category === 'press-release' ? 'bg-blue-100 text-blue-700' :
              article.category === 'event' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {getCategoryLabel(article.category)}
            </span>
          </div>
          <h1 className="text-4xl font-bold">{article.title}</h1>
        </div>
        
        <div className="prose lg:prose-xl max-w-none">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

// Helper function to be moved to a shared file or defined in the parent page and exported
// export const getCategoryLabel = (category: 'press-release' | 'event' | 'update') => { ... };
