/**
 * 共通スタイル定数
 * サイト全体で使用するスタイル値を一元管理
 */

import { CARD_COLORS, PRIMARY_COLOR } from "./theme";

/**
 * カードスタイル
 */
export const cardStyles = {
  /** カード背景グラデーション */
  background: `linear-gradient(to bottom right, ${CARD_COLORS.backgroundStart}, ${CARD_COLORS.backgroundEnd})`,
  /** デフォルトシャドウ */
  defaultShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  /** ホバー時のシャドウ */
  hoverShadow: `0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px ${PRIMARY_COLOR.border} inset`,
  /** 画像上のグラデーションオーバーレイ */
  imageOverlay: `linear-gradient(to top, ${CARD_COLORS.overlay.start}, ${CARD_COLORS.overlay.middle}, ${CARD_COLORS.overlay.end})`,
} as const;

/**
 * 背景パターン
 */
export const backgroundPatterns = {
  /** リピーティングライン（軽量） */
  repeatingLines: {
    light: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${PRIMARY_COLOR.pattern.light} 2px, ${PRIMARY_COLOR.pattern.light} 4px)`,
    medium: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${PRIMARY_COLOR.pattern.medium} 2px, ${PRIMARY_COLOR.pattern.medium} 4px)`,
  },
  /** グリッドパターン */
  grid: {
    light: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${PRIMARY_COLOR.pattern.light} 2px, ${PRIMARY_COLOR.pattern.light} 4px)`,
  },
  /** 放射状グラデーション */
  radialGradient: (opacity: number = 0.3) => 
    `radial-gradient(circle at 50% 50%, ${PRIMARY_COLOR.glow.medium.replace('/ 40%', `/${opacity * 100}%`)} 0%, transparent 50%)`,
} as const;

/**
 * コーナーアクセントスタイル
 */
export const cornerAccentStyles = {
  /** グラデーション（4方向） */
  gradient: {
    right: `linear-gradient(to right, ${PRIMARY_COLOR.glow.veryIntense}, transparent)`,
    bottom: `linear-gradient(to bottom, ${PRIMARY_COLOR.glow.veryIntense}, transparent)`,
    left: `linear-gradient(to left, ${PRIMARY_COLOR.glow.veryIntense}, transparent)`,
    top: `linear-gradient(to top, ${PRIMARY_COLOR.glow.veryIntense}, transparent)`,
  },
  /** シャドウ */
  shadow: `0 0 10px ${PRIMARY_COLOR.glow.normal}`,
} as const;

/**
 * 回転するグローエフェクト（NavigationCard用）
 */
export const rotatingGlowStyles = {
  /** conic-gradient定義 */
  gradient: `conic-gradient(from 0deg, transparent 0deg, transparent 280deg, ${PRIMARY_COLOR.glow.veryIntense} 300deg, transparent 320deg, transparent 360deg)`,
  /** マスク定義 */
  mask: {
    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    maskComposite: 'exclude',
    WebkitMaskComposite: 'xor',
    padding: '1px',
  },
} as const;

/**
 * テキストエリア用グラデーション
 */
export const TEXT_GRADIENT = {
  /** テキストオーバーレイ（右方向） */
  right: {
    start: 'transparent',
    middle: CARD_COLORS.contentBackground,
    end: CARD_COLORS.overlay.start,
  },
  /** テキストオーバーレイ（左方向） */
  left: {
    start: 'transparent',
    middle: CARD_COLORS.contentBackground,
    end: CARD_COLORS.overlay.start,
  },
  /** テキストオーバーレイ（下方向） */
  bottom: {
    start: 'transparent',
    middle: CARD_COLORS.contentBackground,
    end: CARD_COLORS.overlay.start,
  },
} as const;

