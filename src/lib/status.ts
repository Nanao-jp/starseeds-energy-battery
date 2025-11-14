/**
 * プロジェクトステータス関連のユーティリティ関数と定数
 * ステータスのラベル、色、スタイルを一元管理
 */

import type { ProjectStatus } from "@/data/types";

/**
 * ステータスの日本語ラベル
 */
export const STATUS_LABELS: Record<ProjectStatus, string> = {
  operational: "稼働中",
  construction: "工事中",
  planning: "計画中",
} as const;

/**
 * ステータス別の色定義（Tailwindクラス）
 */
export const STATUS_COLORS = {
  /**
   * カード用の色（ボーダーとテキスト）
   */
  card: {
    operational: "text-blue-400 border-blue-400/30",
    construction: "text-yellow-400 border-yellow-400/30",
    planning: "text-gray-300 border-gray-300/30",
  },
  /**
   * モーダル用の色（テキスト、ボーダー、背景）
   */
  modal: {
    operational: "text-blue-400 border-blue-400/40 bg-blue-400/10",
    construction: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
    planning: "text-gray-300 border-gray-300/40 bg-gray-300/10",
  },
  /**
   * ピン用の色（hex値）
   */
  pin: {
    operational: "#60a5fa", // blue-400
    construction: "#fbbf24", // yellow-400
    planning: "#ffffff", // white
  },
} as const;

/**
 * ステータスの日本語ラベルを取得
 */
export function getStatusLabel(status: ProjectStatus): string {
  return STATUS_LABELS[status];
}

/**
 * カード用のステータス色クラスを取得
 */
export function getStatusColorForCard(status: ProjectStatus): string {
  return STATUS_COLORS.card[status];
}

/**
 * モーダル用のステータス色クラスを取得
 */
export function getStatusColorForModal(status: ProjectStatus): string {
  return STATUS_COLORS.modal[status];
}

/**
 * ピン用のステータス色（hex値）を取得
 */
export function getStatusColorForPin(status: ProjectStatus): string {
  return STATUS_COLORS.pin[status];
}

/**
 * ピン用の色からRGB値を取得
 */
export function getPinColorRGB(status: ProjectStatus): { r: number; g: number; b: number } {
  const hex = getStatusColorForPin(status);
  if (hex.startsWith("#")) {
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };
  }
  // デフォルト（白）
  return { r: 255, g: 255, b: 255 };
}

/**
 * タブ定義（すべてを含む）
 */
export const STATUS_TABS: Array<{ value: ProjectStatus | "all"; label: string }> = [
  { value: "all", label: "すべて" },
  { value: "operational", label: STATUS_LABELS.operational },
  { value: "construction", label: STATUS_LABELS.construction },
  { value: "planning", label: STATUS_LABELS.planning },
] as const;

