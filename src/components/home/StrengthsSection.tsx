"use client";

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { STRENGTHS_DATA } from '@/data/strengths';
import type { FeatureCardData } from '@/data/types';
import { SectionContainer } from '@/components/layout/SectionContainer';
import { ANIMATION, VIEWPORT } from '@/lib/animation';

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
      className="space-y-24"
      aria-label="当社の強み"
    >
      <SectionContainer py="md" withDivider dividerClassName="mb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT.once}
          transition={ANIMATION.normal}
          className="space-y-24"
        >
          {STRENGTHS_DATA.map((strength: FeatureCardData, index: number) => (
            <FeatureCard key={`${strength.title}-${index}`} {...strength} />
          ))}
        </motion.div>
      </SectionContainer>
    </section>
  );
}

