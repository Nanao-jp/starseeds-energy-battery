"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, Radio, LucideIcon } from 'lucide-react';

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
  // ホバー時のシャドウスタイル
  const hoverShadowStyle = '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px oklch(0.72 0.15 210 / 15%) inset';
  const defaultShadowStyle = '0 4px 16px rgba(0, 0, 0, 0.2)';

  /**
   * カードのシャドウスタイルを更新するヘルパー関数
   */
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = hoverShadowStyle;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = defaultShadowStyle;
  };

  return (
    <div className="relative">
      <motion.div
        className="group relative overflow-hidden rounded-2xl border border-primary/20 backdrop-blur-md transition-all duration-300 hover:border-primary/40"
        style={{
          background: 'linear-gradient(to bottom right, oklch(0.18 0.02 240 / 80%), oklch(0.15 0.02 240 / 80%))',
          boxShadow: defaultShadowStyle
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
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
                  ? 'linear-gradient(to left, transparent 0%, oklch(0.18 0.02 240 / 60%) 70%, oklch(0.18 0.02 240 / 90%) 100%)'
                  : 'linear-gradient(to right, transparent 0%, oklch(0.18 0.02 240 / 60%) 70%, oklch(0.18 0.02 240 / 90%) 100%)'
              }}
            />
            {/* 左側のグラデーション（モバイル用） */}
            <div 
              className="absolute inset-0 md:hidden"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, oklch(0.18 0.02 240 / 60%) 70%, oklch(0.18 0.02 240 / 90%) 100%)'
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
                  linear-gradient(90deg, transparent 0%, oklch(0.72 0.15 210 / 30%) 50%, transparent 100%),
                  repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.72 0.15 210 / 10%) 2px, oklch(0.72 0.15 210 / 10%) 4px)
                `,
                backgroundSize: '100% 100%, 20px 20px',
              }}
            />

            {/* 装飾的なコーナーアクセント */}
            <div className="absolute top-0 left-0 w-24 h-24 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
              <div 
                className="absolute top-0 left-0 w-full h-1"
                style={{
                  background: 'linear-gradient(to right, oklch(0.72 0.15 210 / 80%), transparent)',
                  boxShadow: '0 0 10px oklch(0.72 0.15 210 / 50%)'
                }}
              />
              <div 
                className="absolute top-0 left-0 w-1 h-full"
                style={{
                  background: 'linear-gradient(to bottom, oklch(0.72 0.15 210 / 80%), transparent)',
                  boxShadow: '0 0 10px oklch(0.72 0.15 210 / 50%)'
                }}
              />
            </div>
            <div className="absolute bottom-0 right-0 w-24 h-24 opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none">
              <div 
                className="absolute bottom-0 right-0 w-full h-1"
                style={{
                  background: 'linear-gradient(to left, oklch(0.72 0.15 210 / 80%), transparent)',
                  boxShadow: '0 0 10px oklch(0.72 0.15 210 / 50%)'
                }}
              />
              <div 
                className="absolute bottom-0 right-0 w-1 h-full"
                style={{
                  background: 'linear-gradient(to top, oklch(0.72 0.15 210 / 80%), transparent)',
                  boxShadow: '0 0 10px oklch(0.72 0.15 210 / 50%)'
                }}
              />
            </div>

            {/* アイコン装飾 */}
            <div className="relative mb-6">
              <motion.div
                className="relative inline-flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <IconComponent className="h-8 w-8 text-primary" style={{ filter: 'drop-shadow(0 0 8px oklch(0.72 0.15 210 / 70%))' }} />
                  {/* アイコンのグロー効果 */}
                  <div 
                    className="absolute inset-0 rounded-full blur-xl -z-10 opacity-50 group-hover:opacity-75 transition-opacity duration-300"
                    style={{
                      background: 'radial-gradient(circle, oklch(0.72 0.15 210 / 40%), transparent 70%'
                    }}
                  />
                </div>
                {/* 装飾的なドット（CSSアニメーション化） */}
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i === 0 ? 'animate-pulse-dot' : i === 1 ? 'animate-pulse-dot-delay-1' : 'animate-pulse-dot-delay-2'
                      }`}
                      style={{
                        background: `oklch(0.72 0.15 210 / ${0.4 + i * 0.2})`,
                        boxShadow: `0 0 ${4 + i * 2}px oklch(0.72 0.15 210 / ${0.6 + i * 0.2})`
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* タイトル */}
            <motion.h2 
              className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-heading text-foreground relative"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="relative">
                {title}
                {/* タイトルの下に装飾的なアンダーライン */}
                <motion.div
                  className="absolute -bottom-2 left-0 h-0.5 bg-primary/50 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  style={{
                    boxShadow: '0 0 8px oklch(0.72 0.15 210 / 50%)'
                  }}
                />
              </span>
            </motion.h2>

            {/* 説明文 */}
            <motion.p 
              className="text-muted-foreground leading-relaxed text-base md:text-lg relative z-10"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="relative">
                {description}
              </span>
            </motion.p>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

