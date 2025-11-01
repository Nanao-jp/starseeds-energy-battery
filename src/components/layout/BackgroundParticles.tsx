"use client";

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
 */
export function BackgroundParticles() {
  // 同時に表示する波の数
  const pulseCount = 3;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden flex items-center justify-center">
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

