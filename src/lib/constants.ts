/**
 * サイト全体で使用する定数
 */

export interface NavItem {
  href: string;
  label: string;
}

/**
 * ヘッダーナビゲーション項目（HOME含む）
 */
export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'HOME' },
  { href: '/solutions', label: '事業紹介' },
  { href: '/products', label: '製品・技術' },
  { href: '/status', label: '実績・工事状況' },
  { href: '/news', label: 'ニュース' },
  { href: '/company', label: '会社情報' },
  { href: '/contact', label: '問い合わせ' },
];

/**
 * フッターナビゲーション項目（HOME除外）
 */
export const FOOTER_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter(item => item.href !== '/');

/**
 * サイト設定
 */
export const SITE_CONFIG = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'Starseeds energy Battery',
  logo: {
    src: '/images/logo.png',
    alt: 'Starseeds energy Battery Logo',
    width: 180,
    height: 45,
  },
} as const;

/**
 * ヒーローセクション設定
 */
export const HERO_CONFIG = {
  text: {
    line1: "Driven by Nature,",
    line2: "Empowered by Technology.",
  },
  video: {
    fadeDuration: 3000, // クロスフェード時間（ミリ秒）
    mobileBreakpoint: 768, // モバイル判定のブレークポイント（px）
    sources: {
      desktop: '/video/hero_light.webm',
      mobile: '/video/hero_ultralight.webm',
    },
  },
  typing: {
    speed: 60, // ミリ秒
    glowDelay: 300, // ミリ秒
  },
  zIndex: {
    background: 0,
    overlay: 1,
    overlayGradient: 2,
    content: 10,
  },
} as const;

