import { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  py?: 'sm' | 'md' | 'lg';
  withDivider?: boolean;
  dividerClassName?: string;
}

/**
 * SectionContainer Component
 * セクション全体で使用する共通コンテナコンポーネント
 * 
 * 特徴:
 * - 統一されたパディングとマージン
 * - レスポンシブ対応
 * - section-dividerのオプション統合
 */
export function SectionContainer({ 
  children, 
  className = '', 
  py = 'md',
  withDivider = false,
  dividerClassName = '',
}: SectionContainerProps) {
  const pyClass = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20',
  }[py];

  return (
    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${pyClass} ${className}`}>
      {withDivider && (
        <div className={`section-divider ${dividerClassName}`} aria-hidden="true" />
      )}
      {children}
    </div>
  );
}

