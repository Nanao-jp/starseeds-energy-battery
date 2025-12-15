"use client";

import { useState, useEffect } from "react";

/**
 * ビューポート情報を取得するカスタムフック
 * モバイル判定と画面サイズの監視を行う
 */
export function useViewport() {
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setIsMobile(width < 768);
    };

    // 初期チェック
    checkViewport();

    // リサイズ時の最適化（デバウンスなしでも軽量）
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  return { isMobile, viewportWidth };
}

