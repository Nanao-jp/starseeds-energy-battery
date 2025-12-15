import type { NewsArticle } from '@/data/types';

export const getCategoryLabel = (category: NewsArticle['category']) => {
  switch (category) {
    case 'press-release': return 'プレスリリース';
    case 'event': return 'イベント';
    case 'update': return 'お知らせ';
  }
};
