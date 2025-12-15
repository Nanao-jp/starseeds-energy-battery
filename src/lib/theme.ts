/**
 * テーマカラーの定数定義
 * サイト全体で使用する色の値を一元管理
 */

/**
 * プライマリカラー（サイアン系）
 */
export const PRIMARY_COLOR = {
  base: 'oklch(0.72 0.15 210)',
  /** グロー効果用の透明度バリエーション */
  glow: {
    light: 'oklch(0.72 0.15 210 / 30%)',
    medium: 'oklch(0.72 0.15 210 / 40%)',
    normal: 'oklch(0.72 0.15 210 / 50%)',
    strong: 'oklch(0.72 0.15 210 / 60%)',
    intense: 'oklch(0.72 0.15 210 / 70%)',
    veryIntense: 'oklch(0.72 0.15 210 / 80%)',
  },
  /** ボーダー・インセット用 */
  border: 'oklch(0.72 0.15 210 / 15%)',
  /** 背景パターン用 */
  pattern: {
    light: 'oklch(0.72 0.15 210 / 10%)',
    medium: 'oklch(0.72 0.15 210 / 20%)',
    strong: 'oklch(0.72 0.15 210 / 30%)',
  },
} as const;

/**
 * カード背景色
 */
export const CARD_COLORS = {
  /** カードのメイン背景（グラデーション開始） */
  backgroundStart: 'oklch(0.18 0.02 240 / 80%)',
  /** カードのメイン背景（グラデーション終了） */
  backgroundEnd: 'oklch(0.15 0.02 240 / 80%)',
  /** コンテンツエリア背景 */
  contentBackground: 'oklch(0.18 0.02 240 / 60%)',
  /** グラデーションオーバーレイ（画像上） */
  overlay: {
    start: 'oklch(0.09 0.01 240 / 90%)',
    middle: 'oklch(0.09 0.01 240 / 40%)',
    end: 'transparent',
  },
} as const;


