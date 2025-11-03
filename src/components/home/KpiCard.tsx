"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { AnimatedIcon } from "./AnimatedIcon";
import type { KpiData } from "@/data/types";
import { cardStyles } from "@/lib/styles";
import { ANIMATION, VIEWPORT } from "@/lib/animation";

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

// カードの背景スタイル
const cardBackgroundStyle: React.CSSProperties = {
  background: cardStyles.background,
  boxShadow: cardStyles.defaultShadow,
};

/**
 * カードのシャドウスタイルを更新するヘルパー関数
 */
const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.boxShadow = cardStyles.hoverShadow;
};

const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.style.boxShadow = cardStyles.defaultShadow;
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT.once}
      transition={ANIMATION.normal}
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
        />
      </div>

      {/* テキストエリア - 日本語をメインに */}
      <p className="text-3xl font-bold text-foreground cursor-default mb-2">
        {label}
      </p>
      
      <p className="text-sm font-medium text-muted-foreground cursor-default mb-1">
        {value}
      </p>
      
      <p className="text-sm font-medium text-foreground/90 cursor-default leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
});
