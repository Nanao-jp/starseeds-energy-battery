"use client";

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { STRENGTHS_DATA } from '@/data/strengths';
import type { FeatureCardData } from '@/data/types';

// FeatureCardを動的インポート
const FeatureCard = dynamic(() => import('./FeatureCard').then(mod => ({ default: mod.FeatureCard })), {
  ssr: true,
});

/**
 * StrengthsSection Component
 * 強みを紹介するセクションコンポーネント
 * 
 * 特徴:
 * - データ駆動型の設計
 * - シンプルなアニメーション（カードは一括表示）
 * - 保守性と拡張性を重視
 */
export function StrengthsSection() {
  return (
    <section 
      className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-16"
      aria-label="当社の強み"
    >
      <div className="section-divider mb-16" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="space-y-24"
      >
        {STRENGTHS_DATA.map((strength: FeatureCardData, index: number) => (
          <FeatureCard key={`${strength.title}-${index}`} {...strength} />
        ))}
      </motion.div>
    </section>
  );
}

