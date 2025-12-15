"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import { useEffect, useRef } from "react";

/**
 * AnimatedIcon Component
 * 近未来的なアイコンアニメーションコンポーネント
 * 
 * 特徴:
 * - 回転するグラデーションリング（CSSアニメーション化）
 * - 粒子が回る軌道アニメーション（CSSアニメーション化）
 * - ホバー時のインタラクティブな効果
 * - パフォーマンス最適化済み（JS負荷を大幅削減）
 * - 表示外ではアニメーション停止
 */

interface AnimatedIconProps {
  /** Lucide Reactアイコンコンポーネント */
  icon: LucideIcon;
  /** カスタムクラス名 */
  className?: string;
}

const PARTICLE_COUNT = 1;

export function AnimatedIcon({ icon: IconComponent, className }: AnimatedIconProps) {
  const { elementRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: "50px",
  });

  // DOM要素をuseRefで保持（querySelectorの繰り返しを避ける）
  const ringRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<NodeListOf<HTMLElement> | null>(null);

  // 初期化時にDOM要素を取得
  useEffect(() => {
    if (!elementRef.current) return;

    ringRef.current = elementRef.current.querySelector(".animated-icon-ring") as HTMLDivElement | null;
    particlesRef.current = elementRef.current.querySelectorAll(`[class*="animated-icon-particle"]`) as NodeListOf<HTMLElement> | null;
  }, [elementRef]);

  // 表示外の時はアニメーションを停止
  useEffect(() => {
    if (isIntersecting) {
      ringRef.current?.classList.remove("animation-paused");
      particlesRef.current?.forEach((p) => p.classList.remove("animation-paused"));
    } else {
      ringRef.current?.classList.add("animation-paused");
      particlesRef.current?.forEach((p) => p.classList.add("animation-paused"));
    }
  }, [isIntersecting]);

  return (
    <div ref={elementRef} className={`relative flex justify-center ${className || ""}`}>
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* 回転するグラデーションリング（CSSアニメーション化でJS負荷削減） */}
        <div
          className="absolute inset-0 rounded-full animated-icon-ring"
          style={{
            background: 'conic-gradient(from 0deg, transparent, oklch(0.72 0.15 210 / 30%), transparent, oklch(0.72 0.15 210 / 30%), transparent)',
            mask: 'radial-gradient(circle, transparent 60%, black 75%, transparent 85%)',
            WebkitMask: 'radial-gradient(circle, transparent 60%, black 75%, transparent 85%)',
          }}
        />

        {/* 粒子が回る軌道（複数層、CSSアニメーション化でJS負荷削減） */}
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <div
            key={i}
            className={`absolute inset-0 animated-icon-particle-${i + 1}`}
          >
            <div
              className="absolute rounded-full"
              style={{
                left: '50%',
                top: '0%',
                transform: 'translate(-50%, -50%)',
                background: `oklch(0.72 0.15 210 / ${0.6 - i * 0.2})`,
                boxShadow: `0 0 ${4 + i * 2}px oklch(0.72 0.15 210 / ${0.8 - i * 0.2})`,
                width: `${4 + i * 1}px`,
                height: `${4 + i * 1}px`,
              }}
            />
          </div>
        ))}
        
        {/* アイコン本体 */}
        <motion.div
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          className="relative z-10"
        >
          <IconComponent 
            className="h-12 w-12 text-primary"
            style={{
              filter: 'drop-shadow(0 0 12px oklch(0.72 0.15 210 / 70%))',
            }}
          />
        </motion.div>

        {/* 静的なグロー背景 */}
        <div 
          className="absolute inset-0 rounded-full blur-2xl -z-10"
          style={{
            background: 'radial-gradient(circle, oklch(0.72 0.15 210 / 25%), transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}
