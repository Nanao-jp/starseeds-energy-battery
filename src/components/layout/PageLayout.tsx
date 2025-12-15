import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

/**
 * ページヘッダー（タイトル・サブタイトル）
 */
export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={cn(
      'text-center py-16',
      className
    )}>
      <h1 className="text-4xl font-bold tracking-tight font-heading">{title}</h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-muted-foreground">{subtitle}</p>
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

/**
 * セクションコンテナ
 */
export function Section({ children, id, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'container mx-auto px-4 sm:px-6 lg:px-8 py-16',
        className
      )}
    >
      {children}
    </section>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * セクションタイトル
 */
export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <div className={cn('text-center mb-12', className)}>
      <h2 className="text-3xl font-bold tracking-tight font-heading">{children}</h2>
    </div>
  );
}

