"use client";

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import dynamic from 'next/dynamic';
import { HOME_NAVIGATION_CARDS } from '@/lib/constants';

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
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16"
      aria-label="さらに詳しく"
    >
      <div className="section-divider mb-16" aria-hidden="true" />

      {/* リッチなセクションタイトル */}
      <motion.div
        className="relative text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* 装飾的な背景パターン */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 50%, oklch(0.72 0.15 210 / 30%) 0%, transparent 50%),
              repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.72 0.15 210 / 10%) 2px, oklch(0.72 0.15 210 / 10%) 4px)
            `,
            backgroundSize: '100% 100%, 20px 20px',
          }}
        />

        {/* アイコン装飾 */}
        <motion.div
          className="relative inline-flex items-center gap-3 mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <BookOpen className="h-10 w-10 text-primary" style={{ filter: 'drop-shadow(0 0 12px oklch(0.72 0.15 210 / 70%))' }} />
            {/* アイコンのグロー効果 */}
            <div 
              className="absolute inset-0 rounded-full blur-2xl -z-10 opacity-50"
              style={{
                background: 'radial-gradient(circle, oklch(0.72 0.15 210 / 40%), transparent 70%)'
              }}
            />
          </div>
        </motion.div>

        {/* タイトル */}
        <motion.h2 
          className="text-4xl md:text-5xl font-bold tracking-tight font-heading text-foreground relative inline-block mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="relative">
            さらに詳しく
            {/* タイトルの下に装飾的なアンダーライン */}
            <motion.div
              className="absolute -bottom-3 left-1/2 h-1 bg-primary/60 rounded-full"
              initial={{ width: 0, x: '-50%' }}
              whileInView={{ width: "70%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                boxShadow: '0 0 12px oklch(0.72 0.15 210 / 60%)'
              }}
            />
          </span>
        </motion.h2>

        {/* 説明文 */}
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground leading-relaxed relative z-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          私たちの取り組みや技術について、より深く知る
        </motion.p>

        {/* 装飾的なグロー背景 */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl -z-10 opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, oklch(0.72 0.15 210 / 40%), transparent 70%)'
          }}
        />
      </motion.div>

      {/* ナビゲーションカード */}
      <motion.div
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
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
      </motion.div>
    </section>
  );
}

