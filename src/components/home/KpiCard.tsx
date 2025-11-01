"use client";

import { memo } from "react";
import { motion, Variants } from "framer-motion";
import { AnimatedIcon } from "./AnimatedIcon";
import type { KpiData } from "@/data/types";

/**
 * KpiCard Component
 * KPIセクション用のカードコンポーネント
 * 
 * 特徴:
 * - 近未来的なデザイン
 * - スムーズなアニメーション
 * - ホバー時のインタラクティブな効果
 * - アクセシビリティ対応
 */

interface KpiCardProps extends KpiData {
  /** カードのインデックス（アニメーション遅延に使用） */
  index: number;
}

// カードアニメーションのバリエーション
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// カードの背景スタイル
const cardBackgroundStyle: React.CSSProperties = {
  background: 'linear-gradient(to bottom right, oklch(0.18 0.02 240 / 80%), oklch(0.15 0.02 240 / 80%))',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
};

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

/**
 * KPIカードコンポーネント
 * メモ化して不要な再レンダリングを防止
 */
export const KpiCard = memo(function KpiCard({ 
  icon, 
  label, 
  value, 
  description, 
  index 
}: KpiCardProps) {
  return (
    <motion.div
      className="group relative p-8 rounded-2xl border border-primary/20 backdrop-blur-md transition-all duration-300 hover:border-primary/40 active:scale-[0.98] cursor-default overflow-hidden"
      style={cardBackgroundStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      variants={itemVariants}
      whileHover={{ y: -4 }}
      role="article"
      aria-label={`${label}: ${description}`}
    >
      {/* ホバー時のエネルギーフロー効果 */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
      </div>

      {/* アイコンエリア */}
      <div className="mb-6">
        <AnimatedIcon 
          icon={icon} 
          delay={0.2 + index * 0.1}
        />
      </div>

      {/* テキストエリア - 日本語をメインに */}
      <motion.p 
        className="text-3xl font-bold text-foreground cursor-default mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
      >
        {label}
      </motion.p>
      
      <motion.p 
        className="text-sm font-medium text-muted-foreground cursor-default mb-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
      >
        {value}
      </motion.p>
      
      <motion.p 
        className="text-sm font-medium text-foreground/90 cursor-default leading-relaxed"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
      >
        {description}
      </motion.p>
    </motion.div>
  );
});
