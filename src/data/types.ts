import type { LucideIcon } from "lucide-react";

export type ProjectStatus = "operational" | "construction" | "planning";

export interface Project {
  id: string;
  name: string;
  region: string;
  capacityMW: number;
  energyMWh: number;
  status: ProjectStatus;
  startDate?: string;
  plannedDate?: string;
  description: string;
  photos: string[];
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
