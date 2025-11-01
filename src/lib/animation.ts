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

