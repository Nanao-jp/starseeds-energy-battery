"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cardStyles, backgroundPatterns, rotatingGlowStyles } from '@/lib/styles';
import { PRIMARY_COLOR, CARD_COLORS } from '@/lib/theme';
import { getAnimation, getViewport } from '@/lib/animation';

interface NavigationCardProps {
  href: string;
  title: string;
  description: string;
  imgSrc: string;
  index: number;
}

/**
 * Navigation Card Component
 * スタイリッシュでテクノロジー感のあるカードコンポーネント
 * 
 * 特徴:
 * - 奥行き・階層感のあるデザイン（ガラスモーフィズム）
 * - 控えめなテクノロジー感（サイアンのグロー効果）
 * - モバイル体験を重視（ホバーは控えめ）
 * - シンプルで洗練されたレイアウト
 */
export function NavigationCard({ href, title, description, imgSrc, index }: NavigationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={getViewport().once}
      transition={getAnimation().normal}
      className="h-full"
    >
      <Link href={href} className="group block h-full">
        <div 
          className="relative h-full flex flex-col overflow-hidden rounded-xl border border-primary/20 backdrop-blur-md active:scale-[0.98] cursor-pointer transition-shadow duration-300"
          style={{
            background: cardStyles.background,
            boxShadow: cardStyles.defaultShadow,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = cardStyles.hoverShadow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = cardStyles.defaultShadow;
          }}
        >
          {/* ホバー時のシャインエフェクト（軽量、CSSのみ） */}
          <div 
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
          </div>
          {/* 画像エリア */}
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={imgSrc}
              alt={title}
              fill
              loading={index === 0 ? undefined : "lazy"}
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {/* グラデーションオーバーレイ */}
            <div 
              className="absolute inset-0"
              style={{
                background: cardStyles.imageOverlay
              }}
            />
          </div>

          {/* コンテンツエリア */}
          <div 
            className="relative flex flex-col flex-grow p-6 backdrop-blur-sm overflow-hidden"
            style={{
              backgroundColor: CARD_COLORS.contentBackground
            }}
          >
            {/* 装飾的な背景パターン（軽量化） */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: backgroundPatterns.repeatingLines.medium,
                backgroundSize: '20px 20px',
              }}
            />

            {/* 角のアクセント（光が周囲を回る） */}
            <div 
              className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
              style={{
                ...rotatingGlowStyles.mask,
                borderRadius: 'inherit'
              }}
            >
              <div 
                className="absolute inset-0 rounded-xl"
                style={{
                  background: rotatingGlowStyles.gradient,
                  borderRadius: 'inherit',
                  animation: 'corner-rotate 6s linear infinite',
                  willChange: 'transform',
                  transformOrigin: 'center center'
                }}
              />
            </div>


            {/* タイトル */}
            <h3 className="relative text-xl font-bold tracking-tight font-heading mb-3 text-foreground cursor-default z-10">
              <span className="relative inline-block">
                {title}
                {/* タイトル下のアンダーライン（静止表示） */}
                <div
                  className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary/50 rounded-full"
                  style={{
                    boxShadow: `0 0 8px ${PRIMARY_COLOR.glow.normal}`
                  }}
                />
              </span>
            </h3>

            {/* 説明文 */}
            <p className="relative text-sm text-muted-foreground leading-relaxed flex-grow mb-4 cursor-default z-10">
              {description}
            </p>
            
            {/* リンクエリア */}
            <div className="relative flex items-center text-primary font-medium text-sm gap-2 cursor-pointer z-10">
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">詳しく見る</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}

