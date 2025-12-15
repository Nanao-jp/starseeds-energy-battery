/**
 * 日本の地域定義
 * 地図のズーム機能で使用される地域情報
 */

export type RegionId =
  | "hokkaido"
  | "tohoku"
  | "kanto"
  | "chubu"
  | "kansai"
  | "chugoku"
  | "shikoku"
  | "kyushu"
  | "okinawa";

export interface Region {
  id: RegionId;
  name: string;
  center: [number, number]; // [経度, 緯度]
  scaleMultiplier: number; // 初期スケールに対する倍率
}

/**
 * 地域定義を取得
 */
export function getRegions(): Region[] {
  return [
    {
      id: "hokkaido",
      name: "北海道",
      center: [141.35, 43.06],
      scaleMultiplier: 2.2,
    },
    {
      id: "tohoku",
      name: "東北",
      center: [140.6, 39.5],
      scaleMultiplier: 2.5,
    },
    {
      id: "kanto",
      name: "関東",
      center: [139.7, 36.0],
      scaleMultiplier: 2.8,
    },
    {
      id: "chubu",
      name: "中部",
      center: [137.5, 36.0],
      scaleMultiplier: 2.5,
    },
    {
      id: "kansai",
      name: "関西",
      center: [135.5, 34.7],
      scaleMultiplier: 2.8,
    },
    {
      id: "chugoku",
      name: "中国",
      center: [133.0, 34.5],
      scaleMultiplier: 2.5,
    },
    {
      id: "shikoku",
      name: "四国",
      center: [133.5, 33.5],
      scaleMultiplier: 2.8,
    },
    {
      id: "kyushu",
      name: "九州",
      center: [130.5, 33.0],
      scaleMultiplier: 2.5,
    },
    {
      id: "okinawa",
      name: "沖縄",
      center: [127.68, 26.21],
      scaleMultiplier: 3.5,
    },
  ];
}

/**
 * 地域のスケール値を計算
 */
export function getRegionScale(region: Region, baseScale: number): number {
  return baseScale * region.scaleMultiplier;
}

