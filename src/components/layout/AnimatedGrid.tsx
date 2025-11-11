"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * 光るグリッドアニメーションコンポーネント
 * CSS中心で実装し、パフォーマンスを最適化
 * createPortalでbody直下にレンダリングして、親要素の影響を受けないようにする
 */
export function AnimatedGrid() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div className="animated-grid-background" aria-hidden="true">
      {/* メイングリッド */}
      <div className="animated-grid-lines" />
      
      {/* グロー効果（パルス） */}
      <div className="animated-grid-glow" />
      
      {/* 交差点の光点 */}
      <div className="animated-grid-dots" />
    </div>,
    document.body
  );
}

