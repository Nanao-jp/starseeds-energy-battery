"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, Radio, LucideIcon } from 'lucide-react';
import { cardStyles, backgroundPatterns, cornerAccentStyles, TEXT_GRADIENT } from '@/lib/styles';
import { PRIMARY_COLOR } from '@/lib/theme';
import { getAnimation, getViewport } from '@/lib/animation';

interface FeatureCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  iconName?: 'zap' | 'radio';
  reverse?: boolean;
}

// アイコンマッピング
const iconMap: Record<'zap' | 'radio', LucideIcon> = {
  zap: Zap,
  radio: Radio,
};

/**
 * FeatureCard Component
 * 画像とテキストを一体化したモダンなカードコンポーネント
 * 
 * 特徴:
 * - 近未来的なデザイン
 * - スムーズなアニメーション
 * - ホバー時のインタラクティブな効果
 * - 画像とテキストの一体化
 * - カスタマイズ可能なアイコン
 */
export function FeatureCard({ imageSrc, imageAlt, title, description, iconName = 'zap', reverse = false }: FeatureCardProps) {
  const IconComponent = iconMap[iconName];


  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-primary/20 backdrop-blur-md transition-all duration-300 hover:border-primary/40"
      style={{
        background: cardStyles.background,
        boxShadow: cardStyles.defaultShadow
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = cardStyles.hoverShadow;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = cardStyles.defaultShadow;
      }}
      initial={{ 
        opacity: 0, 
        ...(reverse ? { x: 40 } : { x: -40 })
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0 
      }}
      viewport={{ ...getViewport().once, amount: 0.3 }}
      transition={getAnimation().normal}
    >
        {/* ホバー時のエネルギーフロー効果 */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
        </div>

        <div className={`grid md:grid-cols-2 gap-0 ${reverse ? 'md:flex-row-reverse' : ''}`}>
          {/* 画像エリア */}
          <div className={`relative h-40 md:h-auto min-h-[400px] overflow-hidden ${reverse ? 'md:order-2' : ''}`}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              quality={85}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* グラデーションオーバーレイ */}
            <div 
              className="absolute inset-0"
              style={{
                background: reverse 
                  ? `linear-gradient(to left, ${TEXT_GRADIENT.left.start}, ${TEXT_GRADIENT.left.middle} 70%, ${TEXT_GRADIENT.left.end} 100%)`
                  : `linear-gradient(to right, ${TEXT_GRADIENT.right.start}, ${TEXT_GRADIENT.right.middle} 70%, ${TEXT_GRADIENT.right.end} 100%)`
              }}
            />
            {/* 左側のグラデーション（モバイル用） */}
            <div 
              className="absolute inset-0 md:hidden"
              style={{
                background: `linear-gradient(to bottom, ${TEXT_GRADIENT.bottom.start}, ${TEXT_GRADIENT.bottom.middle} 70%, ${TEXT_GRADIENT.bottom.end} 100%)`
              }}
            />
          </div>

          {/* テキストコンテンツエリア */}
          <div className={`relative p-8 md:p-12 flex flex-col justify-center z-10 overflow-hidden ${reverse ? 'md:order-1' : ''}`}>
            {/* 装飾的な背景パターン */}
            <div 
              className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, transparent 0%, ${PRIMARY_COLOR.glow.light} 50%, transparent 100%),
                  ${backgroundPatterns.repeatingLines.light}
                `,
                backgroundSize: '100% 100%, 20px 20px',
              }}
            />

            {/* 装飾的なコーナーアクセント */}
            <div className="absolute top-0 left-0 w-24 h-24 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
              <div 
                className="absolute top-0 left-0 w-full h-1"
                style={{
                  background: cornerAccentStyles.gradient.right,
                  boxShadow: cornerAccentStyles.shadow
                }}
              />
              <div 
                className="absolute top-0 left-0 w-1 h-full"
                style={{
                  background: cornerAccentStyles.gradient.bottom,
                  boxShadow: cornerAccentStyles.shadow
                }}
              />
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
              <div 
                className="absolute bottom-0 right-0 w-full h-1"
                style={{
                  background: cornerAccentStyles.gradient.left,
                  boxShadow: cornerAccentStyles.shadow
                }}
              />
              <div 
                className="absolute bottom-0 right-0 w-1 h-full"
                style={{
                  background: cornerAccentStyles.gradient.top,
                  boxShadow: cornerAccentStyles.shadow
                }}
              />
            </div>

            {/* アイコン装飾 */}
            <div className="relative mb-6">
              <div className="relative inline-flex items-center gap-3">
                <div className="relative">
                  <IconComponent className="h-8 w-8 text-primary" style={{ filter: `drop-shadow(0 0 8px ${PRIMARY_COLOR.glow.intense})` }} />
                  {/* アイコンのグロー効果 */}
                  <div 
                    className="absolute inset-0 rounded-full blur-xl -z-10 opacity-50 group-hover:opacity-75 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle, ${PRIMARY_COLOR.glow.medium}, transparent 70%`
                    }}
                  />
                </div>
                {/* 装飾的なドット（CSSアニメーション化） */}
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i === 0 ? 'animate-pulse-dot' : i === 1 ? 'animate-pulse-dot-delay-1' : 'animate-pulse-dot-delay-2'
                      }`}
                      style={{
                        background: PRIMARY_COLOR.glow.medium.replace('/ 40%', `/${40 + i * 20}%`),
                        boxShadow: `0 0 ${4 + i * 2}px ${PRIMARY_COLOR.glow.medium.replace('/ 40%', `/${60 + i * 20}%`)}`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* タイトル */}
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-heading text-foreground relative">
              <span className="relative">
                {title}
                {/* タイトルの下に装飾的なアンダーライン（伸びるアニメーション） */}
                <motion.div
                  className="absolute -bottom-2 left-0 h-0.5 bg-primary/50 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{
                    boxShadow: `0 0 8px ${PRIMARY_COLOR.glow.normal}`
                  }}
                />
              </span>
            </h2>

            {/* 説明文 */}
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg relative z-10">
              {description}
            </p>

          </div>
        </div>
    </motion.div>
  );
}

