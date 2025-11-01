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
 * ホームページのナビゲーションカードデータ
 */
export interface NavigationCardData {
  href: string;
  title: string;
  description: string;
  imgSrc: string;
}

export const HOME_NAVIGATION_CARDS: NavigationCardData[] = [
  {
    href: '/solutions',
    title: '事業紹介',
    description: '系統用蓄電の役割から、私たちのサービスと収益モデルについてご紹介します。',
    imgSrc: '/images/nav-solutions.webp',
  },
  {
    href: '/products',
    title: '製品・技術',
    description: 'コンテナ型BESSのラインナップ、最先端のEMS/BMS、そして安全性への取り組みについて。',
    imgSrc: '/images/photo/photo-02.webp',
  },
  {
    href: '/status',
    title: '実績・工事状況',
    description: '現在稼働中、建設中、そして計画中のプロジェクト一覧をご覧いただけます。',
    imgSrc: '/images/nav-status.webp',
  },
];

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
      mobile: '/video/hero_mobile.webm', // 最軽量版（1MB以下を目標）
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

