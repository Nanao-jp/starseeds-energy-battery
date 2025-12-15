"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { isLineBrowser } from "@/lib/utils";

/**
 * 光るグリッドアニメーションコンポーネント
 * CSS中心で実装し、パフォーマンスを最適化
 * createPortalでbody直下にレンダリングして、親要素の影響を受けないようにする
 * LINEブラウザではアニメーションを無効化
 */
export function AnimatedGrid() {
  const [mounted, setMounted] = useState(false);
  const [isLine, setIsLine] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLine(isLineBrowser());
  }, []);

  if (!mounted) {
    return null;
  }

  // LINEブラウザではアニメーションを無効化（静的グリッドのみ表示）
  const gridClassName = isLine 
    ? "animated-grid-background animated-grid-disabled" 
    : "animated-grid-background";

  return createPortal(
    <div className={gridClassName} aria-hidden="true">
      {/* メイングリッド */}
      <div className="animated-grid-lines" />
      
      {/* グロー効果（パルス） */}
      {!isLine && <div className="animated-grid-glow" />}
      
      {/* 交差点の光点 */}
      {!isLine && <div className="animated-grid-dots" />}
    </div>,
    document.body
  );
}

