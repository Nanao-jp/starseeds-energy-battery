"use client";

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link href={href} className="group block h-full">
        <div 
          className="relative h-full flex flex-col overflow-hidden rounded-xl border border-primary/20 backdrop-blur-md active:scale-[0.98] cursor-pointer transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_0_0_1px_oklch(0.72_0.15_210_/_0.15)]"
          style={{
            background: 'linear-gradient(to bottom right, oklch(0.18 0.02 240 / 80%), oklch(0.15 0.02 240 / 80%))',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
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
                background: 'linear-gradient(to top, oklch(0.09 0.01 240 / 90%), oklch(0.09 0.01 240 / 40%), transparent)'
              }}
            />
          </div>

          {/* コンテンツエリア */}
          <div 
            className="relative flex flex-col flex-grow p-6 backdrop-blur-sm overflow-hidden"
            style={{
              backgroundColor: 'oklch(0.18 0.02 240 / 60%)'
            }}
          >
            {/* 装飾的な背景パターン（軽量化） */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(0.72 0.15 210 / 20%) 2px, oklch(0.72 0.15 210 / 20%) 4px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* 角のアクセント（光が周囲を回る） */}
            <div 
              className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
              style={{
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
                padding: '1px',
                borderRadius: 'inherit'
              }}
            >
              <div 
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, transparent 280deg, oklch(0.72 0.15 210 / 80%) 300deg, transparent 320deg, transparent 360deg)',
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
                {/* タイトル下のアンダーライン（常時表示） */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-primary/50 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{
                    boxShadow: '0 0 8px oklch(0.72 0.15 210 / 50%)'
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

