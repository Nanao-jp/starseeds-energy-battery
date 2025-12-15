import type { LucideIcon } from "lucide-react";

export type ProjectStatus = "operational" | "construction" | "planning";

export interface Project {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number]; // [経度, 緯度]
  capacityMW: number;
  energyMWh: number;
  status: ProjectStatus;
  startDate?: string;
  plannedDate?: string;
  description: string;
  photos: string[];
  // 追加情報
  purchaseFrom?: string; // 購入元
  powerArea?: string; // 電力エリア
  lotNumber?: string; // 地番
  landCategory?: string; // 地目
  type?: string; // 種別（販売、運用）
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: 'press-release' | 'event' | 'update';
  summary: string;
  content: string; // Markdown content
}

/**
 * KPIカードのデータ型定義
 */
export interface KpiData {
  /** Lucide Reactアイコンコンポーネント */
  icon: LucideIcon;
  /** 英語の値（サブテキスト） */
  value: string;
  /** 日本語のラベル（メインテキスト） */
  label: string;
  /** 日本語の説明文 */
  description: string;
}

/**
 * FeatureCardのデータ型定義
 */
export interface FeatureCardData {
  /** 画像のパス */
  imageSrc: string;
  /** 画像の代替テキスト */
  imageAlt: string;
  /** タイトル */
  title: string;
  /** 説明文 */
  description: string;
  /** アイコン名 */
  iconName: 'zap' | 'radio';
  /** 左右反転フラグ（画像を右側に配置） */
  reverse?: boolean;
}