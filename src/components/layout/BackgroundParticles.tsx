"use client";

import { useEffect } from "react";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

/**
 * Background Energy Pulse Component
 * エネルギー波パルス - 中央から外側へ広がる控えめな波
 * 
 * 特徴:
 * - 控えめで上品なアニメーション
 * - シンプルで洗練されたデザイン
 * - 読みやすさを最優先
 * - エネルギー・拡散・伝播のイメージ
 * - パフォーマンス重視（CSSのみ）
 * - 表示外ではアニメーション停止
 */
export function BackgroundParticles() {
  // 同時に表示する波の数
  const pulseCount = 3;
  const { elementRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0,
    rootMargin: "100px",
  });

  // 表示外の時はアニメーションを停止
  useEffect(() => {
    if (!elementRef.current) return;

    const pulses = elementRef.current.querySelectorAll(".energy-pulse");
    
    if (isIntersecting) {
      pulses.forEach((pulse) => pulse.classList.remove("animation-paused"));
    } else {
      pulses.forEach((pulse) => pulse.classList.add("animation-paused"));
    }
  }, [isIntersecting, elementRef]);
  
  return (
    <div 
      ref={elementRef}
      className="fixed inset-0 pointer-events-none z-[2] overflow-hidden flex items-center justify-center"
    >
      {Array.from({ length: pulseCount }).map((_, i) => (
        <EnergyPulse key={i} delay={i * 2.5} />
      ))}
    </div>
  );
}

interface EnergyPulseProps {
  delay: number;
}

/**
 * 個別のエネルギー波パルス
 */
function EnergyPulse({ delay }: EnergyPulseProps) {
  return (
    <div
      className="energy-pulse absolute rounded-full"
      style={{
        animationDelay: `${delay}s`,
      }}
    />
  );
}

