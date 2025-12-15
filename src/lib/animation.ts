import { isLineBrowser } from './utils';

/**
 * アニメーション設定の定数
 * サイト全体で使用するアニメーションのdurationやtransitionを一元管理
 */

/**
 * アニメーション時間（秒）
 */
export const ANIMATION = {
  fast: { duration: 0.3 },
  normal: { duration: 0.4 },
  slow: { duration: 0.6 },
  verySlow: { duration: 0.8 },
} as const;

/**
 * LINEブラウザ用のアニメーション設定（無効化）
 */
export const ANIMATION_DISABLED = {
  fast: { duration: 0 },
  normal: { duration: 0 },
  slow: { duration: 0 },
  verySlow: { duration: 0 },
} as const;

/**
 * LINEブラウザかどうかを判定してアニメーション設定を返す
 * クライアント側でのみ判定（SSR対応）
 */
export function getAnimation() {
  if (typeof window === 'undefined') {
    return ANIMATION;
  }
  return isLineBrowser() ? ANIMATION_DISABLED : ANIMATION;
}

/**
 * トランジション設定
 */
export const TRANSITION = {
  /** フェードイン（速い） */
  fadeInFast: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: ANIMATION.fast,
  },
  /** フェードイン（標準） */
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: ANIMATION.normal,
  },
  /** フェードイン（遅い） */
  fadeInSlow: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: ANIMATION.slow,
  },
} as const;

/**
 * viewport設定
 */
export const VIEWPORT = {
  once: { once: true },
  always: { once: false },
} as const;

/**
 * LINEブラウザ用のviewport設定（アニメーション無効化）
 */
export const VIEWPORT_DISABLED = {
  once: { once: false },
  always: { once: false },
} as const;

/**
 * LINEブラウザかどうかを判定してviewport設定を返す
 * クライアント側でのみ判定（SSR対応）
 */
export function getViewport() {
  if (typeof window === 'undefined') {
    return VIEWPORT;
  }
  return isLineBrowser() ? VIEWPORT_DISABLED : VIEWPORT;
}

/**
 * LINEブラウザかどうかを判定する関数（エクスポート）
 * クライアント側でのみ判定（SSR対応）
 */
export function getIsLineBrowser() {
  if (typeof window === 'undefined') {
    return false;
  }
  return isLineBrowser();
}

