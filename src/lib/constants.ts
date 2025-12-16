/**
 * 地図関連の定数定義
 */

/**
 * 日本の中心座標（経度、緯度）
 */
export const JAPAN_CENTER: [number, number] = [138.0, 38.0];

/**
 * 地図のデフォルトサイズ
 */
export const MAP_DEFAULT_SIZE = {
  width: 1000,
  height: 700,
} as const;

/**
 * 地図の初期スケール
 * 全体表示時に北海道が見切れないように少し小さめに設定
 */
export const MAP_INITIAL_SCALE = 2000;

/**
 * 地域フィルタリングの閾値（度）
 * 地域の中心座標からこの範囲内のプロジェクトを表示
 */
export const REGION_FILTER_THRESHOLD = 5;

/**
 * レスポンシブ設定
 */
export const RESPONSIVE_CONFIG = {
  mobile: {
    maxWidth: 400,
    aspectRatio: 0.7,
    scale: 1800, // 全体表示時に北海道が見切れないように小さめに設定
  },
  tablet: {
    maxWidth: 800,
    aspectRatio: 0.7,
    scale: 2000, // 全体表示時に北海道が見切れないように小さめに設定
  },
  desktop: {
    width: MAP_DEFAULT_SIZE.width,
    height: MAP_DEFAULT_SIZE.height,
    scale: MAP_INITIAL_SCALE,
  },
} as const;

/**
 * 地図のスタイル設定
 */
export const MAP_STYLES = {
  stroke: {
    color: "#4ade80", // ネオングリーン（地図の輪郭線）
    width: 1.5,
  },
  grid: {
    color: "rgba(74, 222, 128, 0.2)",
    size: 40,
  },
  glow: {
    dropShadow: "rgba(74, 222, 128, 0.6)",
    radialGradient: "rgba(74, 222, 128, 0.15)",
  },
} as const;

/**
 * ヒーローセクションの設定
 */
export const HERO_CONFIG = {
  text: {
    line1: "Driven by Nature,",
    line2: "Empowered by Technology.",
  },
  typing: {
    speed: 60, // ミリ秒
    glowDelay: 300, // ミリ秒
  },
  video: {
    fadeDuration: 3000, // ミリ秒
    mobileBreakpoint: 768, // ピクセル
    sources: {
      mobile: "/video/hero_mobile.webm",
      desktop: "/video/hero.webm",
    },
  },
  zIndex: {
    overlay: 1,
    overlayGradient: 2,
    content: 10,
  },
} as const;

/**
 * ナビゲーション項目の型定義
 */
export interface NavItem {
  href: string;
  label: string;
}

/**
 * サイト設定
 */
export const SITE_CONFIG = {
  name: "Star seeds Energy",
} as const;

/**
 * チャットボット設定
 */
export const CHATBOT_CONFIG = {
  enabled: false, // UI表示を制御（ロジックは残す）
} as const;

/**
 * ヘッダー用ナビゲーション項目
 */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "HOME" },
  // { href: "/solutions", label: "ソリューション" }, // 一時的に非表示
  // { href: "/products", label: "製品・サービス" }, // 一時的に非表示
  { href: "/status", label: "実績・工事状況" },
  // { href: "/news", label: "ニュース" }, // 一時的に非表示
  { href: "/contact", label: "お問い合わせ" },
] as const;

/**
 * フッター用ナビゲーション項目（HOME除外）
 */
export const FOOTER_NAV_ITEMS: NavItem[] = NAV_ITEMS.filter(
  (item) => item.href !== "/"
);

/**
 * ホームページ用ナビゲーションカードの型定義
 */
export interface HomeNavigationCard {
  href: string;
  title: string;
  description: string;
  imgSrc: string;
}

/**
 * ホームページ用ナビゲーションカード
 */
export const HOME_NAVIGATION_CARDS: HomeNavigationCard[] = [
  // {
  //   href: "/solutions",
  //   title: "事業紹介",
  //   description: "系統用蓄電池の役割から、私たちのサービスと収益モデルについてご紹介します",
  //   imgSrc: "/images/nav-solutions.webp",
  // }, // 一時的に非表示
  // {
  //   href: "/products",
  //   title: "製品・技術",
  //   description: "コンテナ型BESSのラインナップ、最先端のEMS/BMS、そして安全性への取り組みについて",
  //   imgSrc: "/images/photo/photo-02.webp",
  // }, // 一時的に非表示
  {
    href: "/status",
    title: "実績・工事状況",
    description: "現在稼働中、建設中、そして計画中のプロジェクト一覧をご覧いただけます",
    imgSrc: "/images/nav-status.webp",
  },
  // {
  //   href: "/news",
  //   title: "ニュース",
  //   description: "最新のお知らせ、プレスリリース、イベント情報などを随時更新しています",
  //   imgSrc: "/images/nav-solutions.webp",
  // }, // 一時的に非表示
] as const;
