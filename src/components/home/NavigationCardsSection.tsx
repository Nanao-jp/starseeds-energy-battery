"use client";

import { BookOpen } from 'lucide-react';
import dynamic from 'next/dynamic';
import { HOME_NAVIGATION_CARDS } from '@/lib/constants';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { PRIMARY_COLOR } from '@/lib/theme';

// NavigationCardを動的インポート
const NavigationCard = dynamic(() => import('./NavigationCard').then(mod => ({ default: mod.NavigationCard })), {
  ssr: true,
});

/**
 * NavigationCardsSection Component
 * 「さらに詳しく」セクションコンポーネント
 * 
 * 特徴:
 * - リッチなセクションタイトル
 * - データ駆動型の設計
 * - スムーズなアニメーション
 * - 保守性と拡張性を重視
 */
export function NavigationCardsSection() {
  return (
    <section 
      aria-label="さらに詳しく"
    >
      <SectionContainer py="md" withDivider dividerClassName="mb-16">

      {/* リッチなセクションタイトル */}
      <div className="relative text-center mb-16">
        {/* 装飾的な背景パターン */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, ${PRIMARY_COLOR.glow.light} 0%, transparent 50%),
              ${PRIMARY_COLOR.pattern.light}
            `,
            backgroundSize: '100% 100%, 20px 20px',
          }}
        />

        {/* アイコン装飾 */}
        <div className="relative inline-flex items-center gap-3 mb-6">
          <div className="relative">
            <BookOpen className="h-10 w-10 text-primary" style={{ filter: `drop-shadow(0 0 12px ${PRIMARY_COLOR.glow.intense})` }} />
            {/* アイコンのグロー効果 */}
            <div 
              className="absolute inset-0 rounded-full blur-2xl -z-10 opacity-50"
              style={{
                background: `radial-gradient(circle, ${PRIMARY_COLOR.glow.medium}, transparent 70%)`
              }}
            />
          </div>
        </div>

        {/* タイトル */}
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight font-heading text-foreground relative inline-block mb-4">
          <span className="relative">
            さらに詳しく
            {/* タイトルの下に装飾的なアンダーライン（静止表示） */}
            <div
              className="absolute -bottom-3 left-1/2 h-1 w-[70%] bg-primary/60 rounded-full -translate-x-1/2"
              style={{
                boxShadow: `0 0 12px ${PRIMARY_COLOR.glow.strong}`
              }}
            />
          </span>
        </h2>

        {/* 説明文 */}
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed relative z-10">
          私たちの取り組みや技術について、より深く知る
        </p>

        {/* 装飾的なグロー背景 */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl -z-10 opacity-10 pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${PRIMARY_COLOR.glow.medium}, transparent 70%)`
          }}
        />
      </div>

      {/* ナビゲーションカード */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {HOME_NAVIGATION_CARDS.map((card, index) => (
          <NavigationCard
            key={card.href}
            href={card.href}
            title={card.title}
            description={card.description}
            imgSrc={card.imgSrc}
            index={index}
          />
        ))}
      </div>
      </SectionContainer>
    </section>
  );
}

