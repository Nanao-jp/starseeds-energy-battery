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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={href} className="group block h-full">
        <div 
          className="relative h-full flex flex-col overflow-hidden rounded-xl border border-primary/20 backdrop-blur-md transition-all duration-300 hover:border-primary/40 active:scale-[0.98] cursor-pointer"
          style={{
            background: 'linear-gradient(to bottom right, oklch(0.18 0.02 240 / 80%), oklch(0.15 0.02 240 / 80%))',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px oklch(0.72 0.15 210 / 15%) inset';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
          }}
        >
          {/* 画像エリア */}
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={imgSrc}
              alt={title}
              fill
              loading={index === 0 ? undefined : "lazy"}
              quality={85}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
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
            className="flex flex-col flex-grow p-6 backdrop-blur-sm"
            style={{
              backgroundColor: 'oklch(0.18 0.02 240 / 60%)'
            }}
          >
            <h3 className="text-xl font-bold tracking-tight font-heading mb-2 text-foreground cursor-default">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed flex-grow mb-4 cursor-default">
              {description}
            </p>
            
            {/* リンクエリア */}
            <div className="flex items-center text-primary font-medium text-sm gap-2 cursor-pointer">
              <span>詳しく見る</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>

          {/* ホバー時のグロー効果（控えめ） */}
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
            <div className="absolute inset-0 rounded-xl border border-primary/20" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

